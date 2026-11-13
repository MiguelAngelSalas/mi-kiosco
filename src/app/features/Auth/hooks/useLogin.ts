import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { loginUserAction } from "../actions"

export function useLogin() {
    const [inputUsername, setInputUsername] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg(null)
        setLoading(true)

        const result = await loginUserAction(inputUsername, inputPassword)
        setLoading(false)

        if (result.error) {
            setErrorMsg(result.error)
            toast.error(result.error)
            return
        }

        const role = result.role!
        toast.success(`Bienvenido ${inputUsername}!`)

        // 1. Guardamos el rol 
        localStorage.setItem("rolUsuario", role)
        
        // 👇 2. EL ARREGLO: Buscamos el nombre adentro de result.user, 
        // y si TypeScript o el backend no lo encuentran, usamos el inputUsername
        const nombreParaGuardar = result.user?.nombre || inputUsername
        localStorage.setItem("nombreUsuario", nombreParaGuardar) 

        if (role === "administrador") {
            router.push("/admin")
        } else {
            router.push("/CheckoutMenu")
        }
    }

    return {
        inputUsername,
        setInputUsername,
        inputPassword,
        setInputPassword,
        errorMsg,
        loading,
        handleLogin
    }
}