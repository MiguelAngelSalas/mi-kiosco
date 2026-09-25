import { pgTable, text, integer, real, serial, timestamp, boolean, numeric, varchar } from "drizzle-orm/pg-core";

// 1. Usuarios (Administradores y Cajeros)
export const users = pgTable("usuarios", {
    id: serial("id_usuario").primaryKey(), // Mapea al SERIAL id_usuario
    nombre: text("nombre").notNull(),
    apellido: text("apellido").notNull(),
    email: text("email").notNull().unique(),
    telefono: text("telefono"),
    password: text("password").notNull(),
    rol: text("rol").notNull(), // Mapea a rol ('administrador', 'cajero')
    activo: boolean("activo").notNull().default(true),
});

// 2. Productos
export const productos = pgTable("productos", {
    id_producto: text("id_producto").primaryKey(), // Código de barras o ID personalizado
    nombre: text("nombre").notNull(),
    id_categoria: text("id_categoria").notNull(),
    precio_venta: real("precio_venta").notNull(),
    stock: integer("stock").notNull(),
    costo: real("costo").notNull(),
});

// 4. Pagos / Ventas (Vinculado a una caja)
export const pagos = pgTable("pagos", {
    id_pagos: serial("id_pago").primaryKey(),
    id_caja: integer("id_caja").references(() => cajasDiarias.id).notNull(),
    monto: real("monto").notNull(),
    hora: timestamp("hora").defaultNow().notNull(),
    tipo_medio: text("tipo_medio").notNull(), // 'efectivo', 'transferencia', 'cuentaDni', 'qr/mercadopago', 'tarjeta'
});


export const categoria = pgTable("categoria", { 
    id_categoria: serial("id_categoria").primaryKey(), 
    nombre_categoria: text("nombre_categoria").notNull()
});



export const detalles = pgTable("detalle_de_ventas", {
    id_detalle: serial("id_detalle").primaryKey(),
    
    // Si tenés la foreign key creada en tu base de datos, lo ideal es declararla acá también:
    id_pago: integer("id_pago").references(() => pagos.id_pagos),
    
    // OJO ACÁ: En el SQL que me pasaste dice INTEGER. Si tus productos usan IDs como "0004", 
    // la base de datos lo va a guardar como el número 4. Si tu tabla de productos usa TEXT para los IDs,
    // cambiá este 'integer' por 'text("id_producto")' para que coincida.
    id_producto: text("id_producto").notNull(),
    
    cantidad_producto: integer("cantidad_producto").notNull(),
    
    // Numeric con precisión (10 dígitos en total, 2 decimales)
    precio_unitario: numeric("precio_unitario", { precision: 10, scale: 2 }).notNull(),
});

export const cajasDiarias = pgTable("cajas_diarias", {
    id_caja: serial("id_caja").primaryKey(), // Antes decía "id"
    id_usuario: integer("id_usuario").notNull(), // Antes decía "user_id"
    fecha_apertura: timestamp("fecha_apertura").defaultNow().notNull(),
    fecha_cierre: timestamp("fecha_cierre"),
    // Cambiamos real por numeric para que coincida con NUMERIC(10,2)
    monto_inicial: numeric("monto_inicial", { precision: 10, scale: 2 }).notNull(),
    estado: varchar("estado", { length: 20 }).default("abierta").notNull(), 
});