import { eq, sql } from "drizzle-orm";
import { db } from "./db.server";
import { pagos, detalleDeVentas, productos } from "./schema";

// Tipo para los productos que vienen en el carrito de compras del front
type ItemVenta = {
    idProducto: string;
    cantidad: number;
    precioUnitario: number;
};

type DatosVenta = {
    idCaja: number;
    tipoMedio: string; // 'efectivo', 'transferencia', 'cuentaDni', etc.
    items: ItemVenta[];
};

export async function registrarVenta(ventaData: DatosVenta) {
    if (!ventaData.items || ventaData.items.length === 0) {
        return { error: "El carrito está vacío" };
    }

    try {
        // Usamos una transacción de Drizzle para asegurar que si algo falla, no se rompa la base de datos a medias
        const resultado = await db.transaction(async (tx) => {
            
            // 1. Calcular el monto total sumando (cantidad * precio) de cada item
            const montoTotal = ventaData.items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);

            // 2. Insertar el pago principal y obtener su ID generado
            const [nuevoPago] = await tx.insert(pagos).values({
                idCaja: ventaData.idCaja,
                monto: montoTotal,
                tipoMedio: ventaData.tipoMedio,
            }).returning({ id: pagos.id });

            // 3. Recorrer cada producto del carrito para insertar el detalle y descontar stock
            for (const item of ventaData.items) {
                // Verificar stock actual del producto antes de descontar
                const [productoActual] = await tx.select().from(productos).where(eq(productos.id_producto, item.idProducto)).limit(1);
                
                if (!productoActual) {
                    throw new Error(`El producto con ID ${item.idProducto} no existe.`);
                }

                if (productoActual.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto: ${productoActual.nombre}. Stock actual: ${productoActual.stock}`);
                }

                // Insertar en detalle de ventas
                await tx.insert(detalleDeVentas).values({
                    idPago: nuevoPago.id,
                    idProducto: item.idProducto,
                    cantidadProducto: item.cantidad,
                    precioUnitario: item.precioUnitario,
                });

                // Descontar stock del inventario
                await tx.update(productos)
                    .set({ stock: productoActual.stock - item.cantidad })
                    .where(eq(productos.id_producto, item.idProducto));
            }

            return { success: "Venta registrada con éxito y stock actualizado", idPago: nuevoPago.id };
        });

        return resultado;

    } catch (error: any) {
        return { error: error.message || "Error al procesar la venta" };
    }
}