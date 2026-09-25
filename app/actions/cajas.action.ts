"use server"
import { db } from "../db/db.server"
import { cajasDiarias } from "@/app/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Acción para abrir la caja al inicio del turno
export async function abrirCajaAction(idUsuario: number, montoInicial: number) {
    try {
        const [nuevaCaja] = await db.insert(cajasDiarias).values({
            id_usuario: idUsuario,
            monto_inicial: montoInicial.toString(), // Lo pasamos a string por el NUMERIC
            estado: "abierta"
        }).returning({ id_caja: cajasDiarias.id_caja });

        revalidatePath("/CheckoutMenu")
        return { success: true, id_caja: nuevaCaja.id_caja }
    } catch (error) {
        console.error("Error abriendo caja:", error)
        return { error: "No se pudo abrir la caja. Verificá tu conexión." }
    }
}

// Acción para chequear si el usuario ya abrió caja hoy
export async function obtenerCajaAbiertaAction(idUsuario: number) {
    try {
        // Usamos db.select() clásico para evitar problemas de relaciones
        const resultado = await db.select()
            .from(cajasDiarias)
            .where(
                and(
                    eq(cajasDiarias.id_usuario, idUsuario),
                    eq(cajasDiarias.estado, "abierta")
                )
            )
            .limit(1);
        
        // Si encontró una caja abierta, devuelve su ID, sino devuelve null
        return resultado.length > 0 ? resultado[0].id_caja : null;
    } catch (error) {
        console.error("Error obteniendo caja:", error)
        return null;
    }
}