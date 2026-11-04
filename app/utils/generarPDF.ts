import jsPDF from "jspdf";
import { DatosVentaExitosa } from "../components/ModalVentaExitosa"; // Ajustá la ruta

export const generarComprobantePDF = (datos: DatosVentaExitosa, tipo: 'PDF' | 'TICKET') => {
    
    // Calculamos un alto dinámico para el ticket térmico según la cantidad de items
    const altoTicket = 130 + (datos.items.length * 6);
    
    const doc = tipo === 'TICKET' 
        ? new jsPDF({ orientation: "portrait", unit: "mm", format: [80, altoTicket] }) 
        : new jsPDF();

    const fechaObj = new Date();
    const fechaEmision = fechaObj.toLocaleDateString("es-AR");
    const horaEmision = fechaObj.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' });
    const nroComprobante = "0001-" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

    if (tipo === 'TICKET') {
        // ==========================================
        // FORMATO TICKET TÉRMICO (80mm) 
        // ==========================================
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("MI KIOSCO", 40, 10, { align: "center" });
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Razón Social: Mi Kiosco S.A.", 40, 15, { align: "center" });
        doc.text("CUIT: 30-12345678-9", 40, 19, { align: "center" });
        doc.text("IVA Responsable Monotributo", 40, 23, { align: "center" });
        
        doc.text("--------------------------------------------------", 40, 28, { align: "center" });
        
        doc.setFont("helvetica", "bold");
        doc.text("TICKET FACTURA 'C'", 40, 33, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.text(`Nro: ${nroComprobante}`, 40, 38, { align: "center" });
        doc.text(`Fecha: ${fechaEmision}   Hora: ${horaEmision}`, 40, 42, { align: "center" });
        
        doc.text("--------------------------------------------------", 40, 47, { align: "center" });
        
        doc.text("A Consumidor Final", 40, 52, { align: "center" });
        doc.text(`Medio de Pago: ${datos.medioPago}`, 40, 56, { align: "center" });
        
        doc.text("--------------------------------------------------", 40, 61, { align: "center" });
        
        // Cabecera de productos
        doc.setFont("helvetica", "bold");
        doc.text("CANT", 2, 66);
        doc.text("DESCRIPCION", 12, 66);
        doc.text("TOTAL", 78, 66, { align: "right" });
        
        doc.setFont("helvetica", "normal");
        
        // 👇 ITERAMOS EL CARRITO DINÁMICAMENTE
        let yTicket = 72;
        datos.items.forEach(item => {
            // Cortamos el nombre si es muy largo para que no rompa el ticket
            const nombreCorto = item.nombre.length > 20 ? item.nombre.substring(0, 18) + ".." : item.nombre;
            
            doc.text(`${item.cantidad}`, 4, yTicket, { align: "center" });
            doc.text(nombreCorto, 12, yTicket);
            doc.text(`$${item.subtotal.toFixed(2)}`, 78, yTicket, { align: "right" });
            
            yTicket += 5; // Bajamos 5mm para el próximo renglón
        });
        
        doc.text("--------------------------------------------------", 40, yTicket + 3, { align: "center" });
        
        // Totales al final de la lista
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL: $" + datos.total.toFixed(2), 78, yTicket + 10, { align: "right" });
        
        if (datos.medioPago === "EFECTIVO") {
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(`Su Pago: $${datos.montoRecibido.toFixed(2)}`, 78, yTicket + 16, { align: "right" });
            doc.text(`Su Vuelto: $${(datos.montoRecibido - datos.total).toFixed(2)}`, 78, yTicket + 20, { align: "right" });
        }

        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text("¡Gracias por su compra!", 40, yTicket + 30, { align: "center" });

        doc.save("ticket_fiscal_C.pdf");

    } else {
        // ==========================================
        // FORMATO A4 TRADICIONAL 
        // ==========================================
        
        doc.rect(10, 10, 190, 40);
        doc.line(105, 26, 105, 50);
        doc.rect(98, 10, 14, 16);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("C", 105, 21, { align: "center" });
        doc.setFontSize(8);
        doc.text("COD. 011", 105, 25, { align: "center" });

        doc.setFontSize(16);
        doc.text("MI KIOSCO", 52, 22, { align: "center" });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Razón Social: Mi Kiosco S.A.", 15, 30);
        doc.text("Domicilio Comercial: Lomas de Zamora 123", 15, 35);
        doc.text("Condición frente al IVA: Responsable Monotributo", 15, 40);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("FACTURA", 115, 22);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Punto de Venta: 0001  Comp. Nro: ${nroComprobante}`, 115, 30);
        doc.text(`Fecha de Emisión: ${fechaEmision}`, 115, 35);
        doc.text("CUIT: 30-12345678-9", 115, 40);

        doc.rect(10, 55, 190, 15);
        doc.setFont("helvetica", "bold");
        doc.text("CUIT / DNI: ", 15, 61);
        doc.setFont("helvetica", "normal");
        doc.text("99999999 (Consumidor Final)", 40, 61);
        doc.setFont("helvetica", "bold");
        doc.text("Medio de Pago: ", 115, 67);
        doc.setFont("helvetica", "normal");
        doc.text(datos.medioPago, 142, 67);

        // Cabecera Tabla
        doc.rect(10, 75, 190, 8);
        doc.setFont("helvetica", "bold");
        doc.text("Cantidad", 15, 80);
        doc.text("Descripción", 40, 80);
        doc.text("Precio Unitario", 140, 80);
        doc.text("Subtotal", 175, 80);

        // 👇 ITERAMOS EL CARRITO DINÁMICAMENTE (A4)
        doc.setFont("helvetica", "normal");
        let yA4 = 90;
        
        datos.items.forEach(item => {
            doc.text(`${item.cantidad}`, 18, yA4);
            doc.text(item.nombre, 40, yA4);
            doc.text(`$${item.precio.toFixed(2)}`, 145, yA4);
            doc.text(`$${item.subtotal.toFixed(2)}`, 178, yA4);
            yA4 += 7; // Bajamos 7mm para el próximo renglón
        });

        // Dibujamos el rectángulo de los productos envolviendo todo lo que imprimimos
        const altoRecuadroItems = (yA4 - 83) + 2; 
        doc.rect(10, 83, 190, altoRecuadroItems);

        // Totales dinámicos abajo de la tabla
        const yTotales = yA4 + 10;
        doc.rect(130, yTotales, 70, 30);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Importe Total: $" + datos.total.toFixed(2), 135, yTotales + 10);
        
        if (datos.medioPago === "EFECTIVO") {
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Abona con: $${datos.montoRecibido.toFixed(2)}`, 135, yTotales + 18);
            doc.text(`Vuelto: $${(datos.montoRecibido - datos.total).toFixed(2)}`, 135, yTotales + 24);
        }

        doc.save(`Factura_C_${nroComprobante}.pdf`);
    }
};