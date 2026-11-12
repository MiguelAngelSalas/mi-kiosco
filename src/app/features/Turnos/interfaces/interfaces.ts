export interface VentaBackend {
    id: number;
    fecha: string;
    medioPago: string;
    total: number;
    montoRecibido: number;
    vuelto: number;
    idUsuario: number;
    nombreUsuario: string;
    idCliente: number;
    nombreCliente: string;
    items: VentaItemBackend[];
}

export interface VentaItemBackend {
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface PreCierreDatos {
    total_recaudado: number;
    desglose: {
        efectivo: number;
        cuenta_dni: number;
        mercadopago_qr: number;
        tarjeta: number;
        transferencia: number;
    };
    ventas_realizadas: VentaBackend[];
}

export interface CajaTurno {
    id: number;
    idUsuario: number;
    nombreUsuario: string;
    fechaInicio: string;
    fechaCierre: string | null;
    totalEfectivo: number;
    totalTarjeta: number;
    cantidadVentas: number;
}