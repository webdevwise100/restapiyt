import { createTodo, getTodoById, getTodos } from "@/utils/dbUtils/todo";
import { validateToken } from "@/utils/tokenUtils/validateToken";
import { NextResponse } from "next/server"
import z from 'zod'

const todoSchema = z.object({
    title: z.string(),
    completed: z.boolean().optional(),
}).strict();

function validateTodoSchema(data) {
    try {
        const parseData = todoSchema.parse(data);
        return parseData;
    } catch (error) {
        if (error.issues && error.issues.length > 0) {
            const validationErrors = error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message
            }))
            throw new Error(JSON.stringify(validationErrors, null, 2))
        }
        else {
            throw new Error('Invalid Schema.')
        }
    }
}

export const POST = async (request) => {
    try {
        const token = request.headers.get('Authorization');
        const jsonData = await request.json();

        const tokenValidated = await validateToken(token);
        const jsonValidated = validateTodoSchema(jsonData)

        let todoResult;
        if (tokenValidated.userId) {
            todoResult = await createTodo(tokenValidated.userId, jsonValidated)
        }

        return NextResponse.json({ "Todo": todoResult }, { status: 200 })
    }
    catch (error) {
        let errorMessage;
        try {
            errorMessage = JSON.parse(error.message)
        } catch (parseError) {
            errorMessage = error.message
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}

export const GET = async (request) => {

    try {
        const token = request.headers.get('Authorization');
        const tokenValidated = await validateToken(token);

        const url = new URL(request.url);

        let completed = url.searchParams.get('completed');
        if (completed === 'true') {
            completed = true;
        }else {
            completed = false;
        }

        let todoResult;
        if (tokenValidated.userId) {
            todoResult = await getTodos(tokenValidated.userId, completed)
        }
        return NextResponse.json({ "Todos": todoResult }, { status: 200 });
    }
    catch (error) {
        let errorMessage;
        try {
            errorMessage = JSON.parse(error.message)
        } catch (parseError) {
            errorMessage = error.message
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

}

