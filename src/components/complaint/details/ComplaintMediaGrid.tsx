import { ExternalLink, X } from "lucide-react";

interface Media {
    id: string;
    fileUrl: string;
}

export default function ComplaintMediaGrid({ media, onDelete, isRaiser }: any) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {media.map((m: Media) => (
                <div key={m.id} className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                        src={m.fileUrl}
                        alt="Evidence"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <a
                            href={m.fileUrl}
                            target="_blank"
                            className="p-2 bg-white rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 text-slate-900" />
                        </a>

                        {isRaiser && (
                            <button
                                onClick={() => onDelete(m.id)}
                                className="p-2 bg-rose-500 rounded-full hover:bg-rose-600 transition-colors text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}