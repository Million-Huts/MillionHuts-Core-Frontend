import { Trash2, Star } from "lucide-react";
import type { PGImage } from "@/pages/Property/Details/PGImages";

interface Props {
    image: PGImage;
    onClick: () => void;
    onDelete: () => void;
    onMakeCover: () => void;
}

export default function ImageCard({
    image,
    onClick,
    onDelete,
    onMakeCover,
}: Props) {
    return (
        <div
            className="group relative overflow-hidden rounded-xl cursor-pointer"
            onClick={onClick}
        >
            <img
                src={image.url}
                alt=""
                className="h-56 w-full object-cover"
            />

            {/* Hover Mask */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />

            {/* Actions */}
            <div
                className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition"
                onClick={(e) => e.stopPropagation()}
            >
                {!image.isCover && (
                    <button
                        onClick={onMakeCover}
                        className="rounded-full bg-white p-2 hover:bg-gray-100"
                    >
                        <Star size={18} />
                    </button>
                )}
                <button
                    onClick={onDelete}
                    className="rounded-full bg-white p-2 hover:bg-gray-100"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {image.isCover && (
                <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                    Cover
                </span>
            )}
        </div>
    );
}
