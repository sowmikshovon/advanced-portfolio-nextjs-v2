"use client";

import React, { createContext, useEffect, useState, useContext } from "react";

type Theme = "light" | "dark";

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeContextProvider({
  children,
}: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    try {
      window.localStorage.setItem("theme", nextTheme);
    } catch {
      // Ignore storage access errors in restricted browsing contexts.
    }
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  // The theme is read from localStorage/matchMedia after mount on purpose, so the
  // server-rendered HTML and the first client render match (no hydration mismatch).
  // The inline <head> script already applies the "dark" class on <html> pre-paint.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let localTheme: Theme | null = null;
    try {
      const stored = window.localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        localTheme = stored;
      }
    } catch {
      // Ignore storage access errors.
    }

    const isDark =
      localTheme === "dark" ||
      (!localTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setTheme(isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
}
