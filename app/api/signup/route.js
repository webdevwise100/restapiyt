import { createUser } from '@/utils/dbUtils/user';
import z from 'zod'
import { NextResponse } from 'next/server';

const createUserSchema = z.object({
    email : z.string().email(),
    username : z.string(),
    password : z.string()
}).strict();

function validateUserSchema (data){
    try{
        const parseData = createUserSchema.parse(data);
        return parseData;
    }catch(error){
        if(error.issues && error.issues.length>0){
            const validationErrors = error.issues.map((issue) => ({
                path : issue.path.join('.'),
                message: issue.message
            }))
            throw new Error (JSON.stringify(validationErrors, null, 2))
        }
        else {
            throw new Error ('Invalid Schema.')
        }
    }
}

export const POST = async (request) => {
    try{
        //get the details provided by user
        const json = await request.json();
        //understand whether the details are correct as expect.
        const validatedUser = validateUserSchema(json);
        //whether the details exist in system or not
        const createUserResult = await createUser(validatedUser);
        //retun the result
        return NextResponse.json(createUserResult, {status : 200});
    }catch (error){
        let errorMessage;
        try {
            errorMessage = JSON.parse(error.message)
        }catch (parseError){
            errorMessage = error.message
        }
        return NextResponse.json({error: errorMessage}, {status: 500})
    }
}