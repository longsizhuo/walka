// app/api/gemini/init/route.ts
import {NextRequest, NextResponse} from "next/server";
import 'dotenv/config';
import {GoogleGenAI} from "@google/genai";
import { PrismaClient } from "@prisma/client";
import {saveMessages} from "@/app/components/SaveMessage";
import {safeChatWithGemini, tryExtractJson} from "@/app/components/geminiJSON";

const prisma = new PrismaClient();
const ai = new GoogleGenAI(({apiKey: process.env.API_KEY_GEMINI}))

export async function POST(req: NextRequest){
    try {
        console.log("用户要求更新数据");
        const { message, sessionId } = await req.json();

        if (!message || !sessionId) {
            return NextResponse.json({ error: "Missing message or sessionId" }, { status: 400 });
        }

        // History messages
        const historyMessages = await prisma.message.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
        })
        const history = historyMessages.map((msg) => ({
            role: msg.role,
            parts: [{text: msg.content}],
        }));

        // 创建多轮会话对象
        const chat  = ai.chats.create({
            model: "gemini-1.5-flash",
            history: history,
        });

        const response = await chat.sendMessage({
            message,
        })

        const text = response.text ?? "No response from Gemini";
        // 保存消息记录, 无论是否能解析, 都先记住
        await saveMessages({
            email: "test@example.com", //TODO: 临时值, 要记得改
            sessionId,
            userMessage: message,
            modelReply: text,
        });

        // 5️⃣ 尝试解析 JSON
        const parsed = tryExtractJson(text);
        if (parsed.success) {
            return NextResponse.json({ ...parsed.json, sessionId });
        }

        // 6️⃣ 如果失败，使用补救 prompt 再试一次
        const retry = await safeChatWithGemini({ message, sessionId, history: [...history, {
                role: 'user',
                parts: [{ text: message }]
            }] });

        if (retry.success && typeof retry.json === 'object') {
            await saveMessages({
                email: "test@example.com",
                sessionId,
                userMessage: "[Save Prompt]",
                modelReply: retry.raw,
            });

            return NextResponse.json({
                ...retry.json,
                sessionId,
            });
        }

        // 7️⃣ 最终失败：返回提示
        await saveMessages({
            email: "test@example.com",
            sessionId,
            userMessage: "[系统提示]",
            modelReply: retry.raw,
        });
        // TODO:我失败了, 但是前端还没有接受我
        console.log("我失败了, 但是前端还没有接受我")
        return NextResponse.json({
            error: "Gemini failed to return valid JSON. Please try rephrasing.",
            sessionId,
            raw: retry.raw,
            message: "Gemini failed to return valid JSON. Please try rephrasing.",
        });

    } catch (error) {
        console.error("Error in Gemini update API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}