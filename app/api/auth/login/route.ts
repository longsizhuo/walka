import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // 查找用户
    const user = await prisma.user.findUnique({
        where: { email },
    });

    // 简单验证密码
    if (!user || user.password !== password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 返回用户信息，修改了返回的内容，增加了cookies
    const response = NextResponse.json({
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    });

    // 设置 cookie：保存 isLoggedIn = '1'
    response.cookies.set('isLoggedIn', '1'); 
    return response;
}
