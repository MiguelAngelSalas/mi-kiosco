"use client"
import { useState } from "react"
import toast from "react-hot-toast"
import { createCategoryAction } from "../admin/actions"

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

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        // 👇 HACK MOBILE 1: Forzamos que se cierre el teclado ANTES de hacer nada
        if (typeof window !== "undefined" && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }

        const nombreLimpio = nombreCategoria.trim()

        if (!nombreLimpio) {
            toast.error("El nombre de la categoría es obligatorio")
            return
        }

        setLoading(true)

        const formData = new FormData()
        formData.append("nombre", nombreLimpio)

        try {
            const respuesta = await createCategoryAction(formData)

            if (respuesta?.error) {
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            const nuevoId = respuesta?.data?.id_categoria || respuesta?.data?.id || Date.now()
            const nuevoNombre = respuesta?.data?.nombre_categoria || respuesta?.data?.nombre || nombreLimpio

            onSuccess({
                id_categoria: nuevoId,
                nombre_categoria: nuevoNombre
            })

            toast.success("Categoría agregada exitosamente")
            setNombreCategoria("")
            setLoading(false)

            // 👇 HACK MOBILE 2: Le damos 150 milisegundos al celular para que termine 
            // la animación de cerrar el teclado antes de destruir el HTML de la ventana.
            setTimeout(() => {
                onClose()
            }, 150)

        } catch (err: any) {
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