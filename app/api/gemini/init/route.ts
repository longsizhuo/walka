// app/api/gemini/init/route.ts
import {NextRequest, NextResponse} from "next/server";
import {GeminiPromptStructTourism} from "@/app/api/prompt";
import { saveMessages } from "@/app/components/SaveMessage";
import 'dotenv/config';
import {GoogleGenAI} from "@google/genai";
import {safeChatWithGemini, tryExtractJson} from "@/app/components/geminiJSON";

const ai = new GoogleGenAI(({apiKey: process.env.API_KEY_GEMINI}))

// 首页, 用于接收用户首次生成
export async function POST(req: NextRequest){
    try {
        const {message} = await req.json();
        // we can support stream response here
        const response = await ai.models.generateContent(
            {
                model: "gemini-1.5-flash",
                contents: `${GeminiPromptStructTourism}\n\n
                         Users query:${message}\n
                         `
            }
        );
        const text = response.text ?? "No response from Gemini";

        // 保存消息记录, 无论是否能解析, 都先记住
        const sessionId = crypto.randomUUID(); // 随机ID
        await saveMessages({
            email: "test@example.com", // TODO: 临时值, 要记得改
            sessionId,
            userMessage: message,
            modelReply: text,
        });
        const parsed = tryExtractJson(text);
        if (parsed.success) {
            return NextResponse.json({...parsed.json, sessionId});
        }

        // 如果失败，尝试用二次 prompt 要求输出 JSON
        const retry = await safeChatWithGemini({message, sessionId});
        if (retry.success && typeof retry.json === 'object') {
            await saveMessages({
                email: "test@example.com", // TODO: 临时值, 要记得改
                sessionId,
                userMessage: "[Save Prompt]",
                modelReply: retry.raw,
            });
            return NextResponse.json({
                ...retry.json,
                sessionId
            });
        } else {
            // 处理失败的情况
            await saveMessages({
                email: "test@example.com", // TODO: 临时值, 要记得改
                sessionId,
                userMessage: "[系统提示]",
                modelReply: retry.raw,
            });
            return NextResponse.json({
                success: false,
                message: "Gemini failed to return valid JSON. Please try rephrasing your question.",
                raw: retry.raw,
                sessionId
            });
        }

    } catch (error) {
        console.error("Error in Gemini init API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}