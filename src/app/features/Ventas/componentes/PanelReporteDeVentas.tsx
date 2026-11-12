"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, Flex, Text, Table, Badge, Button, Dialog, ScrollArea } from "@radix-ui/themes"
import { FileSpreadsheet, Eye, Receipt, Loader2, AlertCircle, Store, LayoutDashboard, Printer, FileText, Download } from "lucide-react"

// 👇 Importamos el cerebro de la operación
import { useReportesVentas } from "../hooks/useReportesVentas"

export function PanelReporteVentas() {
    const router = useRouter()
    const [ventaSeleccionada, setVentaSeleccionada] = useState<any | null>(null)

    // Toda la data, cálculos y descargas vienen del hook
    const { 
        ventas, 
        loading, 
        error, 
        recaudacionTotal, 
        exportarReportePDF, 
        exportarExcel, 
        manejarComprobante,
        obtenerNombreProducto
    } = useReportesVentas()

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
                                                    <Button variant="soft" color="blue" size="1" className="cursor-pointer" onClick={() => manejarComprobante(venta, 'TICKET')}>
                                                        <Printer size={14} className="mr-1" /> Ticket
                                                    </Button>

                                                    <Button variant="soft" color="indigo" size="1" className="cursor-pointer" onClick={() => manejarComprobante(venta, 'A4')}>
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
                                                                        const idProd = item.idProducto || item.id_producto || "N/A"
                                                                        const nombreProd = idProd !== "N/A" ? obtenerNombreProducto(idProd) : `Producto #${idProd}`
                                                                        const cantidad = Number(item.cantidad || item.cantidad_producto || 0)
                                                                        const precio = Number(item.precioUnitario || item.precio || item.precio_unitario || 0)
                                                                        const subtotal = cantidad * precio

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