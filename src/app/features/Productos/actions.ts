"use server"
import {cookies} from "next/headers"

const API_URL = process.env.API_RENDER


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

export async function addProductAction(formData: FormData){
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

    try {
        const res = await fetch(`${API_URL}/api/Productos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}`
            }, 
            body: JSON.stringify(payload),
            cache: 'no-store'
        })

        // 1. LEEMOS LA RESPUESTA CRUDA DEL BACKEND COMO TEXTO
        const textData = await res.text()
        
        // 2. LA IMPRIMIMOS EN TU TERMINAL PARA VER QUÉ SE QUEJA AGUS
        console.log("🚨 STATUS DEL BACKEND:", res.status)
        console.log("🚨 RESPUESTA DEL BACKEND:", textData)

        // 3. Intentamos pasarlo a JSON por si viene ordenado
        let data = null
        try { data = JSON.parse(textData) } catch(e) {}

        if (!res.ok) {
            return { error: data?.message || data?.error || `Error del servidor (${res.status})` }
        }

        return { 
            success: true, 
            productoNuevo: { ...payload, id_producto: data?.id_producto || data?.id || data?.data?.id_producto } 
        }
    } catch(error) {
        console.log("🚨 ERROR DE RED/FETCH:", error)
        return { error: `No se pudo conectar al servidor` }
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