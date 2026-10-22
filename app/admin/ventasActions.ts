"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const API_URL = process.env.API_RENDER || "http://localhost:3000" // Ajustá tu base URL

interface VentaPayload {
    medioPago: string
    montoRecibido: number
    items: {
        idProducto: number
        cantidad: number
    }[]
}

export async function registrarVentaAction(payload: VentaPayload) {
    // 1. BUSCAMOS EL TOKEN PARA QUE NO TIRE 401
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) {
        return { error: "No estás autorizado. Tu sesión expiró." }
    }
    console.log("🚨 TOKEN EN NEXT.JS:", token)

    try {
        // 2. LE PEGAMOS AL BACKEND EXACTAMENTE COMO PIDE AGUS
        // Ojo acá: chequeá si tu endpoint es /api/Ventas, /api/Venta, etc.
        const res = await fetch(`${API_URL}/api/Ventas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}`
            }, 
            body: JSON.stringify(payload),
            cache: 'no-store'
        })

        // 3. LEEMOS LA RESPUESTA CRUDA DEL BACKEND COMO TEXTO
        const textData = await res.text()
        
        // 4. LA IMPRIMIMOS EN TU TERMINAL (Ideal para debuggear)
        console.log("🚨 STATUS DEL BACKEND (VENTA):", res.status)
        console.log("🚨 RESPUESTA DEL BACKEND (VENTA):", textData)

        // 5. Intentamos pasarlo a JSON por si viene ordenado
        let data = null
        try { data = JSON.parse(textData) } catch(e) {}

        if (!res.ok) {
            return { error: data?.message || data?.error || `Error del servidor (${res.status})` }
        }

        // 6. Refrescamos la UI de la caja para que baje el stock automáticamente
        revalidatePath("/caja") // Ajustá esto a la ruta real de tu POS

        return { 
            success: true, 
            data 
        }
    } catch(error) {
        console.log("🚨 ERROR DE RED/FETCH (VENTA):", error)
        return { error: `No se pudo conectar al servidor` }
    }
}