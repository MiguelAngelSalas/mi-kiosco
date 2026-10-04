import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { getProductsAction } from "../admin/actions"
import { Product } from "./useCart"

export function usePosData() {
    const router = useRouter()
    const [userRole, setUserRole] = useState("")
    const [productos, setProductos] = useState<Product[]>([])
    const [loadingData, setLoadingData] = useState(true)

    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")
        if (!storedRole) {
            toast.error("Debés iniciar sesión")
            router.push("/login")
            return
        } 
        setUserRole(storedRole)

        const fetchRealData = async () => {
            setLoadingData(true)
            const prodRes = await getProductsAction()

            if (prodRes.success && prodRes.data) {
                const productosAdaptados: Product[] = prodRes.data.map((p: any) => ({
                    id_producto: String(p.id),
                    nombre: p.nombre,
                    codigo_barras: p.codigoBarras,
                    precio_venta: p.precioVenta,
                    costo: p.precioCosto,
                    stock: p.stock,
                    id_categoria: String(p.categoriaId)
                }))
                setProductos(productosAdaptados)
            } else {
                toast.error("Error al cargar el inventario de la base de datos")
            }
            setLoadingData(false)
        }

        fetchRealData()
    }, [router])

    return { userRole, productos, loadingData }
}