import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { products } from "./schema";

type ProductInsert = typeof products.$inferInsert;
type ProductUpdate = Partial<ProductInsert>;

export async function getProducts() {
    return await db.select().from(products);
}

export async function createProduct(productData: ProductInsert) {
    if (!productData.id || !productData.name || productData.priceSell === undefined) {
        return { error: "Faltan datos obligatorios (ID, Nombre o Precio)" };
    }

    const [existing] = await db.select().from(products).where(eq(products.id, productData.id)).limit(1);
    if (existing) {
        return { error: "Ya existe un producto con ese ID o código de barras" };
    }

    await db.insert(products).values(productData);
    return { success: "Producto creado exitosamente" };
}

export async function updateProduct(productId: string, newDates: ProductUpdate) {
    if (!productId) {
        return { error: "ID necesario para actualizar el producto" };
    }

    const [existingProduct] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!existingProduct) {
        return { error: "El producto no existe en la base de datos" };
    }

    await db.update(products).set(newDates).where(eq(products.id, productId));
    return { success: "Producto actualizado correctamente" };
}

export async function deleteProduct(productId: string) {
    if (!productId) {
        return { error: "ID necesario para borrar el producto" };
    }

    const [existingProduct] = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (!existingProduct) {
        return { error: "El producto no existe en la base de datos" };
    }

    await db.delete(products).where(eq(products.id, productId));
    return { success: "Producto borrado exitosamente" };
}


