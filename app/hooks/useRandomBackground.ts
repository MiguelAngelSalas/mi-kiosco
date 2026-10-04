import { useState, useEffect } from "react"
import { BACKGROUND_IMAGES } from "@/app/utils/constants" // Ajustá la ruta según tu carpeta

export function useRandomBackground(images: string[] = BACKGROUND_IMAGES, delayMs: number = 100) {
    const [currentBg, setCurrentBg] = useState<string>("")
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (images.length === 0) return

        const randomIndex = Math.floor(Math.random() * images.length)
        setCurrentBg(images[randomIndex])
        
        const timer = setTimeout(() => setIsVisible(true), delayMs)

        return () => clearTimeout(timer)
    }, [images, delayMs])

    return { currentBg, isVisible }
}