import { useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import { DatosVentaExitosa } from "../components/ModalVentaExitosa"; // Ajustá la ruta

export function useComprobantes() {
    const [cargandoDocs, setCargandoDocs] = useState(false);

    // --- 1. FUNCIÓN CENTRAL DE DIBUJO (A4 y TICKET) ---
    const crearDocumentoPDF = (datos: DatosVentaExitosa, tipo: 'PDF' | 'TICKET') => {
        const itemsComprados = datos.items || [];
        const altoTicket = 130 + (itemsComprados.length * 6);
        const doc = tipo === 'TICKET' 
            ? new jsPDF({ orientation: "portrait", unit: "mm", format: [80, altoTicket] }) 
            : new jsPDF();

        const fechaObj = new Date();
        const fechaEmision = fechaObj.toLocaleDateString("es-AR");
        const horaEmision = fechaObj.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' });
        const nroComprobante = "0001-" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

        if (tipo === 'TICKET') {
            // FORMATO TICKET
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("MI KIOSCO", 40, 10, { align: "center" });
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text("TICKET FACTURA 'C'", 40, 33, { align: "center" });
            doc.text(`Nro: ${nroComprobante}`, 40, 38, { align: "center" });
            doc.text(`Fecha: ${fechaEmision}   Hora: ${horaEmision}`, 40, 42, { align: "center" });
            doc.text("--------------------------------------------------", 40, 47, { align: "center" });
            
            let yTicket = 55;
            itemsComprados.forEach(item => {
                const nombreCorto = item.nombre.length > 20 ? item.nombre.substring(0, 18) + ".." : item.nombre;
                doc.text(`${item.cantidad}`, 4, yTicket, { align: "center" });
                doc.text(nombreCorto, 12, yTicket);
                doc.text(`$${item.subtotal.toFixed(2)}`, 78, yTicket, { align: "right" });
                yTicket += 5;
            });
            
            doc.text("--------------------------------------------------", 40, yTicket + 3, { align: "center" });
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("TOTAL: $" + datos.total.toFixed(2), 78, yTicket + 10, { align: "right" });
            doc.setFontSize(8);
            doc.text("¡Gracias por su compra!", 40, yTicket + 25, { align: "center" });

        } else {
            // FORMATO A4 TRADICIONAL (Con todo el diseño AFIP restaurado)
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

            doc.setFont("helvetica", "normal");
            let yA4 = 90;
            
            if (itemsComprados.length === 0) {
                doc.setTextColor(255, 0, 0); // Texto rojo de alerta
                doc.text("⚠️ LOS PRODUCTOS NO ESTÁN LLEGANDO DESDE EL CARRITO", 40, yA4);
                doc.setTextColor(0, 0, 0); // Volver a negro
                yA4 += 7;
            } else {
                itemsComprados.forEach(item => {
                    doc.text(`${item.cantidad}`, 18, yA4);
                    doc.text(item.nombre, 40, yA4);
                    doc.text(`$${item.precio.toFixed(2)}`, 145, yA4);
                    doc.text(`$${item.subtotal.toFixed(2)}`, 178, yA4);
                    yA4 += 7;
                });
            }

            const altoRecuadroItems = Math.max((yA4 - 83) + 2, 15); 
            doc.rect(10, 83, 190, altoRecuadroItems);

            const yTotales = Math.max(yA4 + 10, 105);
            doc.rect(130, yTotales, 70, 30);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Importe Total: $" + datos.total.toFixed(2), 135, yTotales + 10);
            
            if (datos.medioPago === "EFECTIVO") {
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text(`Abona con: $${(datos.montoRecibido || 0).toFixed(2)}`, 135, yTotales + 18);
                doc.text(`Vuelto: $${((datos.montoRecibido || 0) - datos.total).toFixed(2)}`, 135, yTotales + 24);
            }
        }

        return { doc, nroComprobante };
    };

    // --- 2. GESTORES DE ACCIÓN ---
    const procesarA4 = (datos: DatosVentaExitosa, accion: 'descargar' | 'ver' | 'imprimir') => {
        const toastId = toast.loading("Procesando A4...");
        try {
            const { doc, nroComprobante } = crearDocumentoPDF(datos, 'PDF');
            
            if (accion === 'descargar') {
                doc.save(`Factura_C_${nroComprobante}.pdf`);
                toast.success("PDF Descargado", { id: toastId });
            } else if (accion === 'ver') {
                window.open(doc.output('bloburl'), '_blank');
                toast.success("Abriendo documento...", { id: toastId });
            } else if (accion === 'imprimir') {
                doc.autoPrint();
                window.open(doc.output('bloburl'), '_blank');
                toast.success("Enviando a impresora...", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar el A4", { id: toastId });
        }
    };

    const imprimirTicket = (datos: DatosVentaExitosa) => {
        const toastId = toast.loading("Generando Ticket...");
        try {
            const { doc } = crearDocumentoPDF(datos, 'TICKET');
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
            toast.success("Enviando a ticketera...", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Error al generar el ticket", { id: toastId });
        }
    };

    // --- 3. FUNCIÓN PARA EXCEL ---
    const descargarExcel = (datos: DatosVentaExitosa) => {
        const toastId = toast.loading("Generando EXCEL...");
        try {
            const infoVenta = [
                { A: "Comprobante de Venta", B: "" },
                { A: "Fecha:", B: new Date().toLocaleString('es-AR') },
                { A: "Medio de Pago:", B: datos.medioPago },
                { A: "TOTAL FACTURADO:", B: `$ ${datos.total.toFixed(2)}` },
                { A: "", B: "" }
            ];

            // 👇 Acá estaba el error, le agregamos el salvavidas y llamamos al map correctamente
            const itemsComprados = datos.items || [];
            const detalleItems = itemsComprados.map((item) => ({
                "Producto": item.nombre,
                "Cantidad": item.cantidad,
                "Precio Unitario": item.precio,
                "Subtotal": item.subtotal
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(infoVenta, { skipHeader: true });
            
            XLSX.utils.sheet_add_json(ws, detalleItems, { origin: "A7" });
            ws['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

            XLSX.utils.book_append_sheet(wb, ws, "Comprobante");
            XLSX.writeFile(wb, `Venta_${new Date().getTime()}.xlsx`);

            toast.success("EXCEL Descargado", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Error al generar el EXCEL", { id: toastId });
        }
    };

    // --- 4. FUNCIÓN PARA MAIL (Simulada para el MVP) ---
    const enviarPorMail = async (datos: DatosVentaExitosa) => {
        const emailCliente = window.prompt("Ingrese el correo electrónico del cliente:");
        if (!emailCliente) return;

        if (!/^\S+@\S+\.\S+$/.test(emailCliente)) {
            toast.error("El formato del correo es inválido");
            return;
        }

        const toastId = toast.loading("Enviando correo...");
        setCargandoDocs(true);

        try {
            // Acá a futuro llamarás a tu Server Action con Resend
            // await enviarComprobanteMailAction(datos, emailCliente);
            
            // Simulamos delay de red de 1 segundo
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`Comprobante enviado a ${emailCliente}`, { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Error al enviar el correo", { id: toastId });
        } finally {
            setCargandoDocs(false);
        }
    };

    return {
        cargandoDocs,
        descargarPDF: (datos: DatosVentaExitosa) => procesarA4(datos, 'descargar'),
        verDocumento: (datos: DatosVentaExitosa) => procesarA4(datos, 'ver'),
        imprimirPDF: (datos: DatosVentaExitosa) => procesarA4(datos, 'imprimir'),
        imprimirTicket,
        descargarExcel,
        enviarPorMail
    };
}