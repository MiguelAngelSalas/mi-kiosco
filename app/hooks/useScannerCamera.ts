"use client"
import { useState, useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { toast } from "react-hot-toast"

export function useScannerCamera(onScanSuccess: (decodedText: string) => void) {
    const [permisoDenegado, setPermisoDenegado] = useState(false)
    const scannerRef = useRef<Html5Qrcode | null>(null)

    useEffect(() => {
        // 1. PRIMERA BARRERA: Si el div todavía no se dibujó, frenamos acá y no rompemos nada.
        if (!document.getElementById("reader")) {
            return
        }

        const html5QrCode = new Html5Qrcode("reader")
        scannerRef.current = html5QrCode
        
        let isMounted = true // Bandera de seguridad para evitar fugas de memoria

        const iniciarCamara = async () => {
            try {
                // Despertamos al celular y le pedimos la lista de cámaras primero.
                const devices = await Html5Qrcode.getCameras()
                
                if (devices && devices.length > 0) {
                    await html5QrCode.start(
                        { facingMode: "environment" },
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 150 },
                            aspectRatio: 1.0,
                        },
                        (decodedText) => {
                            if (scannerRef.current && scannerRef.current.isScanning) {
                                scannerRef.current.stop().then(() => {
                                    if (isMounted) onScanSuccess(decodedText)
                                }).catch(console.error)
                            }
                        },
                        (errorMessage) => {
                            // Ignoramos errores de frame a frame
                        }
                    )
                } else {
                    if (isMounted) {
                        toast.error("El dispositivo no reportó ninguna cámara.")
                        setPermisoDenegado(true)
                    }
                }
            } catch (err: any) {
                if (isMounted) {
                    const mensajeError = err?.message || String(err)
                    toast.error(`Error técnico: ${mensajeError}`, { duration: 6000 }) 
                    setPermisoDenegado(true) 
                }
            }
        }

        // 2. SEGUNDA BARRERA: Le damos 100ms de respiro a Next.js para que termine 
        // de renderizar todo el HTML y el CSS antes de prender la cámara.
        const timer = setTimeout(() => {
            if (isMounted) iniciarCamara()
        }, 100)

        // Limpieza cuando cerramos el modal
        return () => {
            isMounted = false
            clearTimeout(timer) // Matamos el timer si el usuario cerró rapidísimo
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error)
            }
        }
    }, [onScanSuccess])

    return { permisoDenegado }
}