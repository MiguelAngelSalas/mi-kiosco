"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const API_URL = process.env.API_RENDER 

interface VentaPayload {
    medioPago: string
    montoRecibido: number
    items: {
        idProducto: number
        cantidad: number
    }[]
}

export interface VentaItemBackend {
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface VentaBackend {
    id: number;
    fecha: string;
    medioPago: string;
    total: number;
    montoRecibido: number;
    vuelto: number;
    idUsuario: number;
    nombreUsuario: string;
    idCliente: number;
    nombreCliente: string;
    items: VentaItemBackend[];
}

export interface PreCierreDatos {
    total_recaudado: number;
    desglose: {
        efectivo: number;
        cuenta_dni: number;
        mercadopago_qr: number;
        tarjeta: number;
        transferencia: number;
    };
    ventas_realizadas: VentaBackend[];
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

export async function obtenerResumenDelDiaAction(): Promise<{ success: boolean; datos?: PreCierreDatos; error?: string }> {
    try {
        // 👇 Leemos la cookie directamente desde el servidor
        const cookieStore = await cookies()
        const tokenCookie = cookieStore.get("kiosco_token")
        let token = tokenCookie?.value || ""
        token = token.replace(/"/g, "") // Por las dudas lo limpiamos

        if (!token) {
            throw new Error("No hay sesión activa");
        }

        const res = await fetch(`${API_URL}/api/Ventas`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            cache: "no-store"
        });

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`🚨 ERROR DEL BACKEND C#: Status ${res.status} | Mensaje:`, errorBody);
            throw new Error(`Error ${res.status} al conectar con C#`);
        }

        const ventas: VentaBackend[] = await res.json();

        // 3. Variables para calcular los totales dinámicamente
        let totalRecaudado = 0;
        const desglose = { 
            efectivo: 0, 
            cuenta_dni: 0, 
            mercadopago_qr: 0, 
            tarjeta: 0, 
            transferencia: 0 
        };

        // 4. Recorremos las ventas para sumar según el medio de pago
        ventas.forEach(venta => {
            totalRecaudado += venta.total;
            
            // Normalizamos el string para evitar problemas de mayúsculas/minúsculas
            const medio = venta.medioPago.trim().toUpperCase();
            
            if (medio === "EFECTIVO") {
                desglose.efectivo += venta.total;
            } else if (medio === "CUENTA DNI") {
                desglose.cuenta_dni += venta.total;
            } else if (medio === "MERCADOPAGO" || medio === "QR") {
                desglose.mercadopago_qr += venta.total;
            } else if (medio === "TARJETA") {
                desglose.tarjeta += venta.total;
            } else if (medio === "TRANSFERENCIA") {
                desglose.transferencia += venta.total;
            }
        });

        return {
            success: true,
            datos: {
                total_recaudado: totalRecaudado,
                desglose,
                ventas_realizadas: ventas // Pasamos el array completo para listar en la columna derecha
            }
        };
    } catch (error: unknown) {
        let errorMessage = "Ocurrió un error desconocido";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        // 👇 AGREGÁ ESTO PARA VER EL ERROR REAL EN TU TERMINAL
        console.error("ERROR EN EL FETCH AL BACKEND:", error); 
        
        return { success: false, error: errorMessage };
    }
}
