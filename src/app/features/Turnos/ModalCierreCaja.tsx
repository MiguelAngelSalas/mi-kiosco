"use client"
import { useState } from "react"
import toast from "react-hot-toast"

import { Dialog, Button, Flex } from "@radix-ui/themes"
import { Lock, Wallet, Receipt, CreditCard, Smartphone, Building2, BarChart3, Loader2, AlertCircle } from "lucide-react"
import { obtenerResumenCajaAction, cerrarCajaAction } from "./actions" 
import { PreCierreDatos } from "./interfaces/interfaces"

interface ModalCierreCajaProps {
    onCierreExitoso?: () => void;
    esSoloResumen?: boolean;
    idCaja?: number | null; // 👈 Le permitimos recibir null o undefined
    estiloHeader?: boolean; 
}

export default function ModalCierreCaja({ onCierreExitoso, esSoloResumen = false, idCaja, estiloHeader = false }: ModalCierreCajaProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isClosing, setIsClosing] = useState(false) 
    const [datosCierre, setDatosCierre] = useState<PreCierreDatos | null>(null)

    // Evaluamos si el ID de la caja es válido
    const cajaInvalida = !idCaja || idCaja <= 0

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open)
        
        if (open) {
            // Si la caja no es válida, cortamos la ejecución acá
            if (cajaInvalida) {
                return
            }

            setLoading(true)
            const res = await obtenerResumenCajaAction(idCaja)
            
            if (res.success && res.datos) {
                setDatosCierre(res.datos)
            } else {
                toast.error(res.error || "Error al cargar el resumen de ventas")
            }
            setLoading(false)
        }
    }

    const handleAccionPrincipal = async () => {
        if (cajaInvalida) return;

        if (esSoloResumen) {
            setIsOpen(false)
            if (onCierreExitoso) onCierreExitoso()
            return
        }

        setIsClosing(true)
        const toastId = toast.loading("Cerrando la caja en el sistema...")

        const res = await cerrarCajaAction(idCaja)

        if (res.success) {
            toast.success("Caja cerrada correctamente.", { id: toastId })
            setIsOpen(false)
            if (onCierreExitoso) onCierreExitoso() 
        } else {
            toast.error(res.error || "No se pudo cerrar la caja.", { id: toastId })
        }
        
        setIsClosing(false)
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            
            <Dialog.Trigger>
                <Button 
                    size="3"
                    variant={estiloHeader ? "surface" : "solid"}
                    className={
                        estiloHeader 
                        ? "cursor-pointer transition-all duration-200 text-[#33589c] bg-white border border-gray-300 hover:bg-gray-50 shadow-sm dark:bg-transparent dark:border-[#33589c]/30 dark:hover:bg-[#33589c]/10"
                        : `cursor-pointer w-full transition-all duration-200 shadow-md hover:shadow-lg text-white ${esSoloResumen ? "bg-indigo-600 hover:bg-indigo-700" : "bg-[#33589c] hover:bg-[#28467b]"}`
                    }
                >
                    {esSoloResumen ? (
                        <><BarChart3 size={18} className="mr-1" /> Ver Resumen Parcial</>
                    ) : (
                        <><Lock size={18} className="mr-1" /> Cerrar Turno</>
                    )}
                </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth={cajaInvalida ? "400px" : "650px"} className="p-0 overflow-hidden bg-white dark:bg-gray-950 rounded-xl shadow-2xl font-sans border border-gray-200 dark:border-gray-800">
                
                <div className={`${
                    cajaInvalida 
                    ? 'bg-red-600/10 dark:bg-red-600/20 border-red-600/20' 
                    : (esSoloResumen ? 'bg-indigo-600/10 dark:bg-indigo-600/20 border-indigo-600/20' : 'bg-[#33589c]/10 dark:bg-[#33589c]/20 border-[#33589c]/20')
                } border-b p-5 flex justify-between items-center`}>
                    <div>
                        <Dialog.Title className={`text-xl font-bold m-0 tracking-tight ${
                            cajaInvalida ? 'text-red-600 dark:text-red-400' 
                            : (esSoloResumen ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#33589c] dark:text-blue-400')
                        }`}>
                            {cajaInvalida ? "Atención" : (esSoloResumen ? "Arqueo de Caja Parcial" : "Cierre de Jornada")}
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-600 dark:text-gray-400 mt-1 m-0 font-medium">
                            {cajaInvalida 
                                ? "No se detectó ninguna caja abierta." 
                                : (esSoloResumen ? "Estado actual de las ventas (La caja seguirá abierta)." : "Total de ventas registradas. Esta acción cerrará la caja.")}
                        </Dialog.Description>
                    </div>
                </div>

                <div className="p-6">
                    {/* 👇 INTERFAZ PARA CAJA INVÁLIDA */}
                    {cajaInvalida ? (
                        <div className="py-8 flex flex-col items-center justify-center text-center">
                            <AlertCircle size={48} className="text-red-500 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No hay caja habilitada</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Para poder cerrar el turno o ver el resumen, primero debés abrir una caja desde el administrador de turnos.
                            </p>
                        </div>
                    ) : 
                    // 👇 INTERFAZ NORMAL SI HAY CAJA
                    loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <div className="animate-spin w-8 h-8 border-4 border-[#33589c] border-t-transparent rounded-full mb-4"></div>
                            <p className="font-medium">Calculando totales de la caja...</p>
                        </div>
                    ) : datosCierre ? (
                        <div className="flex flex-col lg:flex-row gap-6">
                            
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

                            <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-6 lg:pt-0 lg:pl-6 w-full lg:w-1/2">
                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Receipt size={16} /> Detalle de Ventas
                                </h4>
                                
                                <div className="overflow-y-auto max-h-[250px] pr-2 space-y-3 custom-scrollbar">
                                    {datosCierre.ventas_realizadas?.map((venta) => (
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

                <div className="bg-gray-50 dark:bg-gray-900 p-5 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
                    <Dialog.Close>
                        <Button disabled={isClosing} variant="soft" color="gray" size="3" className="cursor-pointer font-medium">
                            {cajaInvalida ? "Entendido" : (esSoloResumen ? "Volver" : "Cancelar")}
                        </Button>
                    </Dialog.Close>
                    
                    {/* 👇 Ocultamos el botón principal si la caja es inválida */}
                    {!cajaInvalida && (
                        <Button 
                            size="3" 
                            disabled={isClosing}
                            className={`cursor-pointer transition-all font-bold shadow-md text-white ${esSoloResumen ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700'}`}
                            onClick={handleAccionPrincipal}
                        >
                            {isClosing ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                            {esSoloResumen ? "Aceptar" : (isClosing ? "Cerrando..." : "Confirmar Cierre de Caja")}
                        </Button>
                    )}
                </div>
            </Dialog.Content>
        </Dialog.Root>
    )
}