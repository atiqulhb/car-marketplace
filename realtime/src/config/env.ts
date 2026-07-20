import "dotenv/config"

export const env = {
    PORT: Number(process.env.PORT ?? 4000),
    FRONTEND_URL: process.env.FRONTEND_URL,
    SOCKET_SECRET: process.env.SOCKET_SECRET
}