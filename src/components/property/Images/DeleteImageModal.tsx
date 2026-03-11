import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import type { PGImage } from "@/pages/Property/Details/PGImages";

export default function DeleteImageModal({
    image,
    onClose,
    onConfirm,
}: {
    image: PGImage;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}) {
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-scroll p-0 overflow-hidden rounded-sm border-none shadow-2xl">
                <div className="p-8 pb-4">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-black tracking-tighter">Delete photo?</DialogTitle>
                            <DialogDescription className="text-muted-foreground font-medium">
                                This action is irreversible. The image will be permanently removed from your gallery.
                            </DialogDescription>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 rounded-sm overflow-hidden border-4 border-muted/50 aspect-video bg-muted"
                    >
                        <img
                            src={image.url}
                            alt="Preview of image to be deleted"
                            className="w-full h-full object-cover grayscale opacity-80"
                        />
                    </motion.div>
                </div>

                <DialogFooter className="p-6 pt-2 gap-2 sm:gap-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 rounded-sm h-12 font-bold"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="flex-1 rounded-sm h-12 font-bold shadow-lg shadow-destructive/20 gap-2"
                    >
                        <Trash2 className="h-4 w-4" /> Delete Permanently
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}