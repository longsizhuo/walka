import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GEMINI! });

export async function safeChatWithGemini({
                                             message,
                                             sessionId,
                                             history = [],
                                         }: {
    message: string;
    sessionId: string;
    history?: { role: string; parts: { text: string }[] }[];
}) {
    const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history,
    });

    // 第一次请求
    const response = await chat.sendMessage({ message });
    const text = response.text ?? "";

    // 尝试解析 JSON
    const result = tryExtractJson(text);
    if (result) return { json: result, raw: text };

    // 如果失败，构造补救 Prompt
    const retryPrompt = `
You just didn't return data in JSON format. Whether you understand my needs or not, you should judge my latest suggestions for travel destinations. Please return it again in legal JSON format.

Please don't have any explanations or extra words, just output JSON directly.
`;

    const retryResponse = await chat.sendMessage({ message: retryPrompt });
    const retryText = retryResponse.text ?? "";

    const retryJson = tryExtractJson(retryText);
    if (retryJson) return {
        success: true,
        json: retryJson,
        raw: retryText
    };

    return {
        success: false,
        raw: retryText,
        message: "Gemini failed to return valid JSON. Please try rephrasing your question.",
    };
}

// 应该返回两个参数: true: any, false: None. False的话, 外部再调用safeChatWithGemini(否则会变成递归)
export function tryExtractJson(raw: string): { success: true; json: any } | { success: false } {
    try {
        const json = JSON.parse(raw);
        return { success: true, json };
    } catch {
        const match = raw.match(/\{[\s\S]*}/);
        if (match) {
            try {
                const json = JSON.parse(match[0]);
                return { success: true, json };
            } catch {}
        }
    }
    return { success: false };
}

