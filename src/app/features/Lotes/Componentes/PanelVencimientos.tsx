"use client"
import { Card, Text, Table, Badge, Button } from "@radix-ui/themes"
import { CalendarClock, ShieldCheck, FileSpreadsheet } from "lucide-react"
import { useLowExpiration } from "../hooks/useLotesManager" 
import * as XLSX from "xlsx"

interface PanelVencimientosProps {
    diasMargen?: number 
    refreshTrigger?: number 
}

export default function PanelVencimientos({ diasMargen = 30, refreshTrigger = 0 }: PanelVencimientosProps) {
    const { lotesCriticos, loading, hayAlertaVencimiento } = useLowExpiration(diasMargen, refreshTrigger)

    const formatearVencimiento = (fechaStr: string) => {
        if (!fechaStr) return { texto: "Sin fecha", color: "gray" as const, dias: 0 }
        
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        const fechaVenc = new Date(fechaStr)
        fechaVenc.setHours(0, 0, 0, 0)

        const diferenciaDias = Math.ceil((fechaVenc.getTime() - hoy.getTime()) / (1000 * 3600 * 24))

        if (diferenciaDias < 0) return { texto: "Vencido", color: "crimson" as const, dias: diferenciaDias }
        if (diferenciaDias === 0) return { texto: "Vence hoy", color: "crimson" as const, dias: diferenciaDias }
        if (diferenciaDias === 1) return { texto: "Vence mañana", color: "orange" as const, dias: diferenciaDias }
        return { texto: `Vence en ${diferenciaDias} días`, color: "orange" as const, dias: diferenciaDias }
    }

    // 👇 Función para generar y descargar el Excel
    const handleDescargarExcel = () => {
        if (!lotesCriticos || lotesCriticos.length === 0) return

        // Mapeamos los datos para que el Excel tenga nombres de columnas claros en español
        const datosParaExcel = lotesCriticos.map(lote => {
            const info = formatearVencimiento(lote.fechaVencimiento)
            const fechaFormateada = lote.fechaVencimiento ? new Date(lote.fechaVencimiento).toLocaleDateString("es-AR") : "Sin fecha"
            
            return {
                "ID Lote": lote.id,
                "Producto": lote.nombreProducto,
                "Cantidad Actual (un.)": lote.cantidadActual,
                "Fecha de Vencimiento": fechaFormateada,
                "Estado": info.texto
            }
        })

        // Creamos la hoja de trabajo y el libro
        const worksheet = XLSX.utils.json_to_sheet(datosParaExcel)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Vencimientos Próximos")

        // Ajustamos un ancho estimado para las columnas para que quede prolijo
        worksheet["!cols"] = [
            { wch: 10 }, // ID Lote
            { wch: 35 }, // Producto
            { wch: 20 }, // Cantidad
            { wch: 22 }, // Vencimiento
            { wch: 20 }  // Estado
        ]

        // Generamos el archivo y disparamos la descarga en el navegador
        XLSX.writeFile(workbook, `Reporte_Vencimientos_${diasMargen}_dias.xlsx`)
    }

    if (loading) {
        return (
            <Card className="p-4 border border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-800 flex items-center gap-3">
                <CalendarClock className="text-gray-400 animate-spin" />
                <Text weight="medium" className="text-gray-500">
                    Verificando vencimientos en el sistema...
                </Text>
            </Card>
        )
    }

    if (!hayAlertaVencimiento) {
        return (
            <Card className="p-4 border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-600 dark:text-green-400" />
                    <Text weight="medium" className="text-green-700 dark:text-green-300">
                        ¡Excelente! No hay lotes próximos a vencer en los próximos {diasMargen} días.
                    </Text>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-5 border border-amber-200 bg-white dark:bg-gray-900 dark:border-amber-900/50 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                    <CalendarClock size={24} className="animate-pulse" />
                    <Text size="4" weight="bold">Alerta de Vencimientos Próximos</Text>
                    <Badge color="amber" radius="full" size="2">
                        {lotesCriticos.length}
                    </Badge>
                </div>

                {/* 👇 Botón de descarga de Excel */}
                <Button 
                    size="2" 
                    variant="soft" 
                    color="green" 
                    className="cursor-pointer font-bold shadow-sm"
                    onClick={handleDescargarExcel}
                >
                    <FileSpreadsheet size={16} className="mr-1.5" /> Descargar Excel
                </Button>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <Table.Root variant="surface" size="2">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell align="center">Cantidad</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell align="right">Estado / Fecha</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    
                    <Table.Body>
                        {lotesCriticos.map(lote => {
                            const info = formatearVencimiento(lote.fechaVencimiento)

                            return (
                                <Table.Row key={lote.id}>
                                    <Table.RowHeaderCell className="font-medium">
                                        {lote.nombreProducto}
                                    </Table.RowHeaderCell>
                                    <Table.Cell align="center">
                                        <span className="font-bold">{lote.cantidadActual} un.</span>
                                    </Table.Cell>
                                    <Table.Cell align="right">
                                        <Badge color={info.color} variant="soft" size="2">
                                            {info.texto} ({new Date(lote.fechaVencimiento).toLocaleDateString("es-AR")})
                                        </Badge>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>
            </div>
        </Card>
    )
}