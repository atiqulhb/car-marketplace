import { useMutation } from "@tanstack/react-query";
import { sendMessageAction } from "@/actions/sendMessageAction";

export function useSendMessage() {
    const { mutate: sendMessage } = useMutation({
        mutationFn: ({ conversationId, message } ) => {
            
            if (!conversationId) {
                throw new Error("Conversation ID is required to send a message.");
            }
            return sendMessageAction({ conversationId, message })
        }
    })

    return { sendMessage }
}