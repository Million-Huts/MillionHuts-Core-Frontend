import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    isLoading?: boolean;
    confirmText?: string;
}

export default function ConfirmDeleteModal({
    isOpen,
    title,
    description,
    onClose,
    onConfirm,
    isLoading = false,
    confirmText = "Delete"
}: ConfirmDeleteModalProps) {

    const handleConfirm = async () => {
        await onConfirm();
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
            <DialogContent className="sm:max-w-[400px] border-border bg-popover shadow-2xl">
                <div className="flex flex-col items-center pt-4 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mb-4 animate-pulse">
                        <AlertTriangle className="h-7 w-7" />
                    </div>
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground px-2">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <DialogFooter className="mt-8 flex flex-row gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 font-semibold hover:bg-accent transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={cn(
                            "flex-1 font-semibold shadow-lg shadow-destructive/20 transition-all active:scale-95",
                            isLoading && "opacity-80"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}