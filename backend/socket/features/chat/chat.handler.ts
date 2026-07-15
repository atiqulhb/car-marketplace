import { conversationRoom } from "./chat.room"

export function registerChatHandler(socket: any, io: any, context: any) {
    // socket.on('chat:send-message', async (payload) => {

    //     const { roomId, message } = payload

    //     if (!roomId || !message) {
    //         socket.emit('chat:error', { error: 'Missing roomId or message' })
    //         return
    //     }
    //     console.log(`User ${socket.id} sent message to room ${roomId}: ${message}`)
    //     socket.to(roomId).emit('chat:receive-message', { roomId, message })

    // })

    socket.on('conversation:join', (conversationId: string) => {
        console.log('conversation join invoked')
        socket.join(conversationRoom(conversationId))
        console.log(`${socket.id} joined conversation ${conversationId}`)
    })

    socket.on('conversation:leave', (conversationId: string) => {
        socket.leave(conversationRoom(conversationId))
        console.log(`${socket.id} left conversation ${conversationId}`)
    })
}