// components/tenant/details/KYCSection.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, AlertCircle, ShieldCheck, ExternalLink } from "lucide-react";
import type { Kyc } from "@/interfaces/tenant";


export default function KYCSection({ kyc }: { kyc: Kyc[] }) {
    if (!kyc || kyc.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 bg-muted/10 rounded-sm border-2 border-dashed border-border/60 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                    <AlertCircle className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-bold">No Documents Found</h3>
                <p className="text-sm text-muted-foreground max-w-[240px] text-center mt-2">
                    This resident hasn't uploaded any compliance documents yet.
                </p>
                <Button className="mt-6 rounded-sm font-bold px-6 shadow-lg shadow-primary/20" variant="default">
                    Request KYC Upload
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-in slide-in-from-bottom-4 duration-500">
            {kyc.map((item) => (
                <Card
                    key={item.id}
                    className="group overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-sm"
                >
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-5">
                                {/* Document Icon with Status Glow */}
                                <div className={`relative p-4 rounded-full transition-colors duration-300 ${item.status === 'VERIFIED'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-primary/10 text-primary'
                                    }`}>
                                    <FileText size={28} strokeWidth={1.5} />
                                    {item.status === 'VERIFIED' && (
                                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 ring-2 ring-background">
                                            <ShieldCheck size={12} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p className="font-black text-foreground tracking-tight leading-none uppercase text-xs text-muted-foreground/70">
                                        Document Type
                                    </p>
                                    <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                        {item.documentType}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                            {item.documentNo}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-between self-stretch">
                                <Badge
                                    variant="outline"
                                    className={`font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border-none ${item.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-500' :
                                        item.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' :
                                            'bg-amber-500/10 text-amber-500'
                                        }`}
                                >
                                    {item.status}
                                </Badge>

                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="rounded-sm h-9 px-4 font-bold text-xs bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                    <Eye size={14} className="mr-2" /> View File
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Quick Action Card */}
            <div className="lg:col-span-2 mt-4 p-6 rounded-sm bg-primary/[0.03] border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-bold text-primary/80">
                    <ShieldCheck size={18} />
                    All documents are encrypted and stored securely
                </div>
                <Button variant="link" className="text-xs font-black uppercase tracking-widest text-primary p-0">
                    Audit Logs <ExternalLink size={12} className="ml-1" />
                </Button>
            </div>
        </div>
    );
}