'use server'

import { keystoneFetch, getAuthedUser } from "@/lib/keystone";
import { SEND_MESSAGE_MUTATION } from "@/queries";

export async function sendMessageAction({ conversationId, message} ) {
    console.log('conversation id', conversationId)
    console.log('message', message)

    try {
         const authedUser = await getAuthedUser()

         console.log(authedUser)

         if (!authedUser) {
            throw new Error('Not logged in yet')
         }

        const res = await keystoneFetch(SEND_MESSAGE_MUTATION, {
        "data": {
            "content": message,
            "conversation": {
                "connect": {
                    "id": conversationId
                }
            },
            "sender": {
            "connect": {
                "id": authedUser.id
            }
            }
        }
    })

    console.log('resposnse from send message server action', res)

    return { success: true, error: false }
    } catch (error) {
        console.error('Failed to send message: ' + error.message)
        throw new Error('Failed to send message')
       
    }
   

}