import ImageCard from "./ImageCard";
import type { PGImage } from "@/pages/Property/Details/PGImages";

interface Props {
    images: PGImage[];
    onPreview: (index: number) => void;
    onDelete: (image: PGImage) => void;
    onMakeCover: (imageId: string) => void;
}

export default function ImagesGrid({
    images,
    onPreview,
    onDelete,
    onMakeCover,
}: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((image, index) => (
                <ImageCard
                    key={image.id}
                    image={image}
                    onClick={() => onPreview(index)}
                    onDelete={() => onDelete(image)}
                    onMakeCover={() => onMakeCover(image.id)}
                />
            ))}
        </div>
    );
}
