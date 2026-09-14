
'use server'
import { createProduct, deleteProduct, updateProduct } from "@/app/db/CrudProducts"
import { db } from "@/app/db/db.server"
import { products, users } from "@/app/db/schema"
import { max, sql, eq } from "drizzle-orm"
import { revalidatePath, } from "next/cache"
import {redirect} from "next/navigation"

export async function addProductAction(formData: FormData) {
    // Genera ID automático basado en el máximo existente si viene vacío
    let customId = formData.get("id") as string
    
    if (!customId || customId.trim() === "") {
        const result = await db.select({ maxId: max(sql<number>`CAST(${products.id} AS INTEGER)`) }).from(products)
        const maxVal = Number(result[0]?.maxId ?? 0)
        const nextIdNum = (isNaN(maxVal)?0:maxVal) +1
        customId = nextIdNum.toString().padStart(4, '0') // Genera '0001', '0002', etc.
    }

    const newProduct = {
        id: customId,
        name: formData.get("name") as string,
        category: (formData.get("category") as string) || "Golosinas",
        qty: 1,
        priceSell: Number(formData.get("priceSell")),
        stock: Number(formData.get("stock")),
        cost: Number(formData.get("cost")),
    }

    await createProduct(newProduct)
    revalidatePath("/AdminPage")
}

export async function deleteProductAction(id: string) {
    const res = await deleteProduct(id)
    revalidatePath("/admin")
    return res
}

export async function updateProductAction(id: string, formData: FormData) {
    const datosActualizados = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        priceSell: Number(formData.get("priceSell")),
        stock: Number(formData.get("stock")),
        cost: Number(formData.get("cost")),
    }

    const res = await updateProduct(id, datosActualizados)
    revalidatePath("/admin")
    return res
}

export async function registerUserAction(formData: FormData) {
    const username = (formData.get("username") as string)?.trim()
    const password = (formData.get("password") as string)?.trim()
    const role = (formData.get("role") as string) || "cajero"

    if (!username || !password) {
        return { error: "Usuario y contraseña obligatorios" }
    }

    const existing = await db.select().from(users).where(eq(users.username, username))
    if (existing.length > 0) {
        return { error: "El usuario ya existe" }
    }

    await db.insert(users).values({ username, password, role })
    redirect("/login")
}

export async function loginUserAction(username: string, password: string) {
    if (!username || !password) {
        return { error: "Completá usuario y contraseña" }
    }

    const found = await db
        .select()
        .from(users)
        .where(eq(users.username, username.trim()))

    if (found.length === 0) {
        return { error: "El usuario no existe" }
    }

    const user = found[0]
    if (user.password !== password) {
        return { error: "Contraseña incorrecta" }
    }

    return { role: user.role }
}