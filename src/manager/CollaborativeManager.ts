import type { CanvasManager } from "./CanvasManager";
import { MessageEnum, type IContext, type ISession, type recievedMessageType } from "@/types/collaborationTypes";
import type { BehaviorContext } from "@/canvas/InteractionBehaviour/baseclass";
import { TOOLS_NAME } from "@/types/toolsTypes";
import type { ICommand } from "@/canvas/UndoAndRedoCmd/baseClass";
import type { Shape } from "@/types/canvasTypes";



export class CollaborativeBehaviorManager { 

    private oldTool : TOOLS_NAME = TOOLS_NAME.RECT;
    constructor (private canvasManager : CanvasManager) {
        
    }
    createSession(context : IContext){
        const session: ISession= {
            tool : this.canvasManager.selectedTool,
            context : JSON.stringify(context),
            config: this.canvasManager.config
        }
        this.oldTool= this.canvasManager.selectedTool;
        this.canvasManager.broadcastMessage(MessageEnum.SESSION_CREATED, JSON.stringify(session))
    }

    updateSession(context : IContext){
        const session : ISession  = {
            tool : this.canvasManager.selectedTool,
            config: this.canvasManager.config,
            context : JSON.stringify(context),
        }
        this.canvasManager.broadcastMessage(MessageEnum.SESSION_UPDATED, JSON.stringify(session))
    }

    endSession ( context : IContext) {
        const session : ISession  = {
            tool : this.canvasManager.selectedTool,
            config : this.canvasManager.config,  
            context : JSON.stringify(context),  
    
        }
        this.canvasManager.broadcastMessage(MessageEnum.SESSION_DELETED, JSON.stringify(session))
    }

    handleIncomingMessage(receivedMessage : recievedMessageType) {
        const {message, type} = receivedMessage
        const {config, context,tool} = message
        const behavior = this.canvasManager.interactionBehaviours.get(tool);
        this.canvasManager.selectedTool = tool;
        if(!behavior){
            return;
        }
        const parsedContext = JSON.parse(context);
        this.canvasManager.config = config;
        switch(type) {
            case MessageEnum.SESSION_CREATED:
                behavior.onMouseDown(this.createNewContextBehavior(parsedContext));
                break;
            case MessageEnum.SESSION_UPDATED:
                behavior.onMouseMove(this.createNewContextBehavior(parsedContext));    
                break;     
            case MessageEnum.SESSION_DELETED:
                behavior.onMouseUp(this.createNewContextBehavior(parsedContext));
                behavior.resetState();
                this.canvasManager.selectedTool = this.oldTool
                break;
            default:
                console.warn("Unknown message type received:", type);
    }

}

    createNewContextBehavior(context : IContext) : BehaviorContext {
        return {
            calledFromCollaborationManager : true,
            manager : this.canvasManager,
            collaborativeManager : this,
            rawX : context.rawX,
            rawY : context.rawY,
            x : context.x,
            y : context.y,
            executeCanvasCommnad: (command: ICommand) => this.canvasManager.executeCmd(command),
            isPointInShape: (shape: Shape, px: number, py: number) => {
                const renderer = this.canvasManager.getRendererForShape(shape);
                return renderer ? renderer.isPointInShape(shape, px, py) : false;
            },
            setScrollPositionX: (x: number) => (this.canvasManager.scrollPositionX = x),
            setScrollPositionY: (y: number) => (this.canvasManager.scrollPositionY = y),
        }
    }

    // handleIncomingMessage(recievedShape : recievedMessageType) {
    //     const {type, message} = recievedShape;
    //     if(!message){
    //         return
    //     }

    //     switch (type) {
    //         case MessageEnum.SESSION_CREATED:
    //             this.activeSession.set(message.sessionId, message);

    //         case MessageEnum.SESSION_UPDATED : 
    //         {
    //             const payload = message;
    //             const behavior = this.canvasManager.interactionBehaviours.get(payload.tool);
    //             if (!behavior) return;
    //             behavior.updateState(JSON.parse(payload.interactionBehaviour));
    //             this.activeSession.set(message.sessionId, message);
    //             this.previewCollaborativeShape(message.sessionId)
    //             break;
    //         }

    //         case MessageEnum.SESSION_DELETED: {
    //             const endPayload = message as ISession;

    //             const behavior = this.canvasManager.interactionBehaviours.get(endPayload.tool);
    //             if (!behavior) return;
    //             behavior.updateState(JSON.parse(endPayload.interactionBehaviour));            
    //             switch(endPayload.tool) {
    //                 case TOOLS_NAME.ERASER: {
    //                     const removedShapes = JSON.parse(endPayload.interactionBehaviour).shapesToMarkForRemoval as Map<string, { shape: Shape; index: number }>
    //                     console.log("removedShapes:", removedShapes);
    //                     const shapeToRemove = Array.from(removedShapes.values()).sort((a ,b) => b.index - a.index)
    //                     shapeToRemove.forEach(({ shape, index }) => {
    //                         this.canvasManager.executeCmd(new RemoveShapeCommand(this.canvasManager, shape, index));
    //                       });
    //                     break;
    //                 }
    //                 default: {
    //                     const behavior = this.canvasManager.interactionBehaviours.get(message.tool);
    //                     if(!behavior || !behavior?.createNewShape){
    //                         return
    //                     }
    //                     const newShape = behavior.createNewShape(this.canvasManager) as Shape;
    //                     if (newShape) {
    //                         this.canvasManager.executeCmd(new AddShapeCommand(this.canvasManager, newShape));                            
    //                     }
    //                     break;
    //                 }
    //             }
    //             this.activeSession.delete(message.sessionId);
    //             // this.previewCollaborativeShape(message.sessionId);
    //             // this.canvasManager.drawCanvas(); // Redraw to show the final state.
    //             break;
    //         }

    //         default :
    //         console.warn("Unknown message type received:", type);
    //     }
    // }


    // previewCollaborativeShape = (sessionId: string) => {
    // const session = this.activeSession.get(sessionId);
    // if (!session) {
    //     return;
    // }

    // const { tool , config } = session;
    // const { offScreenCanvasctx, interactionBehaviours } = this.canvasManager;

    // const behavior = interactionBehaviours.get(tool) as IInteractionBehavior;
    
    // if (!behavior?.previewShape) {
    //     return;
    // }

    // try{
    //     offScreenCanvasctx.save();
    //     // offScreenCanvasctx.globalAlpha = 0.2;
    //     offScreenCanvasctx.save();

    //     offScreenCanvasctx.resetTransform();
    //     offScreenCanvasctx.clearRect(
    //         0,
    //         0,
    //         this.canvasManager.canvas.width,
    //         this.canvasManager.canvas.height,
    //     );
    
    //     this.canvasManager.renderShapeOntoCanvas();
    //     behavior.previewShape(this.canvasManager, config);
    //     // Render the preview from the off-screen canvas
    //     this.canvasManager.ctx.clearRect(0, 0, this.canvasManager.canvas.width, this.canvasManager.canvas.height);
    //     this.canvasManager.ctx.drawImage(this.canvasManager.offScreenCanvas, 0, 0);
    // }finally{
    //     offScreenCanvasctx.restore();
    //     behavior.resetState();

        
    // }

    // }

}