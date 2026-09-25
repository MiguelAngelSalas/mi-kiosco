import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { categoria, productos } from "./schema";

type ProductInsert = typeof productos.$inferInsert;
type ProductUpdate = Partial<ProductInsert>;

export async function getProducts() {
    return await db.select().from(productos);
}

export async function createProduct(productData: ProductInsert) {
    if (!productData.id_producto || !productData.nombre || productData.precio_venta === undefined) {
        return { error: "Faltan datos obligatorios (ID, Nombre o Precio de Venta)" };
    }

    const [existing] = await db.select().from(productos).where(eq(productos.id_producto, productData.id_producto)).limit(1);
    if (existing) {
        return { error: "Ya existe un producto con ese ID o código de barras" };
    }

    await db.insert(productos).values(productData);
    return { success: "Producto creado exitosamente" };
}

export async function updateProduct(productId: string, newDates: ProductUpdate) {
    if (!productId) {
        return { error: "ID necesario para actualizar el producto" };
    }

    const [existingProduct] = await db.select().from(productos).where(eq(productos.id_producto, productId)).limit(1);
    if (!existingProduct) {
        return { error: "El producto no existe en la base de datos" };
    }

    await db.update(productos).set(newDates).where(eq(productos.id_producto, productId));
    return { success: "Producto actualizado correctamente" };
}

export async function deleteProduct(productId: string) {
    if (!productId) {
        return { error: "ID necesario para borrar el producto" };
    }

    const [existingProduct] = await db.select().from(productos).where(eq(productos.id_producto, productId)).limit(1);
    if (!existingProduct) {
        return { error: "El producto no existe en la base de datos" };
    }

    await db.delete(productos).where(eq(productos.id_producto, productId));
    return { success: "Producto borrado exitosamente" };
}

export async function getCategorias() {
    try {
        const listaCategorias = await db.select().from(categoria)
        
        // Mapeamos para garantizar que devuelva la estructura exacta que pide tu interfaz
        return listaCategorias.map(cat => ({
            id_categoria: cat.id_categoria, // Asegurate de que los nombres coincidan con tu schema.ts
            nombre_categoria: cat.nombre_categoria
        }))
    } catch (error) {
        console.error("Error al obtener categorías:", error)
        return [] // Devolvemos un array vacío como fallback si falla la BD
    }
}