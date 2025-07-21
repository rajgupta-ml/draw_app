import socketManager from "@/manager/socketManager"

export function generateMessage (type : string, message? : string) {
    const roomId = socketManager.getRoomId
    const name = socketManager.getName

    return {
        type,
        name : name!,
        roomId : roomId!,
        message
    }
}