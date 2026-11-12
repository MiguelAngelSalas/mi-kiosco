import { useState, useEffect } from "react"
import { getVentasAction } from "../actions" 
import { getProductsAction } from "../../Productos/actions" 
import { useComprobantes } from "./useComprobantes"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function useReportesVentas() {
    const [ventas, setVentas] = useState<any[]>([])
    const [productos, setProductos] = useState<any[]>([]) 
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const { imprimirTicket, descargarPDF } = useComprobantes()

    const recaudacionTotal = ventas.reduce((acc, venta) => acc + (Number(venta.montoRecibido || venta.monto) || 0), 0)

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true)
                const [resVentas, resProductos] = await Promise.all([
                    getVentasAction(),
                    getProductsAction()
                ])

                if (resVentas.error) setError(resVentas.error)
                else if (resVentas.success && resVentas.data) setVentas(resVentas.data)

                if (resProductos.success && resProductos.data) setProductos(resProductos.data)
            } catch (err) {
                setError("Error de conexión al obtener los datos.")
            } finally {
                setLoading(false)
            }
        }
        cargarDatos()
    }, [])

    const obtenerNombreProducto = (id: number | string) => {
        const prod = productos.find(p => String(p.id_producto || p.idProducto || p.id) === String(id))
        return prod ? prod.nombre : `Producto #${id}`
    }

    const manejarComprobante = (venta: any, tipo: 'TICKET' | 'A4') => {
        const detalles = venta.detalles || venta.items || venta.detalle_ventas || []
        
        const itemsMapeados = detalles.map((item: any) => {
            const idProd = item.idProducto || item.id_producto
            const nombre = obtenerNombreProducto(idProd)
            const cantidad = Number(item.cantidad_producto || item.cantidad || 0)
            
            let precio = Number(item.precioUnitario || item.precio_unitario || item.precio || 0)
            if (precio === 0) {
                const prodCatalogo = productos.find(p => String(p.id_producto || p.idProducto) === String(idProd))
                if (prodCatalogo) precio = Number(prodCatalogo.precio || 0)
            }

            return { nombre, cantidad, precio, subtotal: cantidad * precio }
        })

        const datosParaHook = {
            items: itemsMapeados,
            total: Number(venta.montoRecibido || venta.monto || venta.total || 0),
            medioPago: (venta.medioPago || "N/A").toUpperCase(),
            montoRecibido: Number(venta.montoRecibido || venta.monto || venta.total || 0)
        }

        if (tipo === 'TICKET') imprimirTicket(datosParaHook)
        else descargarPDF(datosParaHook)
    }

    const exportarReportePDF = () => {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.text("Reporte de Ventas - Mi Kiosco", 14, 22)
        
        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(100)
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString("es-AR")}`, 14, 30)
        doc.text(`Recaudación Total General: $${recaudacionTotal.toLocaleString("es-AR")}`, 14, 36)

        const columnas = ["Ticket", "Fecha", "Medio de Pago", "Artículos", "Monto Total"]
        const filas: any[] = []

        ventas.forEach(venta => {
            const id = venta.id_pago || venta.id
            const fecha = venta.fecha ? new Date(venta.fecha).toLocaleDateString("es-AR") : "N/A"
            const medio = (venta.medioPago || "N/A").toUpperCase()
            const totalTicket = Number(venta.montoRecibido || venta.monto || venta.total || 0)
            const detalles = venta.detalles || venta.items || venta.detalle_ventas || []
            const cantidadTotal = detalles.reduce((acc: number, item: any) => acc + Number(item.cantidad_producto || item.cantidad || 0), 0)

            filas.push([`#${id}`, fecha, medio, cantidadTotal.toString(), `$${totalTicket.toLocaleString("es-AR")}`])
        })

        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 45,
            theme: 'striped',
            headStyles: { fillColor: [51, 88, 156] },
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: { 4: { halign: 'right', fontStyle: 'bold' }, 3: { halign: 'center' } }
        })

        doc.save(`Reporte_Ventas_${new Date().toLocaleDateString("es-AR").replace(/\//g, "-")}.pdf`)
    }

    const exportarExcel = async () => {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet("Reporte de Ventas")

        worksheet.properties.outlineProperties = { summaryBelow: false, summaryRight: false }
        worksheet.columns = [
            { header: "Ticket", key: "id", width: 12 },
            { header: "Fecha", key: "fecha", width: 15 },
            { header: "Medio", key: "medio", width: 15 },
            { header: "Detalle / Productos", key: "producto", width: 45 }, 
            { header: "Cant.", key: "cantidad", width: 10 },
            { header: "Precio Unit.", key: "precio", width: 15 },
            { header: "Monto", key: "total", width: 18 },
        ]

        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF334155" } }
            cell.font = { color: { argb: "FFFFFFFF" }, bold: true, size: 11 }
            cell.alignment = { vertical: "middle", horizontal: "center" }
            cell.border = { bottom: { style: 'thin', color: { argb: 'FF000000' } } }
        })

        ventas.forEach(venta => {
            const id = venta.id_pago || venta.id
            const fecha = venta.fecha ? new Date(venta.fecha).toLocaleDateString("es-AR") : "N/A"
            const medio = (venta.medioPago || "N/A").toUpperCase()
            const totalTicket = Number(venta.montoRecibido || venta.monto || venta.total || 0)
            const detalles = venta.detalles || venta.items || venta.detalle_ventas || []
            
            if (detalles.length === 0) {
                worksheet.addRow({ id: `#${id}`, fecha, medio, producto: "Sin detalles", cantidad: 0, precio: "", total: totalTicket })
            } else if (detalles.length === 1) {
                const item = detalles[0]
                const idProd = item.idProducto || item.id_producto
                const nombre = obtenerNombreProducto(idProd)
                const cantidad = Number(item.cantidad_producto || item.cantidad || 0)
                let precio = Number(item.precioUnitario || item.precio_unitario || item.precio || 0)
                
                if (precio === 0) {
                    const prodCatalogo = productos.find(p => String(p.id_producto || p.idProducto) === String(idProd))
                    if (prodCatalogo) precio = Number(prodCatalogo.precio || 0)
                }

                worksheet.addRow({ id: `#${id}`, fecha, medio, producto: nombre, cantidad, precio, total: totalTicket })
            } else {
                const cantidadTotal = detalles.reduce((acc: number, item: any) => acc + Number(item.cantidad_producto || item.cantidad || 0), 0)
                const filaPadre = worksheet.addRow({
                    id: `#${id}`, fecha, medio,
                    producto: "Varios artículos (Ver detalle con el botón +) ➜", 
                    cantidad: cantidadTotal, precio: "", total: totalTicket
                })
                
                filaPadre.font = { bold: true }
                filaPadre.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } }

                detalles.forEach((item: any) => { 
                    const idProd = item.idProducto || item.id_producto
                    const nombre = obtenerNombreProducto(idProd) 
                    const cantidad = Number(item.cantidad_producto || item.cantidad || 0)
                    let precio = Number(item.precioUnitario || item.precio_unitario || item.precio || 0)
                    
                    if (precio === 0) {
                        const prodCatalogo = productos.find(p => String(p.id_producto || p.idProducto) === String(idProd))
                        if (prodCatalogo) precio = Number(prodCatalogo.precio || 0)
                    }

                    const filaHija = worksheet.addRow({
                        id: "", fecha: "", medio: "    ↳", producto: nombre,
                        cantidad: cantidad, precio: precio, total: cantidad * precio
                    })

                    filaHija.outlineLevel = 1
                    filaHija.hidden = true 
                    filaHija.font = { color: { argb: "FF475569" }, size: 10 }
                })
            }
        })

        worksheet.getColumn("precio").numFmt = '"$"#,##0.00'
        worksheet.getColumn("total").numFmt = '"$"#,##0.00'
        worksheet.getColumn("id").alignment = { horizontal: "center", vertical: "middle" }
        worksheet.getColumn("fecha").alignment = { horizontal: "center", vertical: "middle" }
        worksheet.getColumn("cantidad").alignment = { horizontal: "center", vertical: "middle" }

        const filaTotal = worksheet.addRow({
            id: "", fecha: "", medio: "", producto: "", cantidad: "", 
            precio: "TOTAL GENERAL:", total: recaudacionTotal 
        })
        filaTotal.font = { bold: true, size: 12, color: { argb: "FF15803D" } } 
        filaTotal.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCFCE7" } } 

        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
        saveAs(blob, `Reporte_Ventas_${new Date().toLocaleDateString("es-AR").replace(/\//g, "-")}.xlsx`)
    }

    return {
        ventas,
        productos,
        loading,
        error,
        recaudacionTotal,
        exportarReportePDF,
        exportarExcel,
        manejarComprobante,
        obtenerNombreProducto
    }
}