// --- TIPADOS ---
export interface VentaItem {
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    subtotal: number;
}

export interface Venta {
    id: number;
    items: VentaItem[];
    // Si después necesitás usar la fecha o el total de la venta, lo agregás acá
}

export interface ProductoTop {
    id_producto: number;
    nombre: string;
    cantidadVendida: number;
    recaudacionTotal: number;
}

// --- FUNCIÓN ---
export function procesarTopProductos(ventas: Venta[]): ProductoTop[] {
    // Usamos un Map tipado para agrupar los productos por su ID
    const mapaProductos = new Map<number, ProductoTop>();

    ventas.forEach((venta) => {
        // Si la venta no tiene items por algún motivo, la salteamos
        if (!venta.items) return; 

        venta.items.forEach((item) => {
            if (mapaProductos.has(item.idProducto)) {
                // Si el producto ya existe en el mapa, le sumamos la cantidad y la plata
                // El "!" le avisa a TypeScript que estamos seguros de que existe
                const productoGuardado = mapaProductos.get(item.idProducto)!; 
                
                productoGuardado.cantidadVendida += item.cantidad;
                productoGuardado.recaudacionTotal += item.subtotal;
            } else {
                // Si es la primera vez que vemos este producto, lo agregamos
                mapaProductos.set(item.idProducto, {
                    id_producto: item.idProducto,
                    nombre: item.nombreProducto,
                    cantidadVendida: item.cantidad,
                    recaudacionTotal: item.subtotal
                });
            }
        });
    });

    // Convertimos el Map en un Array y lo ordenamos por cantidad vendida (de mayor a menor)
    return Array.from(mapaProductos.values()).sort((a, b) => b.cantidadVendida - a.cantidadVendida);
}