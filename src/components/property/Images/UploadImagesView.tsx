import { useState } from "react";
import { Upload, X, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiPrivate } from "@/lib/api";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

type Props = {
    pgId: string;
    onCancel: () => void;
    onUploaded: () => void;
}

export default function UploadImagesView({ pgId, onCancel, onUploaded }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        try {
            await apiPrivate.post(`/pgs/${pgId}/images`, formData);
            toast.success("Gallery assets uploaded successfully");
            onUploaded();
        } catch {
            toast.error("Failed to upload images");
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Drop Zone */}
            <div
                className={cn(
                    "relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-[3px] border-dashed transition-all",
                    "border-muted-foreground/20 bg-muted/20 hover:border-primary/50 hover:bg-primary/5"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    setFiles([...files, ...Array.from(e.dataTransfer.files)]);
                }}
            >
                <input
                    type="file" multiple hidden id="imageUpload" accept="image/*"
                    onChange={(e) => setFiles([...files, ...Array.from(e.target.files || [])])}
                />
                <label htmlFor="imageUpload" className="flex flex-col items-center cursor-pointer px-10 text-center">
                    <div className="mb-6 rounded-full bg-background p-6 shadow-xl shadow-primary/5">
                        <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">Drag & drop your photos</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">Support for JPG, PNG, and WEBP. High-resolution images look best.</p>
                </label>
            </div>

            {/* File Queue */}
            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground">Ready to upload ({files.length})</h4>
                        <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-destructive h-8">
                            <Trash2 className="h-3 w-3 mr-2" /> Clear All
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {files.map((file, i) => (
                            <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl border-4 border-background shadow-lg">
                                <img src={URL.createObjectURL(file)} className="h-full w-full object-cover" />
                                <button
                                    onClick={() => removeFile(i)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        <label htmlFor="imageUpload" className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                            <ImagePlus className="text-muted-foreground" />
                        </label>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
                <Button onClick={handleUpload} disabled={files.length === 0 || uploading} className="rounded-full px-8 h-12 font-bold">
                    {uploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Save to Gallery"}
                </Button>
                <Button variant="ghost" onClick={onCancel} className="rounded-full px-8 h-12 font-bold">Cancel</Button>
            </div>
        </div>
    );
}