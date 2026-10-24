import { useState } from "react"
import toast from "react-hot-toast"
import { registrarVentaAction } from "@/app/admin/ventasActions" 

// Interfaz para tipar los datos que mandamos al modal
export interface DatosVentaExitosa {
    total: number;
    montoRecibido: number;
    medioPago: string;
}

export function useCheckout(onClearCart: () => void) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
    
    // 👇 Estado para controlar el modal verde de éxito
    const [ventaExitosa, setVentaExitosa] = useState<DatosVentaExitosa | null>(null)

    // 👇 Agregamos totalVenta como cuarto parámetro para calcular el vuelto después
    const handleCompleteSale = async (medioPagoKey: string, items: any[], montoRecibido: number, totalVenta: number) => {
        if (items.length === 0) {
            toast.error("El carrito está vacío")
            return
        }

        setLoading(true)
        setSelectedMethod(medioPagoKey)

        const payload = {
            medioPago: medioPagoKey, 
            montoRecibido: Number(montoRecibido) || 0,
            idCliente: 1, // 👈 Cambiamos el 0 por el 1 (Consumidor Final)
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

            // Ya no mostramos solo el toast, sino que guardamos los datos para abrir el modal
            setVentaExitosa({
                total: totalVenta,
                montoRecibido: Number(montoRecibido) || totalVenta,
                medioPago: medioPagoKey
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
        handleCompleteSale,
        // 👇 Exportamos el estado del modal
        ventaExitosa,
        setVentaExitosa
    }
}