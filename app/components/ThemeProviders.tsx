"use client"
import { useEffect, useState } from "react"
import { Theme } from "@radix-ui/themes"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@radix-ui/react-icons"

// Componente separado para el botón (necesita estar montado para saber el tema)
function ThemeToggleButton() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Solo renderizamos el botón una vez que estamos en el cliente
    useEffect(() => setMounted(true), [])
    
    if (!mounted) return null // Evita el flashazo y errores de hidratación en el ícono

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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        // next-themes maneja la clase "dark" en el <html> y el localStorage automáticamente
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            {/* appearance="inherit" le dice a Radix que lea el tema que next-themes le puso al <html> */}
            <Theme appearance="inherit" accentColor="iris" radius="medium">
                <ThemeToggleButton />
                {children}
            </Theme>
        </NextThemesProvider>
    )
}