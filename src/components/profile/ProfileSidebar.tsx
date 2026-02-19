import { User, Lock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Props {
    activeTab: "profile" | "password";
    setActiveTab: (tab: "profile" | "password") => void;
}

export default function ProfileSidebar({ activeTab, setActiveTab }: Props) {
    const items = [
        { id: "profile", label: "Profile Information", icon: User },
        { id: "password", label: "Security & Password", icon: Lock },
    ];

    return (
        <div className="flex flex-col gap-2 bg-white">
            {/* Nav List: Flex-row on mobile, column on desktop */}
            <div className="flex overflow-x-auto md:flex-col bg-card border rounded-2xl p-2 gap-1 no-scrollbar shadow-sm">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === item.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                    </button>
                ))}

                <div className="h-px bg-border my-2 hidden md:block" />

                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all whitespace-nowrap"
                >
                    <Settings className="h-4 w-4" />
                    Global Settings
                </Link>
            </div>
        </div>
    );
}