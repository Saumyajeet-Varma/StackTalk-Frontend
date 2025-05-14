import socket from "socket.io-client"

let socketInstance = null

export const initializeSocket = (projectId) => {

    socketInstance = socket(import.meta.env.VITE_BACKEND_URL, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId
        }
    })

    return socketInstance
}

export const receiveMessageSocket = (eventName, cb) => {
    socketInstance.on(eventName, cb)
}

export const sendMessageSocket = (eventName, data) => {
    socketInstance.emit(eventName, data)
}