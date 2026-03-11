import { Moon, Sun, Snowflake, Zap, Check } from "lucide-react";
import { useTheme, type Theme } from "@/context/ThemeContext";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const THEMES: { id: Theme; label: string; icon: any; color: string }[] = [
    { id: "light", label: "Cloud (Light)", icon: Sun, color: "bg-white border-slate-200" },
    { id: "dark", label: "Stone (Dark)", icon: Moon, color: "bg-slate-900 border-slate-700" },
    { id: "nord", label: "Arctic (Nord)", icon: Snowflake, color: "bg-[#2E3440] border-[#4C566A]" },
    { id: "midnight", label: "OLED (Midnight)", icon: Zap, color: "bg-black border-zinc-800" },
];

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    // Find current theme details for the trigger icon
    const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];
    const Icon = currentTheme.icon;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-full bg-muted/50 hover:bg-accent transition-all duration-300 shadow-sm"
                >
                    <Icon className="h-[1.2rem] w-[1.2rem] transition-all" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-2 rounded-sm glass border-border/50">
                <div className="grid gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-2">
                        Select Theme
                    </p>
                    {THEMES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={cn(
                                "relative flex w-full items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all group",
                                theme === t.id
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {/* Theme Swatch */}
                            <div className={cn("h-6 w-6 rounded-full border shadow-inner flex items-center justify-center", t.color)}>
                                <t.icon className={cn("h-3 w-3", theme === t.id ? "text-primary" : "text-white/50")} />
                            </div>

                            <span className="flex-1 text-left">{t.label}</span>

                            {theme === t.id && (
                                <motion.div layoutId="active-check">
                                    <Check className="h-4 w-4" />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}