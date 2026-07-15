import { registerChatHandler } from '../features/chat/chat.handler'

export function registerConnectionHandler(io: any, context: any) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id)

        registerChatHandler(socket, io, context)
    })
}