"use client"
import { useState } from "react"
import toast from "react-hot-toast"
import { Dialog, Button, Flex } from "@radix-ui/themes"
import { Wallet, Receipt, CreditCard, Smartphone, Building2, BarChart3 } from "lucide-react"

// 👇 Solo usamos las acciones de Cajas/Turnos, nada de getVentasAction
import { getCajasAction } from "../../Turnos/actions" 
import { obtenerResumenCajaAction } from "@/src/app/features/Turnos/actions" 

export function ModalControlVentas() {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [datosCierre, setDatosCierre] = useState<any | null>(null)

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open)
        
        if (open) {
            setLoading(true)
            
            // 1️⃣ Buscamos cuál es la caja abierta
            const resCajas = await getCajasAction()
            let idCaja = null
            
            if (resCajas.success && resCajas.data) {
                const cajaAbierta = resCajas.data.find((c: any) => c.fechaCierre === null)
                if (cajaAbierta) idCaja = cajaAbierta.id
            }

            if (!idCaja) {
                toast.error("No hay una caja abierta actualmente.")
                setIsOpen(false)
                setLoading(false)
                return
            }
            
            // 2️⃣ Usamos TU acción que ya filtra y trae todo perfecto
            const resCaja = await obtenerResumenCajaAction(idCaja)
            
            if (resCaja.success && resCaja.datos) {
                setDatosCierre(resCaja.datos)
            } else {
                toast.error(resCaja.error || "Error al cargar el resumen")
            }

            setLoading(false)
        }
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            
            <Dialog.Trigger>
                <Button 
                    size="3"
                    variant="solid" 
                    className="cursor-pointer transition-all duration-200 bg-[#33589c] hover:bg-[#28467b] text-white shadow-md"
                >
                    <BarChart3 size={18} className="mr-1" /> Control de Caja
                </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="750px" className="p-0 overflow-hidden bg-white dark:bg-gray-950 rounded-xl shadow-2xl font-sans border border-gray-200 dark:border-gray-800">
                
                <div className="bg-indigo-600/10 dark:bg-indigo-600/20 border-b border-indigo-600/20 p-5 flex justify-between items-center">
                    <div>
                        <Dialog.Title className="text-xl font-bold m-0 tracking-tight text-indigo-600 dark:text-indigo-400">
                            Arqueo de Caja Parcial
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1 m-0 font-medium">
                            Estado actual de las ventas. La caja seguirá operando normalmente.
                        </Dialog.Description>
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
                            <p className="font-medium">Calculando totales y buscando ventas...</p>
                        </div>
                    ) : datosCierre ? (
                        <div className="flex flex-col lg:flex-row gap-6">
                            
                            {/* COLUMNA IZQUIERDA: TOTALES (Idéntico a tu ModalCierreCaja) */}
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

                            {/* COLUMNA DERECHA: VENTAS (Idéntico a tu ModalCierreCaja) */}
                            <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-6 lg:pt-0 lg:pl-6 w-full lg:w-1/2">
                                <Flex justify="between" align="center" className="mb-4">
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Receipt size={16} /> Detalle de Ventas
                                    </h4>
                                    <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-bold px-2 py-1 rounded-full">
                                        {datosCierre.ventas_realizadas?.length || 0} Tickets
                                    </span>
                                </Flex>
                                
                                <div className="overflow-y-auto max-h-[250px] pr-2 space-y-3 custom-scrollbar">
                                    {!datosCierre.ventas_realizadas || datosCierre.ventas_realizadas.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                                            No hay ventas registradas en este turno.
                                        </p>
                                    ) : (
                                        datosCierre.ventas_realizadas.map((venta: any) => (
                                            <div key={venta.id} className="bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-800 flex justify-between items-center shadow-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                        {new Date(venta.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} 
                                                        <span className="ml-1 opacity-50">#{venta.id}</span>
                                                    </span>
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">
                                                        {venta.medioPago.toLowerCase()}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                                    $ {venta.total.toFixed(2)}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <p className="text-red-500 text-center py-10 font-medium">No se encontró información de la caja.</p>
                    )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-5 flex justify-end border-t border-gray-200 dark:border-gray-800">
                    <Dialog.Close>
                        <Button variant="solid" size="3" className="cursor-pointer font-bold shadow-md bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
                            Cerrar
                        </Button>
                    </Dialog.Close>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    )
}