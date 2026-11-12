"use server"

import { revalidatePath } from "next/cache"
import {cookies} from "next/headers"

const API_URL = process.env.API_RENDER

interface LotePayload {
    idProducto: string | number;
    fechaVencimiento: string;
    cantidad: number;
}

export async function registrarLoteAction(payload: LotePayload) {
    if (!payload.idProducto || !payload.fechaVencimiento || !payload.cantidad) {
        return { error: "Todos los campos son obligatorios." }
    }

    // 2. BUSCAMOS EL TOKEN PARA QUE NO TIRE 401
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) {
        return { error: "No estás autorizado. Tu sesión expiró." }
    }

    try {
        const res = await fetch(`${API_URL}/api/Lotes`, {
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
        console.log("🚨 STATUS DEL BACKEND (LOTES):", res.status)
        console.log("🚨 RESPUESTA DEL BACKEND (LOTES):", textData)

        // 3. Intentamos pasarlo a JSON por si viene ordenado
        let data = null
        try { data = JSON.parse(textData) } catch(e) {}

        if (!res.ok) {
            return { error: data?.message || data?.error || `Error del servidor (${res.status})` }
        }

        // Revalidamos la ruta para que se actualice la vista si es necesario
        revalidatePath("/loteVencimiento")

        return { 
            success: true, 
            data: data
        }
    } catch(error) {
        console.log("🚨 ERROR DE RED/FETCH:", error)
        return { error: `No se pudo conectar al servidor` }
    }
}

export async function getLotesProductoAction(idProducto: number) {
    const cookieStore = await cookies()
    let token = cookieStore.get("kiosco_token")?.value || ""
    token = token.replace(/"/g, "") 

    if (!token) {
        return { error: "No estás autorizado. Tu sesión expiró." }
    }

    try {
        // 👇 ACÁ ESTÁ LA MAGIA: Le pegamos exactamente a tu ruta GET
        const res = await fetch(`${API_URL}/api/lotes`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }, 
            cache: 'no-store'
        })

        const textData = await res.text()
        let data = null
        try { data = textData ? JSON.parse(textData) : null } catch(e) {}

        if (!res.ok) {
            return { error: data?.message || data?.error || `Error del servidor (${res.status})` }
        }

        // 👇 Y ACÁ FILTRAMOS: Nos quedamos solo con los lotes del producto que tocaste
        const lotesFiltrados = data.filter((lote: any) => lote.idProducto === idProducto)

        return { success: true, data: lotesFiltrados }
        
    } catch(error) {
        console.error("🚨 ERROR DE RED/FETCH (GET LOTES):", error)
        return { error: "No se pudo conectar al servidor" }
    }
}