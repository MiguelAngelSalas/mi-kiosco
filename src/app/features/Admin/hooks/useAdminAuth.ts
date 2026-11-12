import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function useAdminAuth() {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")

        if (!storedRole || storedRole !== "administrador") {
            toast.error("Acceso denegado. Solo administradores.")
            router.push("/login") 
            return
        } 
        
        setIsAuthorized(true)
    }, [router])

    return { isAuthorized }
}