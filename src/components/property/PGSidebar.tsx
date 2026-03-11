import { Link, useLocation } from "react-router-dom";
import {
    Info,
    FileText,
    Image as ImageIcon,
    ShieldCheck,
    Coffee,
    ChevronRight,
    Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePG } from "@/context/PGContext";

interface Props {
    pgId: string;
}

export default function PGSidebar({ pgId }: Props) {
    const { pathname } = useLocation();
    const { pgs } = usePG();


    const currentPg = pgs.find((p) => p.id === pgId);

    const menuItems = [
        { label: "Basic Info", icon: Info, to: `/pgs/${pgId}/basic`, desc: "Name, address & location" },
        { label: "Property Details", icon: FileText, to: `/pgs/${pgId}/details`, desc: "Type, occupancy & stats" },
        { label: "Media & Gallery", icon: ImageIcon, to: `/pgs/${pgId}/images`, desc: "Visuals & assets" },
        { label: "House Rules", icon: ShieldCheck, to: `/pgs/${pgId}/rules`, desc: "Policies & restrictions" },
        { label: "Amenities", icon: Coffee, to: `/pgs/${pgId}/amenities`, desc: "Facilities & utilities" },
    ];

    return (
        <div className="flex flex-col h-full py-6 px-3 space-y-8">
            {/* Header */}
            <div className="px-4 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Settings2 className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                        Configuration
                    </h2>
                    <p className="text-[11px] font-bold text-foreground">Property Setup</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname.includes(item.to);
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={cn(
                                "group relative flex items-center justify-between p-3.5 rounded-sm transition-all duration-300",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "hover:bg-muted/60 text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={cn(
                                    "p-2.5 rounded-full transition-colors",
                                    isActive ? "bg-white/20" : "bg-muted group-hover:bg-background"
                                )}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black">{item.label}</span>
                                    <span className={cn(
                                        "text-[9px] leading-tight font-medium opacity-70 mt-0.5",
                                        isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                                    )}>
                                        {item.desc}
                                    </span>
                                </div>
                            </div>

                            <ChevronRight className={cn(
                                "h-4 w-4 transition-transform duration-300",
                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50 group-hover:translate-x-1"
                            )} />
                        </Link>
                    );
                })}
            </nav>

            {/* ID Footer */}
            <div className="mt-auto px-4">
                <div className="p-4 rounded-sm bg-muted/30 border border-border/50">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Property
                    </p>
                    <p className="font-mono text-[11px] font-medium text-foreground tracking-tight">
                        {currentPg?.name}
                    </p>
                </div>
            </div>
        </div>
    );
}