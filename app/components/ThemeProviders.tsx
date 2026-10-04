"use client"
import { Theme } from "@radix-ui/themes"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import ThemeToggleButton from "./ThemeToggleButton" // Asegurá la ruta correcta

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <Theme appearance="inherit" accentColor="iris" radius="medium">
                <ThemeToggleButton />
                {children}
            </Theme>
        </NextThemesProvider>
    )
}