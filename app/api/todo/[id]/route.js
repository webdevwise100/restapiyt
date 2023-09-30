import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from "@/utils/dbUtils/todo";
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

export const PATCH = async (request, context) => {
    try {
        const token = request.headers.get('Authorization');
        const jsonData = await request.json();

        const tokenValidated = await validateToken(token);
        const jsonValidated = validateTodoSchema(jsonData)

        let todoResult;
        if (tokenValidated.userId) {
            todoResult = await updateTodo(Number(context.params.id),tokenValidated.userId, jsonValidated)
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

export const DELETE = async (request, context)=>{
    try {
        const token = request.headers.get('Authorization');

        const tokenValidated = await validateToken(token);

        let todoResult;
        if (tokenValidated.userId) {
            todoResult = await deleteTodo(Number(context.params.id),tokenValidated.userId)
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