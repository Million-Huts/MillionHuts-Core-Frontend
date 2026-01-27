import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Image</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-600">
                    Are you sure you want to delete this image?
                </p>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
