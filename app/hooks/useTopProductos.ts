import { useState, useEffect } from "react"
import { getVentasAction } from "../admin/actions" // Ajustá esta ruta
import { procesarTopProductos, ProductoTop } from "../utils/estadisticas" // Ajustá la ruta a donde guardaste la función matemática

export function useTopProductos() {
    const [productosTop, setProductosTop] = useState<ProductoTop[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const cargarTopProductos = async () => {
            try {
                setLoading(true)
                setError(null)
                
                // Llamamos a tu Server Action con el patrón correcto
                const response = await getVentasAction()
                
                // Manejo del error según tu estructura
                if (response.error) {
                    setError(response.error)
                    return
                }

                // Si salió bien, procesamos los datos
                if (response.success && response.data) {
                    const ranking = procesarTopProductos(response.data)
                    setProductosTop(ranking)
                }
                
            } catch (err) {
                console.error("Error inesperado:", err)
                setError("Ocurrió un error inesperado al procesar las ventas.")
            } finally {
                setLoading(false)
            }
        }

        cargarTopProductos()
    }, [])

    return {
        productosTop,
        loading,
        error
    }
}