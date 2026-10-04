import { useState } from "react"
import toast from "react-hot-toast"
import { createCategoryAction } from "../admin/actions" // Ajustá esta ruta

export interface Categoria {
    id_categoria: string | number
    nombre_categoria: string
}

export function useAddCategory(onClose: () => void, onSuccess: (nuevaCategoria: Categoria) => void) {
    const [nombreCategoria, setNombreCategoria] = useState("")
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setNombreCategoria("")
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const nombreLimpio = nombreCategoria.trim()

        if (!nombreLimpio) {
            toast.error("El nombre de la categoría es obligatorio")
            return
        }

        setLoading(true)

        // Armamos el FormData a mano porque estamos usando un estado controlado
        const formData = new FormData()
        formData.append("nombre", nombreLimpio)

        try {
            const respuesta = await createCategoryAction(formData)

            if (respuesta?.error) {
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            toast.success("Categoría agregada en el servidor")
            
            // Le pasamos al componente padre la categoría
            onSuccess({
                id_categoria: respuesta.data?.id || respuesta.data?.id_categoria || Date.now(),
                nombre_categoria: respuesta.data?.nombre || nombreLimpio
            })
            
            setNombreCategoria("")
            setLoading(false)
            onClose()

        } catch (err) {
            toast.error("Error inesperado al guardar la categoría")
            setLoading(false)
        }
    }

    return {
        nombreCategoria,
        setNombreCategoria,
        loading,
        handleClose,
        handleSubmit
    }
}