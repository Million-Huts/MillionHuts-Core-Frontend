import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PGImage } from "@/pages/Property/Details/PGImages";

interface Props {
    images: PGImage[];
    index: number;
    onClose: () => void;
    onChangeIndex: (index: number) => void;
}

export default function ImagePreviewModal({ images, index, onClose, onChangeIndex }: Props) {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && index > 0) onChangeIndex(index - 1);
            if (e.key === "ArrowRight" && index < images.length - 1) onChangeIndex(index + 1);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [index, onClose, onChangeIndex, images.length]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
            {/* Close Button */}
            <button className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors" onClick={onClose}>
                <X size={32} />
            </button>

            {/* Navigation Controls */}
            {index > 0 && (
                <button className="absolute left-6 p-4 text-white/70 hover:text-white transition-transform hover:scale-110" onClick={() => onChangeIndex(index - 1)}>
                    <ChevronLeft size={48} />
                </button>
            )}

            <AnimatePresence mode="wait">
                <motion.img
                    key={images[index].id}
                    src={images[index].url}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
                />
            </AnimatePresence>

            {index < images.length - 1 && (
                <button className="absolute right-6 p-4 text-white/70 hover:text-white transition-transform hover:scale-110" onClick={() => onChangeIndex(index + 1)}>
                    <ChevronRight size={48} />
                </button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-6 font-black tracking-widest text-white/50 text-xs uppercase">
                {index + 1} / {images.length}
            </div>
        </div>
    );
}