"use server"
import {cookies} from "next/headers"

const API_URL = process.env.API_RENDER

export async function registerUserAction(formData: FormData) {
    const nombre = formData.get("nombre")?.toString().trim()
    const password = formData.get("password")?.toString()
    const rolString = formData.get("rol")?.toString()

    if (!nombre || !password) {
        return { error: "Completá el nombre de usuario y la contraseña." }
    }

    const rol = rolString !== undefined ? parseInt(rolString, 10) : 0

    const payload = {
        nombre,
        password,
        rol,
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value
    console.log("Token recuperado de la cookie:", token)
    console.log("Header de autorización armado:", `Bearer ${token}`)

    if(!token){
        return {error: "No estas autorizado o tu sesion expiro"}
    }

    try {
        // Endpoint exacto de tu Swagger
        const res = await fetch(`${API_URL}/api/Auth/createUser`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}` // El trim() borra cualquier espacio invisible
            },
            body: JSON.stringify(payload),
            cache: 'no-store' // Obligamos a Next.js a no usar peticiones viejas oxidadas
        })

        // Si la respuesta no es OK, tratamos de leer el error devuelto por la API
        if (!res.ok) {
            const data = await res.json().catch(() => null)
            const errorMsg = data?.message || data?.error || (typeof data === "string" ? data : `Error del servidor (${res.status})`)
            return { error: errorMsg }
        }

        return {succes: true}
    } catch (err: any) {
        return {
            error: "No se pudo conectar con el servidor. Si estuvo inactivo, puede demorar unos segundos en arrancar.",
        }
    }

}