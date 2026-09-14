import { pgTable, text, integer, real, serial} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
    id: text("id").primaryKey(), // Permite IDs como "0001" o códigos de barras
    name: text("name").notNull(),
    category: text("category").notNull(),
    qty: integer("qty").notNull().default(1), // Cantidad por defecto para el POS
    priceSell: real("price_sell").notNull(),
    stock: integer("stock").notNull(),
    cost: real("cost").notNull(),
});

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    role: text("role").notNull().default("vendedor"),
})