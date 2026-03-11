import { ExternalLink, X, ZoomIn } from "lucide-react";

interface Media {
    id: string;
    fileUrl: string;
}

export default function ComplaintMediaGrid({ media, onDelete, isRaiser }: any) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {media.map((m: Media) => (
                <div
                    key={m.id}
                    className="group relative aspect-square rounded-sm overflow-hidden border-4 border-background shadow-lg bg-muted transition-all duration-500 hover:shadow-primary/10 hover:border-primary/20"
                >
                    <img
                        src={m.fileUrl}
                        alt="Evidence"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Architectural Overlay */}
                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                        <a
                            href={m.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="h-10 w-10 bg-white rounded-sm flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all text-slate-950"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>

                        {isRaiser && (
                            <button
                                onClick={() => onDelete(m.id)}
                                className="h-10 w-10 bg-rose-500 rounded-full flex items-center justify-center shadow-xl hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Visual Badge for Zoom */}
                    <div className="absolute bottom-4 right-4 h-8 w-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                        <ZoomIn className="w-4 h-4 text-white/70" />
                    </div>
                </div>
            ))}
        </div>
    );
}