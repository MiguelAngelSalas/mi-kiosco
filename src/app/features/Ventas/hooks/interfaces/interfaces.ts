export interface ItemComprobante {
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
}

export interface DatosVentaExitosa {
    total: number;
    montoRecibido: number;
    medioPago: string;
    items: ItemComprobante[];
}
