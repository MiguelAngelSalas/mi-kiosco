import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { updateProductAction } from "../admin/actions" // Ajustá la ruta si es necesario

// Podemos definir la interfaz del producto acá o importarla si la tenés centralizada
export interface Product {
    id_producto: string | number
    nombre: string
    id_categoria: string | number
    precio_venta: number
    stock: number
    costo: number
    codigo_barras?: string 
}

export function useEditProduct(product: Product | null, onClose: () => void, onSuccess?: (updated: Product) => void) {
    const [loading, setLoading] = useState(false)
    const [editForm, setEditForm] = useState({
        nombre: "",
        codigo_barras: "",
        precio_venta: 0,
        costo: 0,
        stock: 0,
        id_categoria: ""
    })

    // Sincroniza el formulario cuando cambia el producto seleccionado
    useEffect(() => {
        if (product) {
            setEditForm({
                nombre: product.nombre || "",
                codigo_barras: product.codigo_barras || "",
                precio_venta: product.precio_venta || 0,
                costo: product.costo || 0,
                stock: product.stock || 0,
                id_categoria: product.id_categoria?.toString() || ""
            })
        }
    }, [product])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!editForm.nombre.trim()) {
            toast.error("El nombre del producto es obligatorio")
            return
        }
        if (!editForm.id_categoria) {
            toast.error("Debés seleccionar una categoría")
            return
        }

        setLoading(true)

        const formData = new FormData()
        formData.append("nombre", editForm.nombre)
        formData.append("codigoBarras", editForm.codigo_barras)
        formData.append("precioVenta", editForm.precio_venta.toString())
        formData.append("precioCosto", editForm.costo.toString())
        formData.append("stock", editForm.stock.toString())
        formData.append("categoriaId", editForm.id_categoria)

        try {
            // El ! después de product le dice a TypeScript que sabemos que no es null acá
            const respuesta = await updateProductAction(product!.id_producto, formData)

            if (respuesta?.error) {
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            const productoActualizado: Product = {
                ...product!,
                nombre: editForm.nombre.trim(),
                codigo_barras: editForm.codigo_barras.trim(),
                precio_venta: Number(editForm.precio_venta) || 0,
                costo: Number(editForm.costo) || 0,
                stock: Number(editForm.stock) || 0,
                id_categoria: editForm.id_categoria
            }

            if (onSuccess) onSuccess(productoActualizado)
            
            setLoading(false)
            onClose()
        } catch (err) {
            toast.error("Ocurrió un error al actualizar")
            setLoading(false)
        }
    }

    return {
        loading,
        editForm,
        setEditForm,
        handleSubmit
    }
}