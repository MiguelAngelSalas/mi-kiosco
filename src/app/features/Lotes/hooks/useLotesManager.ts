import { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"

import { getProductsAction } from "@/src/app/features/Productos/actions"
// 👇 1. Importamos también eliminarLoteAction
import { registrarLoteAction, getLotesProductoAction, getVencimientosProximosAction, eliminarLoteAction } from "../actions" 
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

    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const cargarProductos = useCallback(async () => {
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
    }, [])

    useEffect(() => {
        cargarProductos()
    }, [cargarProductos])

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

            await cargarProductos()
            setRefreshTrigger(prev => prev + 1)
        }
        setLoading(false)
    }

    // 👇 2. ACÁ AGREGAMOS LA FUNCIÓN PARA ELIMINAR EL LOTE
    const handleEliminarLote = async (idLote: number) => {
        if (!window.confirm("¿Estás seguro de que querés eliminar este lote?")) return

        const toastId = toast.loading("Eliminando lote...")
        const res = await eliminarLoteAction(idLote)

        if (res.success) {
            toast.success("Lote eliminado correctamente.", { id: toastId })

            // Refrescamos los lotes del producto seleccionado
            if (productoSeleccionado) {
                const resLotes = await getLotesProductoAction(Number(productoSeleccionado.id_producto))
                if (resLotes.success && resLotes.data) setLotesProducto(resLotes.data)
            }

            // Refrescamos stock general y panel superior sin recargar la página
            await cargarProductos()
            setRefreshTrigger(prev => prev + 1)
        } else {
            toast.error(res.error || "No se pudo eliminar el lote.", { id: toastId })
        }
    }

    return {
        productos, loadingProductos,
        productoSeleccionado, setProductoSeleccionado,
        cantidad, setCantidad,
        fechaVencimiento, setFechaVencimiento,
        lotesProducto, loadingLotes, loading,
        refreshTrigger, 
        handleGuardarLote, 
        handleEliminarLote, // 👈 3. Lo exportamos para usarlo en la vista
        obtenerEstadoVencimiento
    }
}

export function useLowExpiration(diasMargen: number = 30, refreshTrigger: number = 0) {
    const [lotesCriticos, setLotesCriticos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [hayAlertaVencimiento, setHayAlertaVencimiento] = useState(false)

    useEffect(() => {
        const cargarVencimientos = async () => {
            setLoading(true)
            const res = await getVencimientosProximosAction(diasMargen)

            if (res.success && res.data) {
                setLotesCriticos(res.data)
                setHayAlertaVencimiento(res.data.length > 0)

                if (res.data.length > 0) {
                    toast.error(`¡Atención! Hay ${res.data.length} lote(s) próximos a vencer.`, {
                        id: "alerta-vencimientos-toast",
                        duration: 5000
                    })
                }
            } else {
                console.error(res.error)
            }
            setLoading(false)
        }

        cargarVencimientos()
    }, [diasMargen, refreshTrigger]) // 👈 Añadido para que se actualice al borrar o crear lotes

    return { lotesCriticos, loading, hayAlertaVencimiento }
}