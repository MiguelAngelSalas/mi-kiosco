"use server"
import {cookies} from "next/headers"

const API_URL = process.env.API_RENDER


export async function loginUserAction(nombre: string, password: string) {
    if (!nombre.trim() || !password) {
        return { error: "Por favor ingresá usuario y contraseña." }
    }

    try {
        // En Swagger suele ser /api/Auth/login
        const res = await fetch(`${API_URL}/api/Auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: nombre.trim(),
                password,
            }),
        })

        const data = await res.json().catch(() => null)

        if (!res.ok) {
            const errorMsg = data?.message || data?.error || (typeof data === "string" ? data : `Error ${res.status}: Credenciales inválidas`)
            return { error: errorMsg }
        }

        // Mapeo flexible del rol (por si devuelve número 1/0 o texto "administrador"/"cajero")
        const rawRol = data?.rol ?? data?.role ?? data?.user?.rol
        let role = "cajero"

        if (rawRol === 1 || rawRol === "1" || String(rawRol).toLowerCase() === "administrador" || String(rawRol).toLowerCase() === "admin") {
            role = "administrador"
        }

        const token = data?.token || data?.jwt || null

        if(token){
            const cookieStore = await cookies()
            cookieStore.set("kiosco_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite:"lax",
                path:"/",
                maxAge:60*60*24
            })

            cookieStore.set("kiosco_rol", role,{
                path:"/",
                maxAge: 60*60*24
            })
           
        }

        return {
            success: true,
            role,
            user: data?.user || { nombre: data?.nombre || nombre },
        }
    } catch (err: any) {
        return {
            error: "No se pudo conectar con el servidor. Si estuvo inactivo, puede tardar unos segundos en responder.",
        }
    }
}