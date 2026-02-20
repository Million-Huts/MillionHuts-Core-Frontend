// pages/Property/PGImages/PGImages.tsx
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import ImagesGrid from "@/components/property/Images/ImagesGrid";
import ImagePreviewModal from "@/components/property/Images/ImagePreviewModal";
import DeleteImageModal from "@/components/property/Images/DeleteImageModal";
import UploadImagesView from "@/components/property/Images/UploadImagesView";

export interface PGImage {
    id: string;
    url: string;
    isCover: boolean;
}

export default function PGImages() {
    const { pgId } = useParams();
    const [images, setImages] = useState<PGImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadMode, setUploadMode] = useState(false);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const [deleteImage, setDeleteImage] = useState<PGImage | null>(null);

    const fetchImages = useCallback(async () => {
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}/images`);
            setImages(res.data.data.images);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load images");
        } finally {
            setLoading(false);
        }
    }, [pgId]);

    useEffect(() => { fetchImages(); }, [fetchImages]);

    const handleMakeCover = async (imageId: string) => {
        try {
            await apiPrivate.patch(`/pgs/${pgId}/images/${imageId}/cover`);
            setImages((prev) => prev.map((img) => ({ ...img, isCover: img.id === imageId })));
            toast.success("Cover image updated");
        } catch {
            toast.error("Failed to update cover");
        }
    };

    if (loading) return (
        <div className="flex h-64 flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Loading Gallery...</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Property Gallery</h2>
                    <p className="text-muted-foreground text-sm">High-quality photos increase booking chances by 40%.</p>
                </div>
                {!uploadMode && (
                    <Button onClick={() => setUploadMode(true)} className="gap-2 shadow-md">
                        <Plus className="h-4 w-4" /> Add Photos
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {uploadMode ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <UploadImagesView
                            pgId={pgId!}
                            onCancel={() => setUploadMode(false)}
                            onUploaded={() => { fetchImages(); setUploadMode(false); }}
                        />
                    </motion.div>
                ) : images.length > 0 ? (
                    <ImagesGrid
                        images={images}
                        onPreview={setPreviewIndex}
                        onDelete={setDeleteImage}
                        onMakeCover={handleMakeCover}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl bg-muted/30">
                        <div className="p-4 bg-background rounded-full shadow-sm mb-4">
                            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                        <p className="text-muted-foreground font-medium text-center">Your gallery is empty.</p>
                        <Button variant="link" onClick={() => setUploadMode(true)}>Upload your first photo</Button>
                    </div>
                )}
            </AnimatePresence>

            {/* Modals remain similarly logic-driven but styled via their own components */}
            {previewIndex !== null && (
                <ImagePreviewModal
                    images={images}
                    index={previewIndex}
                    onClose={() => setPreviewIndex(null)}
                    onChangeIndex={setPreviewIndex}
                />
            )}

            {deleteImage && (
                <DeleteImageModal
                    image={deleteImage}
                    onClose={() => setDeleteImage(null)}
                    onConfirm={async () => {
                        try {
                            await apiPrivate.delete(`/pgs/${pgId}/images/${deleteImage.id}`);
                            setImages((prev) => prev.filter((img) => img.id !== deleteImage.id));
                            toast.success("Image removed");
                        } catch {
                            toast.error("Failed to delete");
                        } finally {
                            setDeleteImage(null);
                        }
                    }}
                />
            )}
        </div>
    );
}