import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// saveMessage save user message and model reply in one time
export async function saveMessages({
   email = 'test@example.com',
   sessionId,
   userMessage,
   modelReply,
}: {
    email: string;
    sessionId: string;
    userMessage: string;
    modelReply: string;
}) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.warn('Not Exist User! Seriously?');
        return;
    }

    // Atomic transaction to save user message and model reply
    await prisma.$transaction([
        prisma.message.create({
            data: {
                content: userMessage,
                role: 'user',
                sessionId,
                senderId: user.id,
            },
        }),
        prisma.message.create({
            data: {
                content: modelReply,
                role: 'model',
                sessionId,
                senderId: user.id,
            },
        }),
    ]);

}
