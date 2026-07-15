import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export function useSocket() {
    const socket = getSocket()

    useEffect(() => {
        if (!socket.connected) {
            socket.connect()
        }
    }, [socket])

    return socket
}