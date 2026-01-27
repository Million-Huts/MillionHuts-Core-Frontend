import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PGContentWrapper from "@/components/property/PGContentWrapper";
import { apiPrivate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import ImagesGrid from "@/components/property/Images/ImagesGrid";
import ImagePreviewModal from "@/components/property/Images/ImagePreviewModal";
import DeleteImageModal from "@/components/property/Images/DeleteImageModal";
import UploadImagesView from "@/components/property/Images/UploadImagesView";
import toast from "react-hot-toast";

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

    const fetchImages = async () => {
        try {
            const res = await apiPrivate.get(`/pgs/${pgId}/images`);
            setImages(res.data.images);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, [pgId]);

    if (loading) {
        return <PGContentWrapper>Loading...</PGContentWrapper>;
    }

    if (uploadMode) {
        return (
            <PGContentWrapper>
                <UploadImagesView
                    pgId={pgId!}
                    onCancel={() => setUploadMode(false)}
                    onUploaded={fetchImages}
                />
            </PGContentWrapper>
        );
    }

    return (
        <PGContentWrapper>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setUploadMode(true)}>Add Images</Button>
            </div>

            <ImagesGrid
                images={images}
                onPreview={setPreviewIndex}
                onDelete={setDeleteImage}
                onMakeCover={async (imageId: string) => {
                    try {
                        await apiPrivate.patch(`/pgs/${pgId}/images/cover-image`, {
                            imageId,
                        });
                        setImages((prev) =>
                            prev.map((img) => ({
                                ...img,
                                isCover: img.id === imageId,
                            }))
                        );
                        toast.success("Cover image updated");
                    } catch {
                        toast.error("Failed to update cover image");
                    }
                }}
            />

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
                            await apiPrivate.delete(
                                `/pgs/${pgId}/images/remove/${deleteImage.id}`
                            );
                            setImages((prev) =>
                                prev.filter((img) => img.id !== deleteImage.id)
                            );
                            toast.success("Image deleted");
                        } catch {
                            toast.error("Failed to delete image");
                        } finally {
                            setDeleteImage(null);
                        }
                    }}
                />
            )}
        </PGContentWrapper>
    );
}
