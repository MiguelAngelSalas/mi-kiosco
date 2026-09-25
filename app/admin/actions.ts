"use server"

import { redirect } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://metodologias-agiles-proyecto-backend.onrender.com"

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

    let shouldRedirect = false

    try {
        // Endpoint exacto de tu Swagger
        const res = await fetch(`${API_URL}/api/Auth/createUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        // Si la respuesta no es OK, tratamos de leer el error devuelto por la API
        if (!res.ok) {
            const data = await res.json().catch(() => null)
            const errorMsg = data?.message || data?.error || (typeof data === "string" ? data : `Error del servidor (${res.status})`)
            return { error: errorMsg }
        }

        shouldRedirect = true
    } catch (err: any) {
        return {
            error: "No se pudo conectar con el servidor. Si estuvo inactivo, puede demorar unos segundos en arrancar.",
        }
    }

    if (shouldRedirect) {
        redirect("/login?registrado=true")
    }
}

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

        return {
            success: true,
            role,
            token: data?.token || data?.jwt || null,
            user: data?.user || { nombre: data?.nombre || nombre },
        }
    } catch (err: any) {
        return {
            error: "No se pudo conectar con el servidor. Si estuvo inactivo, puede tardar unos segundos en responder.",
        }
    }
}