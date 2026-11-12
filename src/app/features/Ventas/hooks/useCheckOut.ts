import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation" // 👈 1. Importamos el router de Next.js
import { registrarVentaAction } from "../actions" 
import { DatosVentaExitosa } from "./interfaces/interfaces"

export function useCheckout(onClearCart: () => void) {
    const router = useRouter() // 👈 2. Instanciamos el router

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
    
    const [ventaExitosa, setVentaExitosa] = useState<DatosVentaExitosa | null>(null)

    const handleCompleteSale = async (medioPagoKey: string, items: any[], montoRecibido: number, totalVenta: number) => {
        if (items.length === 0) {
            toast.error("El carrito está vacío")
            return
        }

        setLoading(true)
        setSelectedMethod(medioPagoKey)

        const payload = {
                medioPago: medioPagoKey, 
                
                // 👇 ACÁ ESTÁ EL FIX: Le mandamos al backend el costo real de los productos
                montoRecibido: Number(totalVenta), 
                
                idCliente: 1, // Consumidor Final
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

            // EXTRAEMOS LOS ITEMS DEL BACKEND (Que sí traen el nombreProducto)
            const itemsDelBackend = resultado.data?.items || [];
            const itemsParaElPDF = itemsDelBackend.length > 0 ? itemsDelBackend : items;

            setVentaExitosa({
                total: totalVenta,
                montoRecibido: Number(montoRecibido) || totalVenta,
                medioPago: medioPagoKey,
                items: itemsParaElPDF.map((item: any) => ({
                    nombre: item.nombreProducto || item.nombre || item.producto || `Prod. #${item.idProducto || item.id_producto}`,
                    cantidad: Number(item.cantidad),
                    precio: Number(item.precioUnitario),
                    subtotal: Number(item.subtotal) || (Number(item.cantidad) * Number(item.precioUnitario))
                }))
            })
            
            onClearCart()
            setIsCheckoutOpen(false)

            // 👇 3. FORZAMOS LA ACTUALIZACIÓN: Esto recarga los datos en segundo plano y actualiza el stock
            router.refresh()

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
        ventaExitosa,
        setVentaExitosa
    }
}