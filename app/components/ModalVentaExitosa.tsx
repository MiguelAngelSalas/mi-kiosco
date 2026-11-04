"use client"
import { useEffect } from "react"
import { Dialog, Button, Flex, Text, Checkbox } from "@radix-ui/themes"
import { FileText, Eye, FileSpreadsheet, Printer, Receipt, Mail, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { useComprobantes } from "@/app/hooks/useComprobantes" // Ajustá la ruta si es distinta

export interface ItemComprobante {
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
}

export interface DatosVentaExitosa {
    total: number;
    montoRecibido: number;
    medioPago: string;
    items: ItemComprobante[];
}

interface ModalVentaExitosaProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    datosVenta: DatosVentaExitosa | null;
    onNuevaVenta: () => void;
}

export default function ModalVentaExitosa({ open, onOpenChange, datosVenta, onNuevaVenta }: ModalVentaExitosaProps) {
    // Instanciamos nuestro custom hook con todas las herramientas
    const { 
        descargarPDF, 
        verDocumento, 
        imprimirPDF, 
        imprimirTicket, 
        descargarExcel, 
        enviarPorMail, 
        cargandoDocs 
    } = useComprobantes();
    
    // Toast automático al abrirse el modal (si la venta es exitosa)
    useEffect(() => {
        if (open && datosVenta) {
            toast.success("¡Venta registrada correctamente!");
        }
    }, [open, datosVenta]);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {/* Hacemos el modal ancho y evitamos el renderizado condicional abrupto por el bug de Turbopack */}
            <Dialog.Content maxWidth="900px" className="!p-8 bg-white dark:bg-gray-900 rounded-lg shadow-2xl font-sans">
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center border-b border-gray-200 dark:border-gray-800 pb-10 pt-6">

                    {/* 1. Comprobante PDF (A4 - Descargar) */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Comprobante PDF</Text>
                        <button 
                            disabled={cargandoDocs || !datosVenta}
                            onClick={() => datosVenta && descargarPDF(datosVenta)}
                            className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <FileText strokeWidth={1.5} size={26} />
                        </button>
                    </div>

                    {/* 2. Ver Documento (A4 - Pestaña Nueva) */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Ver Documento</Text>
                        <button 
                            disabled={cargandoDocs || !datosVenta}
                            onClick={() => datosVenta && verDocumento(datosVenta)}
                            className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <Eye strokeWidth={1.5} size={26} />
                        </button>
                    </div>

                    {/* 3. Comprobante EXCEL */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Comprobante EXCEL</Text>
                        <button 
                            disabled={cargandoDocs || !datosVenta}
                            onClick={() => datosVenta && descargarExcel(datosVenta)}
                            className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <FileSpreadsheet strokeWidth={1.5} size={26} />
                        </button>
                        
                        {/* Checkbox decorativo por ahora (podes agregarlo a la lógica del hook luego) */}
                        <Flex align="center" gap="2" className="mt-1">
                            <Checkbox size="1" color="gray" />
                            <Text size="1" className="text-gray-600 dark:text-gray-400">Incluir stock</Text>
                        </Flex>
                    </div>

                    {/* 4. Impresión PDF (A4 - Directo a impresora) */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Impresión PDF</Text>
                        <button 
                            disabled={cargandoDocs || !datosVenta}
                            onClick={() => datosVenta && imprimirPDF(datosVenta)}
                            className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <Printer strokeWidth={1.5} size={26} />
                        </button>
                    </div>

                    {/* 5. Ticket (Térmico - Directo a impresora) */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Ticket</Text>
                        <button 
                            disabled={cargandoDocs || !datosVenta}
                            onClick={() => datosVenta && imprimirTicket(datosVenta)}
                            className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <Receipt strokeWidth={1.5} size={26} />
                        </button>
                    </div>

                    {/* 6. Enviar comprobante por Mail */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Enviar por mail</Text>
                        <button 
                            disabled={cargandoDocs || !datosVenta}
                            onClick={() => datosVenta && enviarPorMail(datosVenta)}
                            className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                            <Mail strokeWidth={1.5} size={26} />
                        </button>
                    </div>

                </div>

                {/* BOTÓN VOLVER (Centrado abajo) */}
                <Flex justify="center" className="pt-8">
                    <Button 
                        variant="outline" 
                        color="gray" 
                        size="3" 
                        className="cursor-pointer px-6 rounded-md border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={onNuevaVenta}
                    >
                        <ArrowLeft size={16} className="mr-2" /> Volver
                    </Button>
                </Flex>

            </Dialog.Content>
        </Dialog.Root>
    )
}