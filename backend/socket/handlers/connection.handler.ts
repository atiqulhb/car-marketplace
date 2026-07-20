import { registerChatHandler } from '../features/chat/chat.handler'

export function registerConnectionHandler(io: any, context: any) {
    console.log(io)
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id)

        registerChatHandler(socket, io, context)
    })
}