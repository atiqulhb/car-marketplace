import { getIO } from '../../../socket'
import { conversationRoom } from './chat.room'

export function emitMessage(conversationId: string, message: any) {
    getIO().to(conversationRoom(conversationId)).emit('message:new', message)
}