"use client"
import { useState, useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { toast } from "react-hot-toast"

export function useScannerCamera(onScanSuccess: (decodedText: string) => void) {
    const [permisoDenegado, setPermisoDenegado] = useState(false)
    const scannerRef = useRef<Html5Qrcode | null>(null)

    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader")
        scannerRef.current = html5QrCode

        const iniciarCamara = async () => {
            try {
                // 1. Despertamos al celular y le pedimos la lista de cámaras primero.
                // Esto fuerza el cartelito de permisos de la forma más compatible.
                const devices = await Html5Qrcode.getCameras()
                
                if (devices && devices.length > 0) {
                    // 2. Si dio permiso y encontró cámaras, arrancamos el motor
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
                                    onScanSuccess(decodedText)
                                }).catch(console.error)
                            }
                        },
                        (errorMessage) => {
                            // Ignoramos errores de frame a frame
                        }
                    )
                } else {
                    toast.error("El dispositivo no reportó ninguna cámara.")
                    setPermisoDenegado(true)
                }
            } catch (err: any) {
                // 3. LA MAGIA: Si falla, que nos escupa el error exacto en la pantalla.
                const mensajeError = err?.message || String(err)
                toast.error(`Error técnico: ${mensajeError}`, { duration: 6000 }) 
                setPermisoDenegado(true) 
            }
        }

        iniciarCamara()

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error)
            }
        }
    }, [onScanSuccess])

    return { permisoDenegado }
}