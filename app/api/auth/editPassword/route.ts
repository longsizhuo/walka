import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: Request) {
    const body = await req.json();
    const { email, password, newPassword } = body;

    if (!email || !password || !newPassword) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    };

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        return NextResponse.json({ error: 'User does not exist' }, { status: 401 });
    }
    if (password !== existingUser.password) {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
    if (existingUser.password == newPassword){
        return NextResponse.json({message: 'New password cannot be the same as before'}, { status: 400 })
    };

    const updatedUser = await prisma.user.update({
        where: {email},
        data: {
            password: newPassword
        }
    });

    return NextResponse.json({
        message: 'User password changed successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
        },
    });
}