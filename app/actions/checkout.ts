"use server"
import { db } from "../db/db.server"
import { pagos, detalles, productos } from "@/app/db/schema" 
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Definimos la estructura exacta que manda el ButtonCheckOut
interface VentaPayload {
    idCaja: number;
    tipoMedio: string;
    items: {
        idProducto: string | number;
        cantidad: number;
        precioUnitario: number;
    }[]
}

export async function procesarVentaAction(data: VentaPayload) {
    try {
        await db.transaction(async (tx) => {
            
            // 1. Calculamos el monto total acá en el backend por seguridad
            const montoCalculado = data.items.reduce((acc, item) => {
                return acc + (item.cantidad * item.precioUnitario)
            }, 0);

            // 2. Insertamos en Pagos (monto va como número)
            const [nuevoPago] = await tx.insert(pagos).values({
                id_caja: data.idCaja,
                monto: montoCalculado, 
                tipo_medio: data.tipoMedio,
            }).returning({ 
                id_pago: pagos.id_pagos 
            });

            const pagoId = nuevoPago.id_pago;

            // 3. Preparamos el array de detalles (id_producto va como texto a 4 dígitos)
            const detallesAInsertar = data.items.map(item => ({
                id_pago: pagoId,
                id_producto: String(item.idProducto).padStart(4, '0'), 
                cantidad_producto: item.cantidad,
                precio_unitario: item.precioUnitario.toString(), 
            }));

            // Insertamos todos los detalles juntos
            await tx.insert(detalles).values(detallesAInsertar);

            // 4. Descontamos el stock
            for (const item of data.items) {
                const idStringFormat = String(item.idProducto).padStart(4, '0')
                
                await tx.update(productos)
                    .set({
                        stock: sql`${productos.stock} - ${item.cantidad}` 
                    })
                    .where(eq(productos.id_producto, idStringFormat));
            }
        });

        // Refrescamos las vistas
        revalidatePath("/CheckoutMenu")
        revalidatePath("/AdminPage")

        return { success: true }
    } catch (error) {
        console.error("Error al procesar la venta:", error)
        return { error: "Ocurrió un error al registrar la venta. Intente de nuevo." }
    }
}