import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req:Request) {
    const body = await req.json();
    const { email, newName, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: 'need email and password to identify'}, { status: 400 });
    }


    const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!existingUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 401 });
      } 
      
      if (existingUser.password !== password) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
        
      if (existingUser.name == newName) {
            return NextResponse.json({ message: 'Same name' }, { status: 400 });
        }
        
      
      

    const updatedUser = await prisma.user.update({
        where: {email},
        data: {
            name : newName
        }
      });
      return NextResponse.json({
        message: 'User profile updated successfully',
        user: {
          email: updatedUser.email,
          name: updatedUser.name,
        },
      });   
}