// pages/Property/PGImages/components/UploadImagesView.tsx
import { useState } from "react";
import { Upload, X, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";

export default function UploadImagesView({ pgId, onCancel, onUploaded }: any) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        setUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        try {
            await apiPrivate.post(`/pgs/${pgId}/images`, formData);
            toast.success("Gallery updated successfully");
            onUploaded();
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div
                className="group relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 transition-colors hover:bg-muted/20"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    setFiles([...files, ...Array.from(e.dataTransfer.files)]);
                }}
            >
                <input
                    type="file" multiple hidden id="imageUpload"
                    onChange={(e) => setFiles([...files, ...Array.from(e.target.files || [])])}
                />
                <label htmlFor="imageUpload" className="flex flex-col items-center cursor-pointer px-10 text-center">
                    <div className="mb-4 rounded-full bg-background p-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Drop images here</h3>
                    <p className="text-sm text-muted-foreground mt-1">Supports JPG, PNG, WEBP. Max 5MB per file.</p>
                </label>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {files.map((file, i) => (
                        <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-muted border">
                            <img src={URL.createObjectURL(file)} className="h-full w-full object-cover" />
                            <button
                                onClick={() => removeFile(i)}
                                className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    <label htmlFor="imageUpload" className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed cursor-pointer hover:bg-muted transition-colors">
                        <ImagePlus className="text-muted-foreground/40" />
                    </label>
                </div>
            )}

            <div className="flex items-center gap-3 pt-4">
                <Button onClick={handleUpload} disabled={files.length === 0 || uploading} className="min-w-[120px]">
                    {uploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Start Upload"}
                </Button>
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
        </div>
    );
}