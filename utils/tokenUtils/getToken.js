import prisma from "@/lib/prismaClient"
import { getUserbyEmail } from "../dbUtils/user"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const generateToken = async (email, password) => {
    try {
        
        const user = await getUserbyEmail(email);

        if(!user || !(await bcrypt.compare(password, user.password))){
            throw new Error ('Invalid Credentials');
        }

        const token = jwt.sign({userId : user.id}, process.env.JWT_SECRET, 
            {expiresIn : '24hr'});

        await prisma.authToken.create({
            data: {
                token,
                userId: user.id
            }
        })

        return token;

    } catch (error) {
        throw new Error(error.message)
    }
}