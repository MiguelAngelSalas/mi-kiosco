"use server"

import { redirect } from "next/navigation"
import {cookies} from "next/headers"

const API_URL = process.env.API_RENDER|| "https://metodologias-agiles-proyecto-backend.onrender.com"

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

export async function addProductAction(formData: FormData){
    // 1. Agarramos TODOS los datos que nos pide el Swagger de Agus
    const nombre = formData.get("nombre")?.toString().trim()
    const codigoBarras = formData.get("codigoBarras")?.toString().trim()
    const precioCosto = Number(formData.get("precioCosto"))
    const precioVenta = Number(formData.get("precioVenta"))
    const stock = Number(formData.get("stock"))
    const categoriaId = Number(formData.get("categoriaId"))

    if(!nombre || !precioCosto || !precioVenta || !codigoBarras || !categoriaId){
        return {error: "Todos los campos son obligatorios."}
    }

    // 2. BUSCAMOS EL TOKEN PARA QUE NO TIRE 401
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) {
        return { error: "No estás autorizado. Tu sesión expiró." }
    }

    // 3. Armamos el JSON exactamente como le gusta a Agus
    const payload = {
        nombre: nombre,
        codigoBarras: codigoBarras,
        precioCosto: precioCosto,
        precioVenta: precioVenta,
        stock: stock,
        categoriaId: categoriaId
    }

    try{
        const res = await fetch(`${API_URL}/api/Productos`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}` // <-- LA LLAVE MAGICA
            }, 
            body: JSON.stringify(payload),
            cache: 'no-store' // <-- ANTI FANTASMAS DE NEXT.JS
        })

        const data = await res.json().catch(()=>null)

        if(!res.ok){
            return {error: data?.message || data?.error || `Error del servidor (${res.status})`}
        }

        return {success : true, productoNuevo: payload} // success corregido
    }catch(error){
        return {error: `No se pudo conectar al servidor`}
    }
}

export async function createCategoryAction(formData: FormData) {
    const nombre = formData.get("nombre")?.toString().trim()

    if (!nombre) {
        return { error: "El nombre de la categoría es obligatorio." }
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) {
        return { error: "No estás autorizado. Tu sesión expiró." }
    }

    try {
        // Asegurate de que esta ruta sea la correcta en tu Swagger (Suele ser /api/Categorias)
        const res = await fetch(`${API_URL}/api/Categorias`, { 
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}`
            },
            body: JSON.stringify({ nombre }),
            cache: 'no-store'
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => null)
            return { error: errorData?.message || `Error del servidor (${res.status})` }
        }

        // Muchos backends devuelven el objeto recién creado (con su nuevo ID real). Lo intentamos capturar.
        const nuevaCategoria = await res.json().catch(() => null)

        return { success: true, data: nuevaCategoria }

    } catch (err: any) {
        return { error: "No se pudo conectar con el servidor." }
    }
}

export async function getProductsAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado" }

    try {
        const res = await fetch(`${API_URL}/api/Productos`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: 'no-store'
        })
        if (!res.ok) return { error: "Error al traer productos" }
        const data = await res.json()
        return { success: true, data }
    } catch (error) {
        return { error: "No se pudo conectar al servidor" }
    }
}

export async function getCategoriesAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado" }

    try {
        const res = await fetch(`${API_URL}/api/Categorias`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: 'no-store'
        })
        if (!res.ok) return { error: "Error al traer categorías" }
        const data = await res.json()
        return { success: true, data }
    } catch (error) {
        return { error: "No se pudo conectar al servidor" }
    }
}

export async function updateProductAction(id: string | number, formData: FormData) {
    const nombre = formData.get("nombre")?.toString().trim()
    const codigoBarras = formData.get("codigoBarras")?.toString().trim()
    const precioCosto = Number(formData.get("precioCosto"))
    const precioVenta = Number(formData.get("precioVenta"))
    const stock = Number(formData.get("stock"))
    const categoriaId = Number(formData.get("categoriaId"))

    if (!nombre || !precioCosto || !precioVenta || !categoriaId) {
        return { error: "Faltan campos obligatorios." }
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado." }

    const payload = {
        id: Number(id), // Generalmente en C# el PUT pide el ID en el cuerpo o en la URL
        nombre,
        codigoBarras: codigoBarras || "", // Si no lo tenías, mandamos vacío o lo que venga
        precioCosto,
        precioVenta,
        stock,
        categoriaId
    }

    try {
        // Fijate en el Swagger si la ruta es /api/Productos o /api/Productos/{id}
        const res = await fetch(`${API_URL}/api/Productos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}`
            },
            body: JSON.stringify(payload),
            cache: 'no-store'
        })

        if (!res.ok) {
            const data = await res.json().catch(() => null)
            console.log("🚨 ERROR DESDE C# AL EDITAR:", JSON.stringify(data, null, 2))
            
            // Los backends de .NET suelen esconder los errores de validación adentro de un objeto "errors"
            let errorDetallado = ""
            if (data?.errors) {
                errorDetallado = JSON.stringify(data.errors)
            }
            return { error: data?.message || data?.error || `Error del servidor (${res.status})` }
        }

        return { success: true }
    } catch (error) {
        return { error: "No se pudo conectar al servidor para actualizar." }
    }
}

export async function deleteProductAction(id: string | number) {
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado." }

    try {
        const res = await fetch(`${API_URL}/api/Productos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token.trim()}`
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            const data = await res.json().catch(() => null)
            return { error: data?.message || data?.error || `Error al eliminar (${res.status})` }
        }

        return { success: true }
    } catch (error) {
        return { error: "No se pudo conectar al servidor para eliminar." }
    }
}
