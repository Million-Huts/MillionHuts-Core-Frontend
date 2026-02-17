import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

export default function UploadImagesView({
    pgId,
    onCancel,
    onUploaded,
}: {
    pgId: string;
    onCancel: () => void;
    onUploaded: () => void;
}) {
    const [files, setFiles] = useState<File[]>([]);

    const handleUpload = async () => {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        try {
            await apiPrivate.post(
                `/pgs/${pgId}/images`,
                formData
            );
            onUploaded();
            toast.success("Images uploaded");
            onCancel();
        } catch {
            toast.error("Upload failed");
        }
    };

    return (
        <div className="space-y-4">
            <div
                className="flex h-40 items-center justify-center rounded-xl border border-dashed text-gray-500"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    setFiles([...files, ...Array.from(e.dataTransfer.files)]);
                }}
            >
                <input
                    type="file"
                    multiple
                    hidden
                    id="imageUpload"
                    onChange={(e) =>
                        setFiles([...files, ...Array.from(e.target.files || [])])
                    }
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                    Drop images here or click to upload
                </label>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {files.map((file, i) => (
                        <img
                            key={i}
                            src={URL.createObjectURL(file)}
                            className="h-24 w-full rounded object-cover"
                        />
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={files.length === 0}>
                    Upload
                </Button>
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}
