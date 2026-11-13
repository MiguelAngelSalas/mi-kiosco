import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { getProductsAction } from "../../Productos/actions"
import { Product } from "../../Productos/hooks/interfaces/interfaces" 

export function usePosData() {
    const router = useRouter()
    const [userRole, setUserRole] = useState("")
    const [userName, setUserName] = useState("") // 👈 1. NUEVO ESTADO PARA EL NOMBRE
    const [productos, setProductos] = useState<Product[]>([])
    const [loadingData, setLoadingData] = useState(true)

    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")
        
        // 👇 2. Buscamos el nombre (Ajustá "nombreUsuario" si en tu login le pusiste otra clave)
        const storedName = localStorage.getItem("nombreUsuario") || "Usuario"
        
        if (!storedRole) {
            toast.error("Debés iniciar sesión")
            router.push("/login")
            return
        } 
        
        setUserRole(storedRole)
        setUserName(storedName) // 👈 3. Lo guardamos en el estado

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

    // 👇 4. Exportamos el userName para que CheckoutMenu lo pueda usar
    return { userName, userRole, productos, loadingData } 
}