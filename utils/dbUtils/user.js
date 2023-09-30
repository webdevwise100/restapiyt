import prisma from '@/lib/prismaClient';
import bcrypt from 'bcrypt';

export const createUser = async (data) => {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        if (data.email) {
            const existingEmail = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existingEmail) {
                throw new Error('Email is already taken.');
            }
        }

        if (data.username) {
            const existingUsername = await prisma.user.findUnique({
                where: { username: data.username },
            });

            if (existingUsername) {
                throw new Error('Username is already taken.');
            }
        }

        const result = await prisma.user.create({
            data: {
                'email': data.email,
                'username': data.username,
                'password': hashedPassword
            }
        })
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getUserbyEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email : email
            },
          });    
          return user;
    } catch (error) {
        throw new Error(error.message);
    }

}