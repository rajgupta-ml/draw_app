"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { AlertTriangle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


interface IWarningDialog {
    warning : boolean,
    setWarning : React.Dispatch<React.SetStateAction<boolean>>
    handleDelete : () => void
}
export default function WarningDialog({warning, setWarning, handleDelete} : IWarningDialog) {

  return (

    <>
    {warning && (

        <div className="flex items-center justify-center min-h-screen bg-background">
    

        <Dialog open={warning} onOpenChange={setWarning}>
            <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Delete Old Drawing
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete your old shape? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>

            <div className="py-4">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Alternative:</strong> If you want to keep your old drawing, you can open the collaboration link
                    in incognito mode instead.
                </p>
                </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2 cursor-pointer">
                <AlertTriangle className="h-4 w-4" />
                Yes, Delete Shape
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        </div>
    )}
    </>
  )
}
