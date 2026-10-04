import { useState } from "react"
import toast from "react-hot-toast"
import { addProductAction } from "../admin/actions" 

export interface Product {
    id_producto: string | number
    nombre: string
    id_categoria: string | number
    precio_venta: number
    costo: number
    stock: number
    codigo_barras?: string 
}

// 🌟 MAGIA TS: Definimos el "contrato" de lo que devuelve el servidor
interface ActionResponse {
    error?: string;
    id_producto?: string | number;
}

export function useAddProduct(onClose: () => void, onSuccess: (newProduct: Product) => void) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)

        if (!formData.get("nombre") || !formData.get("codigoBarras") || formData.get("categoriaId") === "") {
            toast.error("Completá todos los campos obligatorios")
            return
        }

        setLoading(true)

        try {
            // 🌟 MAGIA TS: Le decimos a TS que la respuesta cumple con ActionResponse
            const respuesta = await addProductAction(formData) as ActionResponse

            if (respuesta?.error) {
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            toast.success("Producto creado en el servidor")
            
            // Ahora TS sabe perfectamente que id_producto puede existir
            const idReal = respuesta.id_producto || Date.now().toString()

            onSuccess({
                id_producto: idReal,
                nombre: formData.get("nombre") as string,
                codigo_barras: formData.get("codigoBarras") as string,
                precio_venta: Number(formData.get("precioVenta")),
                costo: Number(formData.get("precioCosto")),
                stock: Number(formData.get("stock")),
                id_categoria: formData.get("categoriaId") as string
            })
            
            form.reset()
            setLoading(false)
            onClose()

        } catch (err) {
            toast.error("Error inesperado al guardar el producto")
            setLoading(false)
        }
    }

    return {
        loading,
        handleSubmit
    }
}