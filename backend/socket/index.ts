import { Server } from 'socket.io'
import { registerConnectionHandler } from './handlers/connection.handler'
import { env } from '../config/env'

let io: Server | null = null

export function initializeSocket(httpServer: any, context: any) {
    
    io = new Server(httpServer, {
        cors: {
            origin: [env.FRONTEND_URL],
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    registerConnectionHandler(io, context)
}

export function getIO(): Server {
    if (!io) {
        throw new Error('Socket.io has not been initialized.')
    }
    
    return io
}