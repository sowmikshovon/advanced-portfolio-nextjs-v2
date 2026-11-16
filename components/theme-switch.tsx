"use client";

import { useTheme } from "@/context/theme-context";
import React from "react";
import { BsMoon, BsSun } from "react-icons/bs";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
      className="no-print fixed bottom-5 right-5 z-50 flex h-[3rem] w-[3rem] cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white/80 shadow-2xl backdrop-blur-[0.5rem] transition-all hover:scale-[1.15] active:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-gray-950 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <BsSun aria-hidden="true" />
      ) : (
        <BsMoon aria-hidden="true" />
      )}
    </button>
  );
}
