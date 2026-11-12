"use server"

import { cookies } from "next/headers"
import { PreCierreDatos, VentaBackend } from "./interfaces/interfaces";

const API_URL = process.env.API_RENDER 


export async function obtenerResumenCajaAction(idCaja: number): Promise<{ success: boolean; datos?: PreCierreDatos; error?: string }> {
    console.log("👉 FRONTEND: Buscando ventas para la caja ID:", idCaja);

    try {
        const cookieStore = await cookies()
        let token = cookieStore.get("kiosco_token")?.value || ""
        token = token.replace(/"/g, "") 

        if (!token) {
            throw new Error("No hay sesión activa");
        }

        const urlFetch = `${API_URL}/api/Ventas?idCierre=${idCaja}`;
        console.log("👉 FRONTEND: URL generada para fetch:", urlFetch);

        const res = await fetch(urlFetch, {
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
        console.log("👉 FRONTEND: Ventas recibidas del backend:", ventas);

        let totalRecaudado = 0;
        const desglose = { 
            efectivo: 0, 
            cuenta_dni: 0, 
            mercadopago_qr: 0, 
            tarjeta: 0, 
            transferencia: 0 
        };

        ventas.forEach(venta => {
            totalRecaudado += venta.total;
            
            const medio = venta.medioPago ? venta.medioPago.trim().toUpperCase() : "";
            
            if (medio === "EFECTIVO") {
                desglose.efectivo += venta.total;
            } else if (medio.includes("DNI")) {
                desglose.cuenta_dni += venta.total;
            } else if (medio.includes("MERCADOPAGO") || medio.includes("QR")) {
                desglose.mercadopago_qr += venta.total;
            } else if (medio.includes("TARJETA")) {
                desglose.tarjeta += venta.total;
            } else if (medio.includes("TRANSFERENCIA")) {
                desglose.transferencia += venta.total;
            }
        });

        return {
            success: true,
            datos: {
                total_recaudado: totalRecaudado,
                desglose,
                ventas_realizadas: ventas
            }
        };
    } catch (error: unknown) {
        let errorMessage = "Ocurrió un error desconocido";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        console.error("ERROR EN EL FETCH AL BACKEND:", error); 
        
        return { success: false, error: errorMessage };
    }
}

export async function getCajasAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado" }

    try {
        const res = await fetch(`${API_URL}/api/cajas`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: 'no-store'
        })
        
        if (!res.ok) return { error: "Error al traer el estado de las cajas" }
        
        const data = await res.json()
        return { success: true, data }
    } catch (error) {
        return { error: "No se pudo conectar al servidor" }
    }
}

export async function abrirCajaAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado" }

    try {
        const res = await fetch(`${API_URL}/api/cajas/abrir`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            // Nota: Si el backend saca el idUsuario de quién abre la caja directamente 
            // desde el token JWT, lo podés mandar así vacío. Si necesita que le pases 
            // el ID explicitly, avisame y se lo agregamos al body.
        })
        
        if (!res.ok) return { error: "Error al abrir la caja" }
        
        const data = await res.json()
        return { success: true, data }
    } catch (error) {
        return { error: "No se pudo conectar al servidor" }
    }
}

export async function cerrarCajaAction(idCaja: number) {
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado" }

    try {
        const res = await fetch(`${API_URL}/api/Cajas/${idCaja}/cerrar`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        
        if (!res.ok) {
            return { error: `El servidor falló al cerrar la caja (Error ${res.status})` }
        }
        
        // Si el backend no devuelve nada (ej. un 204 No Content), esto evita que el res.json() crashee
        if (res.status === 204) {
            return { success: true }
        }

        // Usamos un catch por si devuelve un 200 OK pero con el body vacío
        const data = await res.json().catch(() => null)
        return { success: true, data }

    } catch (error) {
        return { error: "No se pudo conectar al servidor" }
    }
}