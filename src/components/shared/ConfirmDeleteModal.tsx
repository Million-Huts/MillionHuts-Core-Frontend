// components/shared/ConfirmDeleteModal.tsx
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({ isOpen, title, description, onClose, onConfirm }: any) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <div className="flex flex-col items-center pt-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription className="pt-2">{description}</DialogDescription>
                    </DialogHeader>
                </div>
                <DialogFooter className="mt-6 flex-row gap-2">
                    <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm} className="flex-1">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}