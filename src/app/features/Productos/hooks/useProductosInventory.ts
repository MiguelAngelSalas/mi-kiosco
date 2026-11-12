import { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"

// Acordate de actualizar estas rutas apuntando a tus nuevos archivos en /features/Productos/
import { getProductsAction, getCategoriesAction, deleteProductAction } from "../actions" 
import { Product , Categoria} from "./interfaces/interfaces"

export function useProductosInventory() {
    const [loadingData, setLoadingData] = useState(true) 
    const [productos, setProductos] = useState<Product[]>([])
    const [categorias, setCategorias] = useState<Categoria[]>([])

    const fetchRealData = useCallback(async () => {
        setLoadingData(true)
        
        const [prodRes, catRes] = await Promise.all([
            getProductsAction(),
            getCategoriesAction()
        ])

        if (prodRes.success && prodRes.data) {
            const productosAdaptados: Product[] = prodRes.data.map((p: any) => ({
                id_producto: p.id,
                nombre: p.nombre,
                codigo_barras: p.codigoBarras,
                precio_venta: p.precioVenta,
                costo: p.precioCosto,
                stock: p.stock,
                id_categoria: p.categoriaId
            }))
            setProductos(productosAdaptados)
        } else {
            toast.error("No se pudieron cargar los productos")
        }

        if (catRes.success && catRes.data) {
            const categoriasAdaptadas: Categoria[] = catRes.data.map((c: any) => ({
                id_categoria: c.id, 
                nombre_categoria: c.nombre
            }))
            setCategorias(categoriasAdaptadas)
        }

        setLoadingData(false)
    }, [])

    // El useEffect ahora solo se preocupa por traer los datos al montar el componente
    useEffect(() => {
        fetchRealData()
    }, [fetchRealData])

    const handleDeleteProduct = async (id: string | number, nombre: string) => {
        if (window.confirm(`¿Estás seguro que querés borrar el producto "${nombre}"?`)) {
            const toastId = toast.loading("Eliminando producto...")

            try {
                const respuesta = await deleteProductAction(id)

                if (respuesta?.error) {
                    toast.error(respuesta.error, { id: toastId })
                    return
                }

                setProductos(prev => prev.filter(p => p.id_producto !== id))
                toast.success(`Producto "${nombre}" eliminado`, { id: toastId })

            } catch (err) {
                toast.error("Ocurrió un error al eliminar", { id: toastId })
            }
        }
    }

    return {
        loadingData,
        productos,
        setProductos,
        categorias,
        setCategorias,
        handleDeleteProduct,
        refrescarDatos: fetchRealData // Te dejé esto expuesto por si agregás un producto y querés forzar que se recargue la lista
    }
}