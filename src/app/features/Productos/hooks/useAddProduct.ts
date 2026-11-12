import { useState } from "react"
import toast from "react-hot-toast"
import { addProductAction } from "../actions" 
import { Product, ActionResponse } from "./interfaces/interfaces"

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
            const idReal = respuesta.productoNuevo?.id_producto || Date.now().toString()
            
            onSuccess({
                id_producto: idReal,
                nombre: formData.get("nombre") as string,
                codigo_barras: formData.get("codigoBarras") as string,
                precio_venta: Number(formData.get("precioVenta")),
                costo: Number(formData.get("precioCosto")),
                stock: Number(formData.get("stock")),
                id_categoria: Number(formData.get("categoriaId")) // 👈 ¡LA MAGIA ESTABA ACÁ! Pasarlo a Number()
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