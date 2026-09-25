'use server'
import { createProduct, deleteProduct, updateProduct } from "@/app/db/CrudProducts"
import { db } from "@/app/db/db.server"
import { productos, users } from "@/app/db/schema"
import { max, sql, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { categoria } from "@/app/db/schema" 

export async function addProductAction(formData: FormData) {
    let customId = formData.get("id") as string
    
    if (!customId || customId.trim() === "") {
        const result = await db.select({ maxId: max(sql<number>`CAST(${productos.id_producto} AS INTEGER)`) }).from(productos)
        const maxVal = Number(result[0]?.maxId ?? 0)
        const nextIdNum = (isNaN(maxVal)?0:maxVal) + 1
        customId = nextIdNum.toString().padStart(4, '0')
    }

    const newProduct = {
        id_producto: customId,
        nombre: formData.get("name") as string,
        id_categoria: (formData.get("category") as string) || "Golosinas",
        precio_venta: Number(formData.get("priceSell")),
        stock: Number(formData.get("stock")),
        costo: Number(formData.get("cost")),
    }

    try {
        await createProduct(newProduct)
        revalidatePath("/AdminPage")
        
        // Devolvemos el ID calculado al frontend
        return { success: true, id_producto: customId }
    } catch (error) {
        return { error: "Ocurrió un error al guardar el producto" }
    }
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
    const nombre = (formData.get("nombre") as string)?.trim()
    const apellido = (formData.get("apellido") as string)?.trim()
    const email = (formData.get("email") as string)?.trim()
    const telefono = (formData.get("telefono") as string)?.trim()
    const password = (formData.get("password") as string)?.trim()
    const rol = (formData.get("rol") as string) || "cajero"

    // Validamos los campos obligatorios que definiste en la base de datos
    if (!nombre || !apellido || !email || !password) {
        return { error: "Nombre, apellido, email y contraseña son obligatorios" }
    }

    // Verificamos si ya existe un usuario con el mismo email
    const existing = await db.select().from(users).where(eq(users.email, email))
    if (existing.length > 0) {
        return { error: "Ya existe un usuario registrado con ese email" }
    }

    // Insertamos respetando todas las columnas de tu tabla
    await db.insert(users).values({ 
        nombre, 
        apellido, 
        email, 
        telefono: telefono || null, // Si está vacío, guarda null
        password, 
        rol,
        activo: true 
    })
    
    redirect("/login")
}

export async function loginUserAction(email: string, password: string) {
    if (!email || !password) {
        return { error: "Completá email y contraseña" }
    }

    const found = await db
        .select()
        .from(users)
        .where(eq(users.email, email.trim()))

    if (found.length === 0) {
        return { error: "El usuario no existe" }
    }

    const user = found[0]
    if (user.password !== password) {
        return { error: "Contraseña incorrecta" }
    }

    return { role: user.rol }
}

export async function addCategoryAction(formData: FormData) {
    try {
        // 1. Extraemos el valor del FormData con el mismo nombre que le pusimos en el front
        const nombreCategoria = formData.get("nombre_categoria") as string

        if (!nombreCategoria || nombreCategoria.trim() === "") {
            return { error: "El nombre de la categoría no puede estar vacío" }
        }

        // 2. Insertamos en Neon usando Drizzle
        // Usamos .returning() para que Postgres nos devuelva el ID que acaba de generar
        const [nuevaCategoria] = await db.insert(categoria)
            .values({
                nombre_categoria: nombreCategoria.trim()
            })
            .returning({
                idCategoria: categoria.id_categoria 
            });

        // 3. Le decimos a Next.js que limpie la caché de esta ruta para que se actualicen las tablas
        revalidatePath("/admin") // Cambiá "/admin" por la ruta real donde estés usando esto

        // 4. Devolvemos el ID al frontend
        return {
            success: true,
            idCategoria: nuevaCategoria.idCategoria
        }

    } catch (error: any) {
        console.error("Error al crear la categoría:", error)
        return { error: error.message || "Ocurrió un error al guardar en la base de datos" }
    }
}

