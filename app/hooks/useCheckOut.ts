import { useState } from "react"
import toast from "react-hot-toast"

export function useCheckout(onClearCart: () => void) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

    const handleCompleteSale = async (methodLabel: string, itemsLength: number) => {
        if (itemsLength === 0) {
            toast.error("El carrito está vacío")
            return
        }

        setLoading(true)
        setSelectedMethod(methodLabel)

        // 🔥 ACÁ EN EL FUTURO VAS A METER EL LLAMADO A TU BASE DE DATOS PARA GUARDAR LA VENTA
        setTimeout(() => {
            toast.success(`¡Venta cobrada con éxito! (${methodLabel})`)
            onClearCart()
            setIsCheckoutOpen(false)
            setLoading(false)
            setSelectedMethod(null)
        }, 800) // Le puse 800ms para que se note el botón de "Cobrando..."
    }

    return {
        isCheckoutOpen,
        setIsCheckoutOpen,
        loading,
        selectedMethod,
        handleCompleteSale
    }
}