// components/property/Images/DeleteImageModal.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { PGImage } from "@/pages/Property/Details/PGImages";

export default function DeleteImageModal({
    image,
    onClose,
    onConfirm,
}: {
    image: PGImage;
    onClose: () => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] p-0 max-h-[90vh] overflow-y-scroll border-none bg-background/95 backdrop-blur-xl shadow-2xl">
                {/* Visual Danger Header */}
                <div className="h-2 bg-destructive/20" />

                <div className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Destructive Icon Glow */}
                        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive ring-8 ring-destructive/5">
                            <AlertCircle className="h-8 w-8" />
                        </div>

                        <div className="space-y-2">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-center">
                                    Delete this photo?
                                </DialogTitle>
                            </DialogHeader>
                            <DialogDescription className="text-muted-foreground text-sm">
                                This action cannot be undone. This image will be permanently removed from your property gallery.
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Mini Preview of what's being deleted */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 rounded-xl overflow-hidden border-4 border-muted/30 aspect-video bg-muted"
                    >
                        <img
                            src={image.url}
                            alt="To be deleted"
                            className="w-full h-full object-cover grayscale-[0.5]"
                        />
                    </motion.div>
                </div>

                <DialogFooter className="p-6 bg-muted/30 gap-3 sm:gap-0 flex-row justify-center sm:justify-end">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 sm:flex-none font-semibold hover:bg-background"
                    >
                        Keep Photo
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="flex-1 sm:flex-none shadow-lg shadow-destructive/20 gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Permanently
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}