"use client"
import { useState } from "react"
import toast from "react-hot-toast"

import { Dialog, Button, Flex } from "@radix-ui/themes"
import { Lock, Wallet, Receipt, CreditCard, Smartphone, Building2 } from "lucide-react"

import { obtenerResumenDelDiaAction, PreCierreDatos } from "@/app/admin/ventasActions" 

interface ModalCierreCajaProps {
    onCierreExitoso: () => void;
}

export default function ModalCierreCaja({ onCierreExitoso }: ModalCierreCajaProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [datosCierre, setDatosCierre] = useState<PreCierreDatos | null>(null)

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open)
        
        // 👇 MAGIA APLICADA: Le sacamos el "!datosCierre". Ahora busca siempre que se abre.
        if (open) {
            setLoading(true)
            
            const res = await obtenerResumenDelDiaAction()
            
            if (res.success && res.datos) {
                setDatosCierre(res.datos)
            } else {
                toast.error(res.error || "Error al cargar el resumen de ventas")
            }
            
            setLoading(false)
        }
    }

    const handleConfirmarCierre = () => {
        toast.success("Resumen de jornada verificado correctamente")
        setIsOpen(false)
        onCierreExitoso()
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            
            <Dialog.Trigger>
                <Button 
                    size="3"
                    className="cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg bg-[#33589c] text-white hover:bg-[#28467b]"
                >
                    <Lock size={18} className="mr-1" />
                    Resumen del Día
                </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="650px" className="p-0 overflow-hidden bg-white dark:bg-gray-950 rounded-xl shadow-2xl font-sans transition-colors duration-300 border border-gray-200 dark:border-gray-800">
                
                {/* ENCABEZADO */}
                <div className="bg-[#33589c]/10 dark:bg-[#33589c]/20 border-b border-[#33589c]/20 dark:border-[#33589c]/30 p-5 flex justify-between items-center">
                    <div>
                        <Dialog.Title className="text-xl font-bold text-[#33589c] dark:text-blue-400 m-0 tracking-tight">
                            Resumen de la Jornada
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1 m-0 font-medium">
                            Total de ventas registradas en el sistema.
                        </Dialog.Description>
                    </div>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="p-6">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <div className="animate-spin w-8 h-8 border-4 border-[#33589c] border-t-transparent rounded-full mb-4"></div>
                            <p className="font-medium">Calculando totales del día...</p>
                        </div>
                    ) : datosCierre ? (
                        <div className="flex flex-col lg:flex-row gap-6">
                            
                            {/* COLUMNA IZQUIERDA: DESGLOSE */}
                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Total Recaudado</h4>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                                        $ {datosCierre.total_recaudado.toFixed(2)}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Desglose por método</h4>
                                    
                                    <Flex justify="between" align="center" className="text-sm text-gray-700 dark:text-gray-300">
                                        <Flex align="center" gap="2"><Wallet size={16} className="text-green-600 dark:text-green-500"/> Efectivo</Flex>
                                        <span className="font-semibold">$ {datosCierre.desglose.efectivo.toFixed(2)}</span>
                                    </Flex>
                                    
                                    <Flex justify="between" align="center" className="text-sm text-gray-700 dark:text-gray-300">
                                        <Flex align="center" gap="2"><Smartphone size={16} className="text-blue-500 dark:text-blue-400"/> Cuenta DNI</Flex>
                                        <span className="font-semibold">$ {datosCierre.desglose.cuenta_dni.toFixed(2)}</span>
                                    </Flex>
                                    
                                    <Flex justify="between" align="center" className="text-sm text-gray-700 dark:text-gray-300">
                                        <Flex align="center" gap="2"><Smartphone size={16} className="text-sky-500 dark:text-sky-400"/> MercadoPago / QR</Flex>
                                        <span className="font-semibold">$ {datosCierre.desglose.mercadopago_qr.toFixed(2)}</span>
                                    </Flex>
                                    
                                    <Flex justify="between" align="center" className="text-sm text-gray-700 dark:text-gray-300">
                                        <Flex align="center" gap="2"><CreditCard size={16} className="text-orange-500 dark:text-orange-400"/> Tarjeta</Flex>
                                        <span className="font-semibold">$ {datosCierre.desglose.tarjeta.toFixed(2)}</span>
                                    </Flex>
                                    
                                    <Flex justify="between" align="center" className="text-sm text-gray-700 dark:text-gray-300">
                                        <Flex align="center" gap="2"><Building2 size={16} className="text-purple-500 dark:text-purple-400"/> Transferencia</Flex>
                                        <span className="font-semibold">$ {datosCierre.desglose.transferencia.toFixed(2)}</span>
                                    </Flex>
                                </div>
                            </div>

                            {/* COLUMNA DERECHA: ÚLTIMAS VENTAS */}
                            <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-6 lg:pt-0 lg:pl-6 w-full lg:w-1/2">
                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Receipt size={16} /> Detalle de Ventas
                                </h4>
                                
                                <div className="overflow-y-auto max-h-[250px] pr-2 space-y-3 custom-scrollbar">
                                    {datosCierre.ventas_realizadas.map((venta) => (
                                        <div key={venta.id} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-800 flex justify-between items-center shadow-sm">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                    {new Date(venta.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} #{venta.id}
                                                </span>
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">
                                                    {venta.medioPago.toLowerCase()}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">$ {venta.total.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <p className="text-red-500 text-center py-10 font-medium">No se encontraron ventas para mostrar.</p>
                    )}
                </div>

                {/* FOOTER DE ACCIONES */}
                <div className="bg-gray-50 dark:bg-gray-900 p-5 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
                    <Dialog.Close>
                        <Button 
                            variant="soft" 
                            color="gray" 
                            size="3" 
                            className="cursor-pointer font-medium" 
                        >
                            Cerrar
                        </Button>
                    </Dialog.Close>
                    
                    <Button 
                        size="3" 
                        className="cursor-pointer bg-[#33589c] hover:bg-[#28467b] text-white transition-all font-bold shadow-md"
                        onClick={handleConfirmarCierre}
                    >
                        Confirmar
                    </Button>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    )
}