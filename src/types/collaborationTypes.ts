import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext"
import type { currentPositionType, Shape } from "./canvasTypes"
import type { TOOLS_NAME } from "./toolsTypes"
import type { IInteractionBehavior } from "@/canvas/InteractionBehaviour/baseclass"

type MessageType = {
    type : MessageEnum,
    name : string,
    message? : string
    roomId : string
}

export  type recievedMessageType =  {
    type : MessageEnum,
    message : ISession
}

export interface IContext { 
    rawX : number,
    rawY : number,
    x : number,
    y : number,
}

export enum MessageEnum {
    JOIN_ROOM = "join-room",
    REMOVE_ROOM = "remove-room",
    SAVE_DRAW_STATE = "save-draw-state",
    SESSION_CREATED = "create-session",
    SESSION_UPDATED = "update-session",
    SESSION_DELETED = "delete-session",
}


export interface ISession {
    tool : TOOLS_NAME,
    context : string,
    config : TextOptionsPlusGeometricOptions

}

export interface IDeletedSession extends Omit<ISession, "TOOLS_NAME"| "state"> {
    shape : Shape,
    state : {
        clicked : boolean,
        dragged : boolean
    }
}
