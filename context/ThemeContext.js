"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Sun, Moon } from "lucide-react";
import { getToken, getAuthHeaders } from "@/lib/auth";

// ============================================================================
// 1. Theme Context Definition
// ============================================================================
const ThemeContext = createContext({
  theme: "light",
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
  user: null,
  mounted: false,
});

// ============================================================================
// 2. Theme Provider (Manages state, DOM class, and user-scoped MySQL/local sync)
// ============================================================================
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light"); // Default is light
  const [currentUser, setCurrentUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Apply theme class to <html> DOM element
  const applyThemeToDOM = (selectedTheme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (selectedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  const getStorageKey = (user) => {
    return user?.userId ? `dwellio_theme_user_${user.userId}` : "dwellio_theme_guest";
  };

  // Sync theme with active user profile from backend on mount
  useEffect(() => {
    setMounted(true);

    async function syncUserTheme() {
      const token = getToken();

      if (!token) {
        // Guest user: read local preference, default to 'light'
        const savedGuestTheme = localStorage.getItem("dwellio_theme_guest") || "light";
        setThemeState(savedGuestTheme);
        applyThemeToDOM(savedGuestTheme);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: getAuthHeaders(),
        });

        if (res.ok) {
          const json = await res.json();
          const user = json.data;
          setCurrentUser(user);

          // Priority: 1. DB theme from user record -> 2. Local cache -> 3. 'light'
          const cachedUserTheme = localStorage.getItem(`dwellio_theme_user_${user.userId}`);
          const activeTheme = user.theme || cachedUserTheme || "light";

          setThemeState(activeTheme);
          applyThemeToDOM(activeTheme);
          localStorage.setItem(`dwellio_theme_user_${user.userId}`, activeTheme);
        } else {
          const savedTheme = localStorage.getItem("dwellio_theme_guest") || "light";
          setThemeState(savedTheme);
          applyThemeToDOM(savedTheme);
        }
      } catch (err) {
        console.error("Theme sync error:", err);
        const fallbackTheme = localStorage.getItem("dwellio_theme_guest") || "light";
        setThemeState(fallbackTheme);
        applyThemeToDOM(fallbackTheme);
      }
    }

    syncUserTheme();
  }, []);

  // Set theme: updates UI immediately + background MySQL sync for authenticated user
  const setTheme = useCallback(
    async (newTheme) => {
      const validatedTheme = newTheme === "dark" ? "dark" : "light";

      // 1. Optimistic UI update
      setThemeState(validatedTheme);
      applyThemeToDOM(validatedTheme);

      // 2. Save in localStorage for the active user
      const storageKey = getStorageKey(currentUser);
      localStorage.setItem(storageKey, validatedTheme);

      // 3. If authenticated, sync with MySQL database in the background
      const token = getToken();
      if (token && currentUser?.userId) {
        try {
          await fetch("http://localhost:5000/api/users/theme", {
            method: "PATCH",
            headers: getAuthHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ theme: validatedTheme }),
          });
        } catch (err) {
          console.error("Failed to sync theme preference to backend:", err);
        }
      }
    },
    [currentUser]
  );

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
        setTheme,
        user: currentUser,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// 3. Custom Hook (useTheme)
// ============================================================================
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// ============================================================================
// 4. Theme Toggle Component (ThemeToggle)
// ============================================================================
export function ThemeToggle({ className = "" }) {
  const { toggleTheme, isDark, mounted } = useTheme();

  // Prevent hydration layout shift
  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 animate-pulse ${className}`} />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 
        ${
          isDark
            ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300"
            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
        } 
        focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}

export default useTheme;
