// pages/Property/PGImages/components/ImageCard.tsx
import { Trash2, Star, Maximize2 } from "lucide-react";

export default function ImageCard({ image, onClick, onDelete, onMakeCover }: any) {
    return (
        <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted border border-border/40 transition-all hover:shadow-xl">
            <img
                src={image.url}
                alt="Property"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />

            {/* Cover Badge */}
            {image.isCover && (
                <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
                    <Star className="h-3 w-3 fill-current" /> Cover Photo
                </div>
            )}

            {/* Hover Actions Layer */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute inset-0 z-30 flex items-center justify-center gap-3 opacity-0 transition-all duration-300 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                <button
                    onClick={onClick}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors"
                >
                    <Maximize2 size={18} />
                </button>
                {!image.isCover && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onMakeCover(); }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-yellow-400 hover:text-black transition-colors"
                    >
                        <Star size={18} />
                    </button>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}