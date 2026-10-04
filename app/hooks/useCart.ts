import { useState } from "react"
import toast from "react-hot-toast"

export interface Product {
    id_producto: string
    nombre: string
    id_categoria: string
    precio_venta: number
    stock: number
    costo: number
    codigo_barras?: string 
}

export interface CartItem extends Product {
    qty: number
}

export function useCart() {
    const [cart, setCart] = useState<CartItem[]>([])

    const handleAddCart = (producto: Product): boolean => {
        if (producto.stock < 1) {
            toast.error(`No hay stock disponible de ${producto.nombre}`)
            return false 
        }

        // 🔥 Validamos ANTES del setCart para no romper la regla de React
        const existingItem = cart.find(item => item.id_producto === producto.id_producto)
        
        if (existingItem) {
            if (existingItem.qty >= producto.stock) {
                toast.error(`Solo hay ${producto.stock} unidades en stock`)
                return false
            }
            
            setCart(prevCart => prevCart.map(item =>
                item.id_producto === producto.id_producto ? { ...item, qty: item.qty + 1 } : item
            ))
        } else {
            setCart(prevCart => [...prevCart, { ...producto, qty: 1 }])
        }

        return true
    }

    const handleIncrement = (id_producto: string) => {
        // 🔥 Validamos estado actual antes de actualizar
        const existingItem = cart.find(item => item.id_producto === id_producto)
        
        if (existingItem && existingItem.qty >= existingItem.stock) {
            toast.error(`Stock máximo alcanzado (${existingItem.stock})`)
            return
        }

        setCart(prevCart => prevCart.map(item =>
            item.id_producto === id_producto ? { ...item, qty: item.qty + 1 } : item
        ))
    }

    const handleDecrement = (id_producto: string) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id_producto === id_producto && item.qty > 1) {
                return { ...item, qty: item.qty - 1 }
            }
            return item
        }))
    }

    const handleManualQuantity = (id_producto: string, value: string, stock: number) => {
        const newQty = value === "" ? 0 : parseInt(value, 10)
        
        if (!isNaN(newQty) && newQty >= 0) {
            // 🔥 Sacamos el toast afuera del setCart
            if (newQty > stock) {
                toast.error(`Solo hay ${stock} unidades en stock`)
                setCart(prevCart => prevCart.map(item =>
                    item.id_producto === id_producto ? { ...item, qty: stock } : item
                ))
            } else {
                setCart(prevCart => prevCart.map(item =>
                    item.id_producto === id_producto ? { ...item, qty: newQty } : item
                ))
            }
        }
    }

    const handleManualBlur = (id_producto: string) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id_producto === id_producto && item.qty === 0) {
                return { ...item, qty: 1 } 
            }
            return item
        }))
    }

    const handleRemove = (id_producto: string) => {
        setCart(prevCart => prevCart.filter(item => item.id_producto !== id_producto))
        toast.success("Producto removido del carrito")
    }

    const vaciarCarrito = () => setCart([])

    const subTotal = cart.reduce((acc, item) => acc + (Number(item.precio_venta) * item.qty), 0)
    const subTotalFormateado = `$${subTotal.toFixed(2)}`
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0)

    const itemsParaCheckout = cart.map(item => ({
        idProducto: item.id_producto,
        cantidad: item.qty,
        precioUnitario: Number(item.precio_venta)
    }))

    return {
        cart, handleAddCart, handleIncrement, handleDecrement, handleManualQuantity, 
        handleManualBlur, handleRemove, vaciarCarrito, subTotal, subTotalFormateado, 
        totalItems, itemsParaCheckout
    }
}