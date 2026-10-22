import { useState } from "react"
import toast from "react-hot-toast"
import { registrarVentaAction } from "@/app/admin/ventasActions" 

export function useCheckout(onClearCart: () => void) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

    // 👇 Cambiamos el nombre del tercer parámetro a montoRecibido
    const handleCompleteSale = async (medioPagoKey: string, items: any[], montoRecibido: number) => {
        if (items.length === 0) {
            toast.error("El carrito está vacío")
            return
        }

        setLoading(true)
        setSelectedMethod(medioPagoKey)

        const payload = {
            medioPago: medioPagoKey, 
            montoRecibido: montoRecibido, // 👈 Ahora manda la plata real (el total o el billete)
            idCliente: null, 
            items: items.map(item => ({
                idProducto: Number(item.id_producto || item.idProducto),
                cantidad: Number(item.cantidad)
            }))
        }

        try {
            const resultado = await registrarVentaAction(payload)

            if (resultado.error) {
                throw new Error(resultado.error)
            }

            toast.success("¡Venta cobrada con éxito!", {
                icon: "✅",
                style: { background: '#dcfce3', color: '#166534' }
            })
            
            onClearCart()
            setIsCheckoutOpen(false)

        } catch (error: any) {
            console.error("Error en la vista:", error)
            toast.error(error.message || "Hubo un problema al procesar la venta", {
                duration: 4000
            })
        } finally {
            setLoading(false)
            setSelectedMethod(null)
        }
    }

    return {
        isCheckoutOpen,
        setIsCheckoutOpen,
        loading,
        selectedMethod,
        handleCompleteSale
    }
}