"use client"
import { X, ScanLine, Camera, AlertCircle } from "lucide-react"
import { IconButton, Text } from "@radix-ui/themes"
import { useScannerCamera } from "@/app/hooks/useScannerCamera"

interface BarcodeScannerProps {
    onScanSuccess: (decodedText: string) => void
    onClose: () => void
}

export default function BarcodeScanner({ onScanSuccess, onClose }: BarcodeScannerProps) {
    const { permisoDenegado } = useScannerCamera(onScanSuccess)

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                
                {/* --- HEADER --- */}
                <div className="bg-[#33589c] text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Camera size={20} />
                        <Text weight="bold" size="3">Escanear Código</Text>
                    </div>
                    <IconButton 
                        size="2" 
                        variant="ghost" 
                        className="text-white hover:bg-white/20 cursor-pointer rounded-full"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </IconButton>
                </div>

                {/* --- CUERPO --- */}
                <div className="p-4 flex flex-col items-center">
                    
                    {permisoDenegado ? (
                        <div className="text-center p-6 text-red-500 flex flex-col items-center">
                            <AlertCircle size={40} className="mb-2" />
                            <Text size="3" weight="bold">Cámara bloqueada</Text>
                            <Text size="2" className="mt-2 text-gray-600 dark:text-gray-400">
                                Por favor, dale permisos a tu navegador para usar la cámara y volvé a intentar.
                            </Text>
                        </div>
                    ) : (
                        <>
                            <div 
                                id="reader" 
                                className="w-full rounded-xl overflow-hidden shadow-inner bg-black [&_video]:w-full [&_video]:object-cover [&_a]:hidden [&_button]:hidden [&_select]:hidden"
                            ></div>

                            <div className="mt-4 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <ScanLine size={18} />
                                <Text size="2">Alineá el código dentro del recuadro</Text>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}