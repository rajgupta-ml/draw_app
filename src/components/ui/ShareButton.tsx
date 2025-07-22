"use client"

import { useRef, useState } from "react"
import { useCanvasManagerContext } from "@/context/useCanvasManager"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Play, Link, Copy, Check, Lock, Square, Loader2Icon } from "lucide-react"
import { Button } from "./button"
import { useMutation } from "@tanstack/react-query"
import { MUTATE } from "@/api/shareableApi"
import { cn } from "@/lib/utils"
import socketManager from "@/manager/socketManager"

const ShareButton = () => {
  const {postShapeData, createRoom} = MUTATE
  const { canvasManager } = useCanvasManagerContext()
  const [isMainDialogOpen, setMainDialogOpen] = useState(false)
  const [isShareableLinkOpen, setShareableLinkOpen] = useState(false)
  const [isLiveCollabOpen, setLiveCollabOpen] = useState(false)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const [shareableLink, setShareableLink] = useState("")
  const [liveCollabLink, setLiveCollabLink] = useState("")
  const [userName, setUserName] = useState("Accomplished Swan")
  const [isSessionActive, setIsSessionActive] = useState(false)
  const {mutate : postShapeMutate , isPending : postIsPending} = useMutation({mutationFn : postShapeData})
  const {mutate: createRoomMutate , isPending : createRoomIsPending} = useMutation({mutationFn : createRoom})
  const roomId = useRef<string | null>(null);



  const handleRoomCreation = () => {
    if(!roomId.current){
      roomId.current = crypto.randomUUID()
    }
    socketManager.setRoomId = roomId.current;
    const collabUrl = `http:/localhost:3000?roomId=${roomId.current}`
    createRoomMutate(
      { id: roomId.current, name: userName },
      {
        onSuccess: () => {
          setLiveCollabOpen(true)
          setLiveCollabLink(collabUrl)
        },
        onError: () => setMainDialogOpen(false)
      }
    )
  }
  
  const handleStartSession = async () => {
    // Generate live collaboration link
    const { shapes } = canvasManager
    socketManager.setName = userName,
    await new Promise((resolve) => {
      socketManager.joinRoom()
      setTimeout(resolve, 1000);
    })
    setIsSessionActive(true)
    setMainDialogOpen(false)
    setLiveCollabOpen(true)
    const JSONShape = JSON.stringify(shapes)
    postShapeMutate({id : socketManager.roomId! ,json : JSONShape})

  }

  const handleExportToLink = async () => {
    const { shapes } = canvasManager
    const JSONShape = JSON.stringify(shapes)


    const id = crypto.randomUUID();
    postShapeMutate({id,json : JSONShape})


    const mockUrl = `http://localhost:3000?id=${id}`
    setShareableLink(mockUrl)

    setMainDialogOpen(false)
    setShareableLinkOpen(true)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsLinkCopied(true)
      setTimeout(() => setIsLinkCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handleStopSession = () => {
    setIsSessionActive(false)
    setLiveCollabLink("")
    setLiveCollabOpen(false)
    console.log("Session stopped")
  }

  return (
    <>
      <Button
        className="w-full h-full p-2 px-3 bg-accent text-accent-foreground border-none hover:bg-accent/80 text-sm"
        onClick={() => setMainDialogOpen(true)}
      >
        Share
      </Button>

      {/* Main Share Dialog */}
      <Dialog open={isMainDialogOpen} onOpenChange={setMainDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
          <DialogTitle className="sr-only">Share Options</DialogTitle>
          <div className="space-y-6 p-6">
            {/* Live Collaboration Section */}
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-primary">Live collaboration</h2>
              <p className="text-muted-foreground text-sm">Invite people to collaborate on your drawing.</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what
                you draw.
              </p>
              <Button
                onClick={handleRoomCreation}
                className="cursor-pointer bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4" />
                Start session
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Shareable Link Section */}
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-primary">Shareable link</h3>
              <p className="text-muted-foreground text-sm">Export as a read-only link.</p>
              <Button
                onClick={handleExportToLink}
                className="cursor-pointer bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                {!postIsPending ? (
                  <>
                    <Link className="w-4 h-4" />
                    Export to Link
                  </>
                  
                ) : (
                  <Loader2Icon className="animate-spin"></Loader2Icon>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shareable Link Dialog */}
      <Dialog open={isShareableLinkOpen} onOpenChange={setShareableLinkOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
          <DialogTitle className="sr-only">Shareable Link</DialogTitle>
          <div className="space-y-6 p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">Shareable link</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Link</label>
                <div className="flex gap-2">
                  <Input value={shareableLink} readOnly className="bg-muted border-border text-foreground" />
                  <Button
                    onClick={() => copyToClipboard(shareableLink)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 flex items-center gap-2"
                  >
                    {isLinkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy link
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  The upload has been secured with end-to-end encryption, which means that Excalidraw server and third
                  parties can't read the content.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Live Collaboration Dialog */}
      <Dialog open={isLiveCollabOpen} onOpenChange={setLiveCollabOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
          <DialogTitle className="sr-only">Live Collaboration</DialogTitle>
          <div className="space-y-6 p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">Live collaboration</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your name</label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-muted border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Link</label>
                <div className="flex gap-2">
                  <Input value={liveCollabLink} readOnly className="bg-muted border-border text-foreground" />
                  <Button
                    onClick={() => copyToClipboard(liveCollabLink)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 flex items-center gap-2"
                  >
                    {isLinkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy link
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what
                  you draw.
                </p>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed">
                Stopping the session will disconnect you from the room, but you'll be able to continue working with the
                scene, locally. Note that this won't affect other people, and they'll still be able to collaborate on
                their version.
              </div>

              <Button
                  onClick={isSessionActive ? handleStopSession : handleStartSession}
                  className={cn("w-full  px-4 py-2 flex items-center gap-2 justify-center cursor-pointer",
                    isSessionActive
                      ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      : "bg-accent hover:bg-accent/90 text-accent-foreground",
                  )}
                >
                  <Square className="w-4 h-4" />
                  {isSessionActive ? "Stop session" : "Start session"}
                </Button>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ShareButton
