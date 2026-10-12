import { useState, useRef } from "react"
import { Product } from "./useAddProduct" // Ajustá la ruta si es necesario

export function useStockAlert(handleAddCart: (producto: Product) => boolean) {
    const [ultimoAgregado, setUltimoAgregado] = useState<Product | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null) // Para controlar el tiempo de la burbuja

    const handleAddCartConAlerta = (producto: Product): boolean => {
        // 1. Agregamos al carrito
        const agregadoExitoso = handleAddCart(producto)
        
        // 2. Mostramos la alerta
        setUltimoAgregado(producto)
        
        // 3. Limpiamos el timer anterior por si escanea muy rápido
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        
        // 4. Seteamos el nuevo timer para que desaparezca
        timerRef.current = setTimeout(() => {
            setUltimoAgregado(null)
        }, 3000)

        return agregadoExitoso
    }

    const getColorStock = (stock: number) => {
        return stock < 5 
            ? "bg-red-500 shadow-red-500/50 border-red-200" 
            : "bg-green-500 shadow-green-500/50 border-green-200"
    }

    return {
        ultimoAgregado,
        handleAddCartConAlerta,
        getColorStock
    }
}