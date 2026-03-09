import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Define your theme types to match the CSS classes exactly
export type Theme = "light" | "dark" | "nord" | "midnight";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // 2. Initialize from localStorage with a fallback to system preference
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem("app-theme") as Theme;
        if (saved) return saved;

        // Fallback to system dark mode if no preference is saved
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    });

    // 3. Effect to update the DOM whenever the theme changes
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove all possible theme classes first
        root.classList.remove("light", "dark", "nord", "midnight");

        // Add the current selection
        root.classList.add(theme);

        // Persist the choice
        localStorage.setItem("app-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// 4. Custom hook for easy access
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};