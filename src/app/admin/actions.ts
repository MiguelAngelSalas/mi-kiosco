

export interface VentaResumen {
    id: number;
    hora: string;
    total: number;
    metodo: string;
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
    ventas_realizadas: VentaResumen[];
}

























