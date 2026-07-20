import { Server } from "socket.io"
import type { Server as HTTPServer } from "node:http"

import { env } from './config/env'

let io : Server | null = null

export function initializeSocket(server:HTTPServer) {
    io = new Server(server, {
        cors: {
            origin: env.FRONTEND_URL,
            credenials: true
        }
    })

    io.on("connection", (socket) => {
        console.log("socket connected", socket.id)
        
        socket.on("disconnect", () => {
            console.log("socket disconnected", socket.id)
        })
    })

    return io
}

export function getIO() {
    if(!io) {
        throw new Error("Socket not initilized")
    }

    return io
}