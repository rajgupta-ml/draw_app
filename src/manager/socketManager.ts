import { MessageEnum, type recievedMessageType } from "@/types/collaborationTypes";

export class SocketManager {
    readonly BASE_URL = process.env.NODE_ENV !== "development" ?  process.env.BASE_URL : "ws://localhost:8080"
    ws : WebSocket | null = null
    name : string | null = null;
    roomId : string | null = null;
    roomJoined = false;
    constructor () {
        this.connect()
    } 

    connect () {

        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            console.warn("WebSocket connection already established or in progress.");
            return;
        }

        console.log(`Attempting to connect to ${this.BASE_URL}...`);
        try {
            // Create the WebSocket instance, which starts the connection process.
            this.ws = new WebSocket(this.BASE_URL!);
            if(this.ws){
                this.ws.onmessage = ((data) => {
                    if(data.data){
                        const parsedData = JSON.parse(data.data) as recievedMessageType ;
                        if(parsedData.type !== MessageEnum.JOIN_ROOM){
                            window.dispatchEvent(new CustomEvent("new-message", {detail : parsedData}))
    
                        }

                    }
                })




                this.ws.onerror = ((error) => {
                    console.log(error)
                })
            }
        } catch (error) {
            console.error("Error creating WebSocket connection:", error);
        }
    }


    sendMessage (data : string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error("Cannot send message, WebSocket is not connected.");
            return;
        }

        try {
            this.ws.send(data);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }

    joinRoom () {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.connect();
        }

        if(!this.getName || !this.getRoomId){
            console.error("Room and Name is required");
            return;
        }
        try {
            const data  = { type : "join-room", roomId : this.getRoomId, name : this.getName  } 
            const messageString = JSON.stringify(data);
            this.ws!.send(messageString);
            this.setRoomJoined = true
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }



    set setRoomId (roomId : string){
        this.roomId = roomId
    }

    get getRoomId () {
        return this.roomId
    }

    set setRoomJoined (bool : boolean){
        this.roomJoined = bool
    }

    get getRoomJoined () {
        return this.roomJoined
    }

    set setName (name : string) {
        this.name = name
    }


    get getName(){
        return this.name
    } 
}


export default new SocketManager()