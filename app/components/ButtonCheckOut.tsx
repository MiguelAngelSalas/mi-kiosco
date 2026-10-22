"use client"
import { useState } from "react"
import { Dialog, Button, Flex, IconButton, TextField, Text } from "@radix-ui/themes"   
import { Wallet, X, CheckCircle2, ChevronLeft, DollarSign } from "lucide-react"
import { useCheckout } from "@/app/hooks/useCheckOut" 

interface CartItem {
    id_producto?: number 
    idProducto?: number
    cantidad: number
    precioUnitario: number
}

interface ButtonCheckOutProps {
    subTotal: string
    subTotalNum: number 
    items: CartItem[] 
    idCaja?: number    
    onClearCart: () => void
}

const PAYMENT_METHODS = [
    { key: "efectivo", label: "💵 Efectivo" },
    { key: "cuentaDni", label: "🔵 Cuenta DNI" },
    { key: "mercadopago", label: "📱 QR / Mercado Pago" }, 
    { key: "transferencia", label: "🏦 Transferencia (Alias)" },
    { key: "tarjeta", label: "💳 Tarjeta" },
]

export default function ButtonCheckOut({ subTotal, subTotalNum, items, onClearCart }: ButtonCheckOutProps) {
    const { 
        isCheckoutOpen, setIsCheckoutOpen, 
        loading, selectedMethod, handleCompleteSale 
    } = useCheckout(onClearCart)

    // Estados para manejar la pantalla de efectivo
    const [step, setStep] = useState<'methods' | 'cash'>('methods')
    const [montoEfectivo, setMontoEfectivo] = useState<string>("")

    // Reseteamos las vistas si cierran el modal
    const handleOpenChange = (open: boolean) => {
        setIsCheckoutOpen(open)
        if (!open) {
            setTimeout(() => {
                setStep('methods')
                setMontoEfectivo("")
            }, 300)
        }
    }

    // Cálculos para el vuelto
    const montoIngresado = Number(montoEfectivo)
    const vuelto = montoIngresado - subTotalNum
    const esMontoValido = montoEfectivo !== "" && montoIngresado >= subTotalNum

    // Formateador de moneda para el vuelto
    const formatCurrency = (val: number) => `$${val.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`

    if (items.length === 0) {
        return (
            <Button size="4" variant="solid" disabled className="w-full mt-6 opacity-50 bg-[#589c33] text-white">
                <Wallet size={20} className="mr-2" /> Realizar Venta
            </Button>
        )
    }

    return (
        <Dialog.Root open={isCheckoutOpen} onOpenChange={handleOpenChange}>
            <Dialog.Trigger>
                <Button size="4" variant="solid" className="w-full mt-6 cursor-pointer bg-[#589c33] text-white hover:bg-[#4a852a]">
                    <Wallet size={20} className="mr-2" /> Realizar Venta
                </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="400px" className="!p-0 border border-gray-300 dark:border-gray-700 shadow-2xl rounded-2xl bg-white dark:bg-gray-900 overflow-hidden font-sans">
                
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 flex justify-between items-center">
                    <Flex align="center" gap="2">
                        {step === 'cash' ? (
                            <IconButton variant="ghost" color="gray" onClick={() => setStep('methods')} className="cursor-pointer mr-1">
                                <ChevronLeft size={22} />
                            </IconButton>
                        ) : (
                            <Wallet className="text-[#589c33]" size={22} />
                        )}
                        <Dialog.Title className="text-gray-900 dark:text-white font-bold m-0 text-lg">
                            {step === 'cash' ? 'Cobro en Efectivo' : 'Medio de Pago'}
                        </Dialog.Title>
                    </Flex>
                    <Dialog.Close>
                        <IconButton type="button" variant="ghost" color="gray" disabled={loading} className="cursor-pointer rounded-full">
                            <X size={20} />
                        </IconButton>
                    </Dialog.Close>
                </div>

                <div className="p-6">
                    {/* Pantalla 1: Elegir medio de pago */}
                    {step === 'methods' && (
                        <>
                            <div className="bg-gray-100 rounded-xl p-4 mb-6 border border-gray-200 flex justify-between items-center shadow-inner">
                                <span className="text-gray-600 font-medium">Total a cobrar:</span>
                                <span className="font-black text-[#589c33] text-2xl tracking-tight">{subTotal}</span>
                            </div>

                            <Flex direction="column" gap="3">
                                {PAYMENT_METHODS.map((method) => {
                                    const isThisLoading = loading && selectedMethod === method.key
                                    return (
                                        <Button 
                                            key={method.key}
                                            size="3" 
                                            variant="outline" 
                                            disabled={loading}
                                            onClick={() => {
                                                if (method.key === 'efectivo') {
                                                    setStep('cash') // Vamos a la pantalla de vuelto
                                                } else {
                                                    // Si es digital, cobramos por el monto exacto de una
                                                    handleCompleteSale(method.key, items, subTotalNum)
                                                }
                                            }}
                                            className={`cursor-pointer justify-start px-4 h-12 font-semibold ${isThisLoading ? 'bg-[#589c33] text-white' : 'text-gray-700 hover:text-[#589c33]'}`}
                                        >
                                            {isThisLoading ? (
                                                <Flex align="center" gap="2" className="w-full justify-center">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Procesando...
                                                </Flex>
                                            ) : (
                                                <Flex align="center" justify="between" className="w-full">
                                                    <span>{method.label}</span>
                                                    <CheckCircle2 size={18} className="opacity-0 hover:opacity-100" />
                                                </Flex>
                                            )}
                                        </Button>
                                    )
                                })}
                            </Flex>
                        </>
                    )}

                    {/* Pantalla 2: Input de efectivo y vuelto */}
                    {step === 'cash' && (
                        <>
                            <div className="bg-gray-100 rounded-xl p-4 mb-4 border border-gray-200 flex justify-between items-center shadow-inner">
                                <span className="text-gray-600 font-medium">Total a cobrar:</span>
                                <span className="font-black text-gray-900 text-2xl tracking-tight">{subTotal}</span>
                            </div>

                            <div className="mb-4">
                                <Text size="2" weight="bold" className="text-gray-600 dark:text-gray-400 mb-2 block">
                                    ¿Con cuánto abona?
                                </Text>
                                <TextField.Root 
                                    size="3"
                                    type="number"
                                    placeholder="Ej: 5000" 
                                    value={montoEfectivo}
                                    onChange={(e) => setMontoEfectivo(e.target.value)}
                                    disabled={loading}
                                    autoFocus
                                >
                                    <TextField.Slot>
                                        <DollarSign size={16} className="text-gray-400" />
                                    </TextField.Slot>
                                </TextField.Root>
                            </div>

                            {/* Tarjeta dinámica de vuelto */}
                            <div className={`rounded-xl p-4 mb-6 border flex justify-between items-center transition-colors ${
                                montoEfectivo === "" ? 'bg-gray-50 border-gray-200' :
                                esMontoValido ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}>
                                <span className={`font-medium ${
                                    montoEfectivo === "" ? 'text-gray-500' : 
                                    esMontoValido ? 'text-green-700' : 'text-red-600'
                                }`}>
                                    {montoEfectivo === "" ? 'Vuelto:' : 
                                     esMontoValido ? 'Vuelto a entregar:' : 'Falta dinero:'}
                                </span>
                                <span className={`font-black text-2xl tracking-tight ${
                                    montoEfectivo === "" ? 'text-gray-900' : 
                                    esMontoValido ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {montoEfectivo === "" ? "$0,00" :
                                     esMontoValido ? formatCurrency(vuelto) : formatCurrency(Math.abs(vuelto))}
                                </span>
                            </div>

                            <Button 
                                size="4" 
                                variant="solid" 
                                disabled={!esMontoValido || loading}
                                // Si es efectivo, mandamos la plata que ingresó el usuario
                                onClick={() => handleCompleteSale('efectivo', items, montoIngresado)}
                                className={`w-full font-bold cursor-pointer text-white transition-colors ${
                                    esMontoValido ? 'bg-[#589c33] hover:bg-[#4a852a]' : 'bg-gray-300'
                                }`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle2 size={20} className="mr-2" /> 
                                        Confirmar Venta
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </Dialog.Content>
        </Dialog.Root>
    )
}