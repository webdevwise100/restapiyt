import jwt from 'jsonwebtoken'
export const validateToken = async (token) => {
    try {
        let errorMessage;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET,
            function (err, decoded) {
                if (err) {
                    throw new Error(err.message)
                } else {
                    return decoded
                }
            });

        return decodedToken

    } catch (error) {
        throw new Error(error.message)
    }
}