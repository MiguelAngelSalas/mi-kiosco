import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { loginUserAction } from "../admin/actions"

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

        localStorage.setItem("rolUsuario", role)

        if (role === "administrador") {
            router.push("/AdminPage")
        } else {
            router.push("/CheckoutMenu")
        }
    }

    // Exponemos hacia afuera solo lo que la interfaz necesita para funcionar
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