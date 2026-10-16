"use client"
import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

export function useScannerCamera(onScanSuccess: (decodedText: string) => void) {
    const [permisoDenegado, setPermisoDenegado] = useState(false)

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { 
                fps: 10, 
                qrbox: { width: 250, height: 150 },
                aspectRatio: 1.0
            },
            false
        )

        scanner.render(
            (decodedText) => {
                scanner.clear()
                onScanSuccess(decodedText)
            },
            (errorMessage) => {
                const errorStr = String(errorMessage).toLowerCase()
                if (errorStr.includes("notallowederror") || errorStr.includes("permission denied")) {
                    setPermisoDenegado(true)
                }
            }
        )

        return () => {
            scanner.clear().catch(console.error)
        }
    }, [onScanSuccess])

    return { permisoDenegado }
}