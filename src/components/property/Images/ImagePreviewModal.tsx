import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PGImage } from "@/pages/Property/Details/PGImages";

interface Props {
    images: PGImage[];
    index: number;
    onClose: () => void;
    onChangeIndex: (index: number) => void;
}

export default function ImagePreviewModal({
    images,
    index,
    onClose,
    onChangeIndex,
}: Props) {
    const image = images[index];

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <button
                className="absolute right-4 top-4 text-white"
                onClick={onClose}
            >
                <X />
            </button>

            {index > 0 && (
                <button
                    className="absolute left-4 text-white"
                    onClick={() => onChangeIndex(index - 1)}
                >
                    <ChevronLeft size={32} />
                </button>
            )}

            <img src={image.url} className="max-h-[90%] max-w-[90%]" />

            {index < images.length - 1 && (
                <button
                    className="absolute right-4 text-white"
                    onClick={() => onChangeIndex(index + 1)}
                >
                    <ChevronRight size={32} />
                </button>
            )}
        </div>
    );
}
