"use client"
import { Dialog, Button, Flex, Text, Checkbox } from "@radix-ui/themes"
import { FileText, Eye, FileSpreadsheet, Printer, Receipt, Mail, ArrowLeft } from "lucide-react"

export interface DatosVentaExitosa {
    total: number;
    montoRecibido: number;
    medioPago: string;
}

interface ModalVentaExitosaProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    datosVenta: DatosVentaExitosa | null;
    onNuevaVenta: () => void;
}

export default function ModalVentaExitosa({ open, onOpenChange, datosVenta, onNuevaVenta }: ModalVentaExitosaProps) {
    // Si no hay datos, no renderizamos el modal para evitar errores
    if (!datosVenta) return null;

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {/* Hacemos el modal ancho (900px) y limpio como en la foto */}
            <Dialog.Content maxWidth="900px" className="!p-8 bg-white dark:bg-gray-900 rounded-lg shadow-2xl font-sans">
                
                {/* GRILLA DE OPCIONES */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center border-b border-gray-200 dark:border-gray-800 pb-10 pt-6">

                    {/* 1. Comprobante PDF */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Comprobante PDF</Text>
                        <button className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer">
                            <FileText strokeWidth={1.5} size={26} />
                        </button>
                    </div>

                    {/* 2. Ver Documento */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Ver Documento</Text>
                        <button className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer">
                            <Eye strokeWidth={1.5} size={26} />
                        </button>
                    </div>

                    {/* 3. Comprobante EXCEL */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Comprobante EXCEL</Text>
                        <button className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer">
                            <FileSpreadsheet strokeWidth={1.5} size={26} />
                        </button>
                        
                        {/* Checkbox de Incluir Stock */}
                        <Flex align="center" gap="2" className="mt-1">
                            <Checkbox size="1" color="gray" />
                            <Text size="1" className="text-gray-600 dark:text-gray-400">Incluir stock</Text>
                        </Flex>
                    </div>

                    {/* 4. Impresion PDF */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Impresion PDF</Text>
                        <button className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer">
                            <Printer strokeWidth={1.5} size={26} />
                        </button>
                    </div>

                    {/* 5. Ticket */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Ticket</Text>
                        <button className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer">
                            <Receipt strokeWidth={1.5} size={26} />
                        </button>
                    </div>

                    {/* 6. Enviar comprobante */}
                    <div className="flex flex-col items-center gap-6">
                        <Text size="2" weight="bold" className="text-gray-900 dark:text-gray-100">Enviar comprobante por mail</Text>
                        <button className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer">
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