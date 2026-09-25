"use client"

import { Dialog, Button, Flex } from "@radix-ui/themes"   
import { useState } from "react"
import toast from "react-hot-toast"

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
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

    const handleCompleteSale = async (methodLabel: string) => {
        if (!items || items.length === 0) {
            toast.error("El carrito está vacío")
            return
        }

        setLoading(true)
        setSelectedMethod(methodLabel)

        // Simula la confirmación de pago
        setTimeout(() => {
            toast.success(`¡Venta cobrada con éxito! (${methodLabel})`)
            onClearCart()
            setIsCheckoutOpen(false)
            setLoading(false)
            setSelectedMethod(null)
        }, 500)
    }

    if (items.length === 0) {
        return (
            <Button 
                size="4" 
                variant="solid"
                disabled
                className="w-full mt-6 transition-all duration-200 border-2 border-[#589c33] bg-[#589c33] text-white disabled:opacity-50"
            >
                Realizar Venta
            </Button>
        )
    }

    return (
        <Dialog.Root open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <Dialog.Trigger>
                <Button 
                    size="4" 
                    variant="solid"
                    className="w-full mt-6 cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-[#589c33] bg-[#589c33] text-white hover:bg-white hover:text-[#589c33] dark:hover:bg-gray-800"
                >
                    Realizar Venta
                </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }} className="bg-white dark:bg-gray-800 border-2 border-[#33589c] p-6 rounded-lg">
                <Dialog.Title className="text-[#33589c] dark:text-white text-xl font-bold mb-2">
                    Seleccionar Medio de Pago
                </Dialog.Title>
                <Dialog.Description className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    Total a cobrar: <span className="font-bold text-[#589c33] text-base">{subTotal}</span>
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    {PAYMENT_METHODS.map((method) => {
                        const isThisLoading = loading && selectedMethod === method.label
                        return (
                            <Button 
                                key={method.key}
                                size="3" 
                                variant="outline" 
                                disabled={loading}
                                onClick={() => handleCompleteSale(method.label)}
                                className="cursor-pointer border-2 border-[#33589c] text-[#33589c] dark:text-white hover:bg-[#33589c] hover:text-white justify-center font-medium disabled:opacity-50"
                            >
                                {isThisLoading ? "Cobrando..." : method.label}
                            </Button>
                        )
                    })}
                </Flex>

                <Flex gap="3" mt="6" justify="end">
                    <Dialog.Close>
                        <Button 
                            variant="soft" 
                            color="gray"
                            disabled={loading}
                            className="cursor-pointer text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                        >
                            Cancelar
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}