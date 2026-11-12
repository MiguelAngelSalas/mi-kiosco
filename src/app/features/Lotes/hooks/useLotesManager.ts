import { useState, useEffect } from "react"
import toast from "react-hot-toast"

import { getProductsAction } from "@/src/app/features/Productos/actions"
// Asumiendo que mudaste estas dos acciones a la carpeta de Lotes como hablamos recién:
import { registrarLoteAction, getLotesProductoAction } from "../actions" 
import type { Product } from "@/src/app/features/Productos/hooks/interfaces/interfaces"

export function useLotesManager() {
    const [productos, setProductos] = useState<Product[]>([])
    const [productoSeleccionado, setProductoSeleccionado] = useState<Product | null>(null)
    const [cantidad, setCantidad] = useState("")
    const [fechaVencimiento, setFechaVencimiento] = useState("")
    
    const [loading, setLoading] = useState(false)
    const [loadingProductos, setLoadingProductos] = useState(true)
    
    const [lotesProducto, setLotesProducto] = useState<any[]>([])
    const [loadingLotes, setLoadingLotes] = useState(false)

    // Cargar productos globales
    useEffect(() => {
        const cargarDatos = async () => {
            setLoadingProductos(true)
            const res = await getProductsAction()
            if (res.error) {
                toast.error(res.error)
            } else if (res.success && res.data) {
                const productosNormalizados: Product[] = res.data.map((p: any) => ({
                    id_producto: p.id,
                    nombre: p.nombre,
                    precio_venta: p.precioVenta ?? 0,
                    costo: p.precioCosto ?? 0,
                    id_categoria: p.categoriaId ?? 0,
                    stock: p.stock ?? 0,
                    codigo_barras: p.codigoBarras || ""
                }))
                setProductos(productosNormalizados)
            }
            setLoadingProductos(false)
        }
        cargarDatos()
    }, [])

    // Buscar lotes cuando se selecciona un producto
    useEffect(() => {
        const fetchLotes = async () => {
            if (!productoSeleccionado) {
                setLotesProducto([])
                return
            }
            setLoadingLotes(true)
            const res = await getLotesProductoAction(Number(productoSeleccionado.id_producto))
            if (res.success && res.data) {
                setLotesProducto(res.data)
            } else {
                setLotesProducto([])
            }
            setLoadingLotes(false)
        }
        fetchLotes()
    }, [productoSeleccionado])

    // 👇 Pura lógica de negocio, sin JSX ni íconos
    const obtenerEstadoVencimiento = (fechaIso: string) => {
        const fecha = new Date(fechaIso)
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0) 

        const diffDias = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDias < 0) return { label: "Vencido", color: "red" }
        if (diffDias <= 30) return { label: `Vence en ${diffDias} días`, color: "orange" }
        return { label: "Vigente", color: "green" }
    }

    const handleGuardarLote = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!productoSeleccionado) return toast.error("Seleccioná un producto")
        if (!cantidad || !fechaVencimiento) return toast.error("Completá cantidad y fecha")

        setLoading(true)
        const res = await registrarLoteAction({
            idProducto: Number(productoSeleccionado.id_producto), 
            cantidad: parseInt(cantidad),
            fechaVencimiento: new Date(fechaVencimiento).toISOString()
        })

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("¡Lote registrado con éxito!")
            setCantidad("")
            setFechaVencimiento("")
            
            const resLotes = await getLotesProductoAction(Number(productoSeleccionado.id_producto))
            if (resLotes.success && resLotes.data) setLotesProducto(resLotes.data)
        }
        setLoading(false)
    }

    return {
        productos, loadingProductos,
        productoSeleccionado, setProductoSeleccionado,
        cantidad, setCantidad,
        fechaVencimiento, setFechaVencimiento,
        lotesProducto, loadingLotes, loading,
        handleGuardarLote, obtenerEstadoVencimiento
    }
}