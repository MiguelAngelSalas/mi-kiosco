"use client"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@radix-ui/react-icons"
import { useMounted } from "@/app/hooks/useMounted"

export default function ThemeToggleButton() {
    const { setTheme, resolvedTheme } = useTheme()
    const mounted = useMounted() // Usamos el hook
    
    if (!mounted) return null 

    const isDark = resolvedTheme === "dark"

    return (
        <div className="fixed top-5 right-5 z-50">
            <button 
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#33589c] bg-white dark:bg-gray-800 text-[#33589c] dark:text-white transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
                aria-label="Alternar Tema"
            >
                {isDark ? <SunIcon width="24" height="24" /> : <MoonIcon width="24" height="24" />}
            </button>
        </div>
    )
}