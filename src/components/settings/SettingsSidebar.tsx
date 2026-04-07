import { Link, useLocation } from "react-router-dom";
import { User, ShieldCheck, Palette, Building2, Bell, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePG } from "@/context/PGContext";


export default function SettingsSidebar() {
    const { pathname } = useLocation();
    const { currentPG } = usePG();

    const SETTINGS_MENU = [
        {
            label: "Personal",
            items: [
                { name: "Account", href: `/pgs/${currentPG?.id}/settings/account`, icon: User },
                { name: "Security", href: `/pgs/${currentPG?.id}/settings/security`, icon: ShieldCheck },
                { name: "Notifications", href: `/pgs/${currentPG?.id}/settings/notifications`, icon: Bell },
            ]
        },
        {
            label: "App & Business",
            items: [
                { name: "Property Settings", href: `/pgs/${currentPG?.id}/settings/property`, icon: Building2 },
                { name: "Appearance", href: `/pgs/${currentPG?.id}/settings/appearance`, icon: Palette },
                { name: "Billing", href: `/pgs/${currentPG?.id}/settings/billing`, icon: CreditCard },
            ]
        }
    ];

    return (
        <nav className="flex-1 px-4 pb-4 space-y-8">
            {SETTINGS_MENU.map((group) => (
                <div key={group.label} className="space-y-1">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                        {group.label}
                    </p>
                    {group.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-bold transition-all group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-4 w-4 transition-transform group-hover:scale-110",
                                    isActive ? "text-primary-foreground" : "text-primary"
                                )} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}