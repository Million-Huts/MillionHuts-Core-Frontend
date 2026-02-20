// components/property/PGSidebar.tsx
import { Link, useLocation } from "react-router-dom";
import {
    Info,
    FileText,
    Image as ImageIcon,
    ShieldCheck,
    Coffee,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    pgId: string;
}

export default function PGSidebar({ pgId }: Props) {
    const { pathname } = useLocation();

    const menuItems = [
        { label: "Basic Info", icon: Info, to: `/pgs/${pgId}/basic`, desc: "Name, address & location" },
        { label: "Property Details", icon: FileText, to: `/pgs/${pgId}/details`, desc: "Description & property type" },
        { label: "Media & Gallery", icon: ImageIcon, to: `/pgs/${pgId}/images`, desc: "Cover image & photos" },
        { label: "House Rules", icon: ShieldCheck, to: `/pgs/${pgId}/rules`, desc: "Policies & restrictions" },
        { label: "Amenities", icon: Coffee, to: `/pgs/${pgId}/amenities`, desc: "Facilities & services" },
    ];

    return (
        <div className="flex flex-col h-full p-4 md:p-6 space-y-6">
            <div className="px-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                    Property Configuration
                </h2>
            </div>

            <nav className="space-y-1.5">
                {menuItems.map((item) => {
                    const isActive = pathname.includes(item.to);
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={cn(
                                "group flex items-center justify-between p-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isActive ? "bg-white/20" : "bg-secondary group-hover:bg-background"
                                )}>
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{item.label}</span>
                                    <span className={cn(
                                        "text-[10px] leading-tight opacity-70",
                                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                                    )}>
                                        {item.desc}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight className={cn(
                                "h-4 w-4 transition-transform group-hover:translate-x-1",
                                isActive ? "opacity-100" : "opacity-0"
                            )} />
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto hidden md:block p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[11px] text-primary font-medium">
                    Property ID: <span className="font-mono opacity-60">{pgId.slice(-8)}</span>
                </p>
            </div>
        </div>
    );
}