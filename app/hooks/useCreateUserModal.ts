import { useState } from "react"
import { registerUserAction } from "../admin/actions"
import toast from "react-hot-toast"

export function useCreateUserModal(){
    const [open, setOpen] = useState(false)
        const [errorMsg, setErrorMsg] = useState<string | null>(null)
        const [loading, setLoading] = useState(false)
        const [rolSeleccionado, setRolSeleccionado] = useState("0") // Por defecto Cajero

        async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault()
            setErrorMsg(null)
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

                toast.success("Usuario creado exitosamente")
                form.reset()          
                setRolSeleccionado("0") 
                setLoading(false)     
                setOpen(false)        
                
            } catch (err: any) {
                if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
                    toast.success("Usuario creado exitosamente")
                    setOpen(false)
                    throw err
                }

                const errorMessage = err?.message || "Ocurrió un error inesperado al registrar"
                setErrorMsg(errorMessage)
                toast.error(errorMessage)
                setLoading(false)
            }
        }

        const handleOpenChange = (isOpen: boolean) => {
            setOpen(isOpen)
            if (!isOpen) {
                setErrorMsg(null)
                setLoading(false)
                setRolSeleccionado("0")
            }
        }

        return {
            open,errorMsg,loading,rolSeleccionado,setRolSeleccionado,handleSubmit, handleOpenChange
        }
}