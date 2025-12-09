import React, { ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

const DialogComponent = ({ trigger, title, description }: { trigger: ReactNode, title: string, description: string }) => {
    return (
        <div>
            <Dialog>
                <DialogTrigger>{trigger}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DialogComponent
