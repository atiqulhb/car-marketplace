import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'

export function SocketProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const socket = getSocket()

        socket.connect()

        socket.on('connect', () => {
            console.log('Connected to socket server', socket.id)
        })

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server')
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    return <>{children}</>
}