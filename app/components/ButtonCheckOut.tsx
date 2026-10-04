"use client"
import { Dialog, Button, Flex, IconButton } from "@radix-ui/themes"   
import { Wallet, X, CheckCircle2 } from "lucide-react"
import { useCheckout } from "@/app/hooks/useCheckOut" // Ajustá la ruta

interface CartItem {
    idProducto: string
    cantidad: number
    precioUnitario: number
}

interface ButtonCheckOutProps {
    subTotal: string
    items: CartItem[] 
    idCaja?: number    
    onClearCart: () => void
}

const PAYMENT_METHODS = [
    { key: "efectivo", label: "💵 Efectivo" },
    { key: "cuentaDni", label: "🔵 Cuenta DNI" },
    { key: "qr/mercadopago", label: "📱 QR / Mercado Pago" },
    { key: "transferencia", label: "🏦 Transferencia (Alias)" },
    { key: "tarjeta", label: "💳 Tarjeta" },
]

export default function ButtonCheckOut({ subTotal, items, onClearCart }: ButtonCheckOutProps) {
    const { 
        isCheckoutOpen, setIsCheckoutOpen, 
        loading, selectedMethod, handleCompleteSale 
    } = useCheckout(onClearCart)

    if (items.length === 0) {
        return (
            <Button 
                size="4" 
                variant="solid"
                disabled
                className="w-full mt-6 transition-all duration-200 border-2 border-[#589c33] bg-[#589c33] text-white opacity-50"
            >
                <Wallet size={20} className="mr-2" /> Realizar Venta
            </Button>
        )
    }

    return (
        <Dialog.Root open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <Dialog.Trigger>
                <Button 
                    size="4" 
                    variant="solid"
                    className="w-full mt-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] border-2 border-[#589c33] bg-[#589c33] text-white hover:bg-white hover:text-[#589c33] dark:hover:bg-gray-800 shadow-lg"
                >
                    <Wallet size={20} className="mr-2" /> Realizar Venta
                </Button>
            </Dialog.Trigger>

            {/* --- CONTENEDOR DEL MODAL ESTILO PREMIUM --- */}
            <Dialog.Content maxWidth="400px" className="!p-0 border border-gray-300 dark:border-gray-700 shadow-2xl rounded-2xl bg-white dark:bg-gray-900 overflow-hidden font-sans">
                
                {/* --- HEADER --- */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                    <Flex align="center" gap="2">
                        <Wallet className="text-[#589c33]" size={22} />
                        <Dialog.Title className="text-gray-900 dark:text-white font-bold m-0 text-lg">
                            Medio de Pago
                        </Dialog.Title>
                    </Flex>
                    <Dialog.Close>
                        <IconButton 
                            type="button"
                            variant="ghost" 
                            color="gray" 
                            disabled={loading}
                            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                        >
                            <X size={20} />
                        </IconButton>
                    </Dialog.Close>
                </div>

                {/* --- CUERPO --- */}
                <div className="p-6">
                    <div className="bg-gray-100 dark:bg-gray-800/80 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-inner">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Total a cobrar:</span>
                        <span className="font-black text-[#589c33] text-2xl tracking-tight">{subTotal}</span>
                    </div>

                    <Flex direction="column" gap="3">
                        {PAYMENT_METHODS.map((method) => {
                            const isThisLoading = loading && selectedMethod === method.label
                            return (
                                <Button 
                                    key={method.key}
                                    size="3" 
                                    variant="outline" 
                                    disabled={loading}
                                    onClick={() => handleCompleteSale(method.label, items.length)}
                                    className={`cursor-pointer justify-start px-4 h-12 font-semibold transition-all ${
                                        isThisLoading 
                                            ? 'bg-[#589c33] text-white border-[#589c33]' 
                                            : 'border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#589c33] hover:text-[#589c33] dark:hover:border-[#589c33] dark:hover:text-[#589c33]'
                                    }`}
                                >
                                    {isThisLoading ? (
                                        <Flex align="center" gap="2" className="w-full justify-center">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Procesando...
                                        </Flex>
                                    ) : (
                                        <Flex align="center" justify="between" className="w-full">
                                            <span>{method.label}</span>
                                            <CheckCircle2 size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Flex>
                                    )}
                                </Button>
                            )
                        })}
                    </Flex>
                </div>

                {/* --- FOOTER --- */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                    <Dialog.Close>
                        <Button 
                            variant="soft" 
                            color="gray"
                            disabled={loading}
                            className="cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shadow-sm"
                        >
                            Cancelar
                        </Button>
                    </Dialog.Close>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    )
}