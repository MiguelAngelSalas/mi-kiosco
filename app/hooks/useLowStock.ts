import { useEffect } from "react"
import toast from "react-hot-toast"
import { Product } from "./useAddProduct" // Ajustá la ruta si moviste la interfaz

export function useLowStock(productos: Product[], umbral: number = 5) {
    // 1. Filtramos los productos
    const stockBajo = productos.filter(p => p.stock <= umbral)

    // 2. Disparamos la alerta Toast
    useEffect(() => {
        if (stockBajo.length > 0) {
            toast("¡Atención! Hay productos con stock crítico", {
                id: 'alerta-stock-critico',
                icon: '⚠️',
                duration: 4000, 
                style: {
                    background: '#fef2f2', 
                    color: '#991b1b', 
                    border: '1px solid #f87171' 
                },
            })
        }
    }, [stockBajo.length])

    // Devolvemos solo la data que la UI necesita para dibujarse
    return {
        stockBajo,
        hayStockCritico: stockBajo.length > 0
    }
}