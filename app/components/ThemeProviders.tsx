"use client"
import { createContext, useEffect, useState } from "react"
import { Theme } from "@radix-ui/themes"
import { SunIcon, MoonIcon } from "@radix-ui/react-icons"

export const ThemeContext = createContext({
    isDark: false,
    toggleTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(false)

    // Load theme preference on first render
    useEffect(() => {
        const storedTheme = localStorage.getItem("kiosco-theme")
        if (storedTheme === "dark") {
            setIsDark(true)
            document.documentElement.classList.add("dark")
        }
    }, [])

    // Toggle logic for both Tailwind and Radix
    const toggleTheme = () => {
        const newDarkState = !isDark
        setIsDark(newDarkState)
        
        if (newDarkState) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("kiosco-theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("kiosco-theme", "light")
        }
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {/* We pass the dynamic appearance to Radix */}
            <Theme appearance={isDark ? "dark" : "light"} accentColor="iris" radius="medium">
                
                {/* Global Floating Toggle Button */}
                <div className="fixed top-5 right-5 z-50">
                    <button 
                        onClick={toggleTheme}
                        className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#33589c] bg-white dark:bg-gray-800 text-[#33589c] dark:text-white transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
                        aria-label="Toggle Theme"
                    >
                        {isDark ? <SunIcon width="24" height="24" /> : <MoonIcon width="24" height="24" />}
                    </button>
                </div>

                {children}

            </Theme>
        </ThemeContext.Provider>
    )
}