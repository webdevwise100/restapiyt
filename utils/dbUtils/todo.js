import prisma from "@/lib/prismaClient";

export const createTodo = async (userId, todoData) => {
    try {
        const { title, completed = false } = todoData;
        const createdTodo = await prisma.todo.create({
            data: {
                title,
                completed,
                userId,
            },
        });

        return createdTodo;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getTodos = async (userId, completed) => {
    try {
        const getTodoResult = await prisma.todo.findMany({
            where: {
                userId: userId,
                completed: completed != null ? completed : undefined
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return getTodoResult;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getTodoById = async (userId, todoId) => {
    try {
        const getTodoResult = await prisma.todo.findMany({
            where: {
                id: todoId,
                userId: userId
            }
        })
        if(getTodoResult.length > 0){
            return getTodoResult;
        }
        else {
            throw new Error('No Data Found')
        }
    } catch (error) {
        throw new Error (error.message)
    }
}

export const updateTodo = async (id, userId, todoData) => {
    try {
        const { title, completed } = todoData;

        const updateResult = await prisma.todo.update({
            where: {
                id: id,
                userId: userId,
            },
            data: {
                title: title,
                completed: completed,
            },
        });

        return updateResult;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteTodo = async (id,userId) => {
    try {
        const deleteResult = await prisma.todo.delete({
          where: {
            id: id,
            userId: userId,
          },
        });
        return deleteResult;
      } catch (error) {
        throw new Error(error.message);
      }
}