import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative rounded-2xl h-10 w-10 hover:bg-accent/50 transition-colors overflow-hidden"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: 20, opacity: 0, rotate: 45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex items-center justify-center"
                >
                    {theme === "light" ? (
                        <Sun className="h-5 w-5 text-amber-500" />
                    ) : (
                        <Moon className="h-5 w-5 text-indigo-400" />
                    )}
                </motion.div>
            </AnimatePresence>
        </Button>
    );
}