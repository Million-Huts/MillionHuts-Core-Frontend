import { Trash2, Star, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PGImage } from "@/pages/Property/Details/PGImages";

type Props = {
    image: PGImage;
    onClick: () => void;
    onDelete: () => void;
    onMakeCover: () => void;
}

export default function ImageCard({ image, onClick, onDelete, onMakeCover }: Props) {
    return (
        <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted border border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
            {/* Image Layer */}
            <img
                src={image.url}
                alt="Property asset"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Cover Badge */}
            {image.isCover && (
                <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-xl border border-white/20">
                    <Star className="h-3 w-3 fill-white" /> Cover
                </div>
            )}

            {/* Actions Toolbar */}
            <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <ActionButton icon={Maximize2} onClick={onClick} label="View" />

                {!image.isCover && (
                    <ActionButton
                        icon={Star}
                        onClick={(e: any) => { e.stopPropagation(); onMakeCover(); }}
                        label="Set Cover"
                        className="hover:text-yellow-400"
                    />
                )}

                <ActionButton
                    icon={Trash2}
                    onClick={(e: any) => { e.stopPropagation(); onDelete(); }}
                    label="Delete"
                    className="hover:text-destructive"
                />
            </div>
        </div>
    );
}

function ActionButton({ icon: Icon, onClick, label, className }: any) {
    return (
        <button
            onClick={onClick}
            title={label}
            className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-xl text-white transition-all hover:bg-white hover:text-black",
                className
            )}
        >
            <Icon size={20} strokeWidth={2.5} />
        </button>
    );
}