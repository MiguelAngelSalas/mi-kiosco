export interface Product {
    id_producto: string | number
    nombre: string
    id_categoria: string | number
    precio_venta: number
    costo: number
    stock: number
    codigo_barras?: string 
}

export interface ActionResponse {
    error?: string;
    success?: boolean;
    id_producto?: string | number; // Lo dejamos intacto por si lo estás usando en otro lado
    productoNuevo?: {
        id_producto: string | number;
    };
}

export interface Categoria {
    id_categoria: string | number
    nombre_categoria: string
}