import { useState } from "react"
import toast from "react-hot-toast"
import { registerUserAction } from "../admin/actions" // Ajustá la ruta según tu estructura

export function useRegisterAdmin() {
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [rolSeleccionado, setRolSeleccionado] = useState("1") // Por defecto Administrador

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrorMsg(null)

        // Validación exclusiva para el MVP de la facultad
        if (rolSeleccionado === "0") {
            toast.error("¡No podés crear una cuenta como cajero desde acá!")
            return
        }

        setLoading(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        try {
            const respuesta = await registerUserAction(formData)

            if (respuesta?.error) {
                setErrorMsg(respuesta.error)
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            toast.success("Usuario administrador creado exitosamente")
            // Acá podrías agregar un form.reset() si no redirige automáticamente
        } catch (err: any) {
            // Next.js tira un error interno cuando hacemos "redirect()" en el servidor, 
            // lo atajamos acá para que no pinche la app.
            if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
                toast.success("Usuario administrador creado exitosamente")
                throw err
            }

            const errorMessage = err?.message || "Ocurrió un error inesperado al registrar"
            setErrorMsg(errorMessage)
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    // Retornamos todo lo que la vista va a necesitar
    return {
        errorMsg,
        loading,
        rolSeleccionado,
        setRolSeleccionado,
        handleSubmit
    }
}