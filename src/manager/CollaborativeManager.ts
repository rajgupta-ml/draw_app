import type { currentPositionType, Shape } from "@/types/canvasTypes";
import type { TOOLS_NAME } from "@/types/toolsTypes";
import type { CanvasManager } from "./CanvasManager";
import { AddShapeCommand } from "@/canvas/UndoAndRedoCmd/ShapeCommand";
import { MessageEnum, type IDeletedSession, type ISession, type recievedMessageType } from "@/types/collaborationTypes";
import type { TextOptionsPlusGeometricOptions } from "@/context/useConfigContext";
import { DEFAULT_CONFIG, shapeConfig } from "@/constants/canvasConstant";
import type { IInteractionBehavior } from "@/canvas/InteractionBehaviour/baseclass";




export class CollaborativeBehaviorManager { 

    private activeSession = new Map<string, ISession>()
    constructor (private canvasManager : CanvasManager) {
        
    }
    createSession (tool : TOOLS_NAME, currentPosition : currentPositionType, config : TextOptionsPlusGeometricOptions) : string {
        const sessionId = crypto.randomUUID();
        const session : ISession = {
            sessionId,
            tool,
            state : {
                currentPosition,
                clicked : true,
                dragged : false
            },
            config
        }
        this.activeSession.set(sessionId, session);
        this.canvasManager.broadcastMessage("create-session", JSON.stringify(session));
        return sessionId;
    }

    updateSession (sessionId : string, currentPosition : currentPositionType, config : TextOptionsPlusGeometricOptions) {
        const isActiveSession = this.activeSession.get(sessionId);
        if(!isActiveSession){
            return;
        }

        const newSession : ISession = {
            ...isActiveSession,
            state : {
                currentPosition,
                dragged : true,
                clicked : true
            },
            config 
        }
        
        this.canvasManager.drawCanvas();
        this.canvasManager.broadcastMessage("update-session", JSON.stringify(newSession));

        this.activeSession.set(sessionId, newSession)
    }

    endSession (sessionId : string, shape : Shape ) {
        const createdShape = shape
        const isActiveSession = this.activeSession.get(sessionId);
        if(!isActiveSession){
            return;
        }
        const newSession : IDeletedSession = {
            ...isActiveSession,
            shape,
            state : {
                dragged : false,
                clicked : false
            }
        }
        if(createdShape){
            this.canvasManager.executeCmd(new AddShapeCommand(this.canvasManager, shape));
            this.canvasManager.drawCanvas()
        }

        this.canvasManager.broadcastMessage("delete-session", JSON.stringify(newSession));
        this.activeSession.delete(sessionId);   
    }

    handleIncomingMessage = (shape : recievedMessageType) => {
        const {message, type} = shape
        if(!message){
            return;
        }
        const {sessionId } = message

        switch(type){
            case MessageEnum.SESSION_CREATED:
                this.activeSession.set(sessionId, (message as ISession))
                this.previewCollaborativeShape(sessionId);
                break;
            case MessageEnum.SESSION_UPDATED:
                const updateMessage = message as ISession
                const activeSession = this.activeSession.get(sessionId);
                if(!activeSession){
                    return;
                }

                const newSession : ISession = {...activeSession, ...updateMessage}
                this.activeSession.set(sessionId, newSession)
                this.previewCollaborativeShape(sessionId);
                break

            case MessageEnum.SESSION_DELETED:
                const deleteMessage = message as IDeletedSession
                const {shape} = deleteMessage;
                this.canvasManager.shapes.push(shape);
                this.canvasManager.drawCanvas();
                this.activeSession.delete(sessionId);   
                break

            default:
                return

        }

        
    }


    previewCollaborativeShape = (sessionId: string) => {
        // 1. Get the entire session for the collaborator
        const session = this.activeSession.get(sessionId);
        if (!session) {
            return;
        }
    
        const { tool, state, config } = session;
        const { offScreenCanvasctx, interactionBehaviours } = this.canvasManager;
    
        // 2. Get the correct behavior using the collaborator's tool
        const behavior = interactionBehaviours.get(tool) as IInteractionBehavior;
        if(behavior?.setPosition){
            behavior.setPosition(state.currentPosition)
        }

        if(behavior?.setClicked){
            behavior.setClicked(state.clicked)
        }

        if(behavior?.setDragged){
            behavior.setDragged(state.dragged)
        }
        if (!behavior?.previewShape) {
            return;
        }
    
        
        try{
            offScreenCanvasctx.save();
            offScreenCanvasctx.globalAlpha = 0.6;
            offScreenCanvasctx.save();
    
            offScreenCanvasctx.resetTransform();
            offScreenCanvasctx.clearRect(
              0,
              0,
              this.canvasManager.canvas.width,
              this.canvasManager.canvas.height,
            );
           
            this.canvasManager.renderShapeOntoCanvas();

            behavior.previewShape(this.canvasManager, config ?? DEFAULT_CONFIG);
            offScreenCanvasctx.restore();
            // Render the preview from the off-screen canvas
            this.canvasManager.ctx.clearRect(0, 0, this.canvasManager.canvas.width, this.canvasManager.canvas.height);
            this.canvasManager.ctx.drawImage(this.canvasManager.offScreenCanvas, 0, 0);
        }finally{
            if(behavior?.setPosition){
                behavior.setPosition({startX : 0, startY : 0, endX : 0, endY : 0})
            }
    
            if(behavior?.setClicked){
                behavior.setClicked(false)
            }
    
            if(behavior?.setDragged){
                behavior.setDragged(false)
            }   
        }
    
        
    }

}