"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, Flex, Text, Table, Badge, Button, Dialog, ScrollArea } from "@radix-ui/themes"
import { FileSpreadsheet, Eye, Receipt, Loader2, AlertCircle, Store, LayoutDashboard, Printer, FileText, Download } from "lucide-react"
import { getVentasAction, getProductsAction } from "@/app/admin/actions" 
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Tu hook
import { useComprobantes } from "@/app/hooks/useComprobantes" 

export default function PanelReporteVentas() {
    const router = useRouter()
    const [ventas, setVentas] = useState<any[]>([])
    const [productos, setProductos] = useState<any[]>([]) 
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [ventaSeleccionada, setVentaSeleccionada] = useState<any | null>(null)

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

            return {
                nombre,
                cantidad,
                precio,
                subtotal: cantidad * precio
            }
        })

        const datosParaHook = {
            items: itemsMapeados,
            total: Number(venta.montoRecibido || venta.monto || venta.total || 0),
            medioPago: (venta.medioPago || "N/A").toUpperCase(),
            montoRecibido: Number(venta.montoRecibido || venta.monto || venta.total || 0)
        }

        if (tipo === 'TICKET') {
            imprimirTicket(datosParaHook)
        } else {
            descargarPDF(datosParaHook)
        }
    }

    // 👇 NUEVA FUNCIÓN: Exportar el reporte general a PDF
    const exportarReportePDF = () => {
        const doc = new jsPDF()

        // Encabezado del documento
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.text("Reporte de Ventas - Mi Kiosco", 14, 22)
        
        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(100)
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString("es-AR")}`, 14, 30)
        doc.text(`Recaudación Total General: $${recaudacionTotal.toLocaleString("es-AR")}`, 14, 36)

        // Preparamos las columnas y filas
        const columnas = ["Ticket", "Fecha", "Medio de Pago", "Artículos", "Monto Total"]
        const filas: any[] = []

        ventas.forEach(venta => {
            const id = venta.id_pago || venta.id
            const fecha = venta.fecha ? new Date(venta.fecha).toLocaleDateString("es-AR") : "N/A"
            const medio = (venta.medioPago || "N/A").toUpperCase()
            const totalTicket = Number(venta.montoRecibido || venta.monto || venta.total || 0)
            const detalles = venta.detalles || venta.items || venta.detalle_ventas || []
            const cantidadTotal = detalles.reduce((acc: number, item: any) => acc + Number(item.cantidad_producto || item.cantidad || 0), 0)

            filas.push([
                `#${id}`,
                fecha,
                medio,
                cantidadTotal.toString(),
                `$${totalTicket.toLocaleString("es-AR")}`
            ])
        })

        // Dibujamos la tabla
        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 45,
            theme: 'striped',
            headStyles: { fillColor: [51, 88, 156] }, // El color azul principal de tu tema
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                4: { halign: 'right', fontStyle: 'bold' }, // Alinea los precios a la derecha
                3: { halign: 'center' }
            }
        })

        // Guardamos el archivo
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

                    const subtotal = cantidad * precio 
                    
                    const filaHija = worksheet.addRow({
                        id: "", fecha: "", medio: "    ↳", producto: nombre,
                        cantidad: cantidad, precio: precio, total: subtotal
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

        worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
        worksheet.autoFilter = 'A1:G1'

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

    if (loading) {
        return (
            <Card className="p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <Loader2 className="animate-spin text-[#33589c]" size={40} />
                <Text color="gray">Cargando registros del sistema...</Text>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <AlertCircle className="text-red-500" size={40} />
                <Text color="red">{error}</Text>
            </Card>
        )
    }

    return (
        <Card size="4" className="shadow-lg bg-white dark:bg-gray-900 border-none">
            <Flex direction="column" gap="4">

                <Flex justify="end" gap="3" className="mb-2">
                    <Button variant="soft" color="gray" size="2" className="cursor-pointer border border-gray-300 dark:border-gray-700" onClick={() => router.push("/AdminPage")}>
                        <LayoutDashboard size={16} className="mr-1" /> Panel Admin
                    </Button>
                    <Button variant="solid" size="2" className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]" onClick={() => router.push("/CheckoutMenu")}>
                        <Store size={16} className="mr-1" /> Ir a la Caja
                    </Button>
                </Flex>
                
                <Flex justify="between" align="center" className="border-b pb-4 border-gray-200 dark:border-gray-700 flex-wrap gap-4">
                    <Flex align="center" gap="3">
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-green-600 dark:text-green-400">
                            <Receipt size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                            <Text size="6" weight="bold" className="block">Reporte de Ventas</Text>
                            <Text size="3" color="gray">Historial detallado de transacciones</Text>
                        </div>
                    </Flex>

                    <Flex align="center" gap="4">
                        <Badge color="green" size="3" variant="soft" className="px-4 py-2 text-lg">
                            Total: ${recaudacionTotal.toLocaleString("es-AR")}
                        </Badge>
                        
                        {/* 👇 BOTÓN NUEVO PARA EXPORTAR PDF */}
                        <Button color="ruby" variant="surface" className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 border-red-200" onClick={exportarReportePDF}>
                            <FileText size={18} className="mr-2" /> PDF
                        </Button>

                        <Button color="green" variant="surface" className="cursor-pointer hover:bg-green-100 dark:hover:bg-green-900" onClick={exportarExcel}>
                            <FileSpreadsheet size={18} className="mr-2 text-green-700" /> Excel
                        </Button>
                    </Flex>
                </Flex>

                <ScrollArea type="auto" scrollbars="horizontal">
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row className="bg-gray-50 dark:bg-gray-800">
                                <Table.ColumnHeaderCell>ID Venta</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Medio de Pago</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="center">Artículos</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="end">Monto Total</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="end">Acciones</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {ventas.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={5} className="text-center py-8 text-gray-500">
                                        No hay ventas registradas.
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                ventas.map((venta) => {
                                    const id = venta.id_pago || venta.id
                                    const detalles = venta.detalles || venta.items || venta.detalle_ventas || []
                                    const totalArticulos = detalles.reduce((acc: number, item: any) => acc + (item.cantidad_producto || item.cantidad || 1), 0)

                                    return (
                                        <Table.Row key={id} className="align-middle hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <Table.Cell className="font-medium">#{id}</Table.Cell>
                                            <Table.Cell>
                                                <Badge color={venta.medioPago === "efectivo" ? "green" : "blue"} variant="soft">
                                                    {venta.medioPago?.toUpperCase() || "N/A"}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell justify="center">
                                                <Text color="gray">{totalArticulos} un.</Text>
                                            </Table.Cell>
                                            <Table.Cell justify="end" className="font-bold">
                                                ${(venta.montoRecibido || venta.monto || 0).toLocaleString("es-AR")}
                                            </Table.Cell>
                                            <Table.Cell justify="end">
                                                <Flex gap="2" justify="end" align="center">
                                                    <Button 
                                                        variant="soft" 
                                                        color="blue" 
                                                        size="1" 
                                                        className="cursor-pointer" 
                                                        onClick={() => manejarComprobante(venta, 'TICKET')}
                                                    >
                                                        <Printer size={14} className="mr-1" /> Ticket
                                                    </Button>

                                                    <Button 
                                                        variant="soft" 
                                                        color="indigo" 
                                                        size="1" 
                                                        className="cursor-pointer" 
                                                        onClick={() => manejarComprobante(venta, 'A4')}
                                                    >
                                                        <Download size={14} className="mr-1" /> A4
                                                    </Button>

                                                    <Dialog.Root>
                                                        <Dialog.Trigger>
                                                            <Button variant="soft" color="gray" size="1" className="cursor-pointer" onClick={() => setVentaSeleccionada(venta)}>
                                                                <Eye size={14} className="mr-1" /> Ver
                                                            </Button>
                                                        </Dialog.Trigger>
                                                        
                                                        <Dialog.Content maxWidth="500px">
                                                            <Dialog.Title>Detalle del Ticket #{id}</Dialog.Title>
                                                            <Dialog.Description size="2" mb="4">
                                                                Medio de pago: {venta.medioPago} | Monto total: ${(venta.montoRecibido || venta.monto || 0).toLocaleString("es-AR")}
                                                            </Dialog.Description>

                                                            <Table.Root variant="surface">
                                                                <Table.Header>
                                                                    <Table.Row>
                                                                        <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                                                        <Table.ColumnHeaderCell justify="center">Cant.</Table.ColumnHeaderCell>
                                                                        <Table.ColumnHeaderCell justify="end">Subtotal</Table.ColumnHeaderCell>
                                                                    </Table.Row>
                                                                </Table.Header>
                                                                <Table.Body>
                                                                    {detalles.map((item: any, idx: number) => {
                                                                        const idProd = item.idProducto || item.id_producto || "N/A";
                                                                        const nombreProd = idProd !== "N/A" ? obtenerNombreProducto(idProd) : `Producto #${idProd}`;
                                                                        const cantidad = Number(item.cantidad || item.cantidad_producto || 0);
                                                                        const precio = Number(item.precioUnitario || item.precio || item.precio_unitario || 0);
                                                                        const subtotal = cantidad * precio;

                                                                        return (
                                                                            <Table.Row key={idx}>
                                                                                <Table.Cell>{nombreProd}</Table.Cell>
                                                                                <Table.Cell justify="center">{cantidad}</Table.Cell>
                                                                                <Table.Cell justify="end">
                                                                                    ${subtotal.toLocaleString("es-AR")}
                                                                                </Table.Cell>
                                                                            </Table.Row>
                                                                        )
                                                                    })}
                                                                </Table.Body>
                                                            </Table.Root>

                                                            <Flex gap="3" mt="4" justify="end">
                                                                <Dialog.Close>
                                                                    <Button variant="soft" color="gray" className="cursor-pointer">Cerrar</Button>
                                                                </Dialog.Close>
                                                            </Flex>
                                                        </Dialog.Content>
                                                    </Dialog.Root>
                                                </Flex>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            )}
                        </Table.Body>
                    </Table.Root>
                </ScrollArea>
            </Flex>
        </Card>
    )
}