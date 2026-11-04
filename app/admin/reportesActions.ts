"use server"
import { cookies } from "next/headers"

const API_URL = process.env.API_RENDER || "http://localhost:5000" // Ajustá a tu variable de entorno

export async function obtenerTopProductosAction() {
    // 1. Buscamos el token de sesión (igual que en las ventas)
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) {
        return { error: "No estás autorizado. Tu sesión expiró." }
    }

    try {
        // =========================================================
        // 🚀 CÓDIGO REAL (Descomentar cuando el backend esté listo)
        // =========================================================
        /*
        const res = await fetch(`${API_URL}/api/Reportes/TopProductos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}`
            },
            cache: 'no-store' // Queremos los datos frescos siempre
        })

        if (!res.ok) {
            const textData = await res.text()
            return { error: `Error del servidor (${res.status})` }
        }

        const data = await res.json()
        return { success: true, data }
        */

        // =========================================================
        // 🚧 MOCK TEMPORAL (Mientras el endpoint no exista)
        // =========================================================
        // Simulamos el delay de la red (medio segundo)
        await new Promise(resolve => setTimeout(resolve, 500))

        const mockTopProductos = [
            { idProducto: 38, nombreProducto: "Losong pegamento", cantidadVendida: 145, totalRecaudado: 377000 },
            { idProducto: 12, nombreProducto: "Alfajor Guaymallen", cantidadVendida: 98, totalRecaudado: 49000 },
            { idProducto: 5, nombreProducto: "Coca Cola 2L", cantidadVendida: 65, totalRecaudado: 130000 },
            { idProducto: 22, nombreProducto: "Papas Lays", cantidadVendida: 42, totalRecaudado: 63000 },
            { idProducto: 8, nombreProducto: "Caramelos Flynn Paff", cantidadVendida: 30, totalRecaudado: 1500 },
        ]

        return { success: true, data: mockTopProductos }

    } catch (error) {
        console.error("🚨 ERROR AL OBTENER TOP PRODUCTOS:", error)
        return { error: "No se pudo conectar al servidor" }
    }
}