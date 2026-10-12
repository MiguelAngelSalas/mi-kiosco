"use client"
import { Card, Text, Table, Badge } from "@radix-ui/themes"
import { AlertTriangle, PackageOpen } from "lucide-react"
import { Product } from "@/app/hooks/useAddProduct" 
import { useLowStock } from "@/app/hooks/useLowStock" 

interface PanelStockBajoProps {
    productos: Product[]
    umbral?: number 
}

export default function PanelStockBajo({ productos, umbral = 5 }: PanelStockBajoProps) {
    // Toda la lógica y el disparo del toast viven acá adentro ahora:
    const { stockBajo, hayStockCritico } = useLowStock(productos, umbral)

    // --- RENDERIZADO VISUAL ---
    if (!hayStockCritico) {
        return (
            <Card className="p-4 border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50 flex items-center gap-3">
                <PackageOpen className="text-green-600 dark:text-green-400" />
                <Text weight="medium" className="text-green-700 dark:text-green-300">
                    ¡Todo excelente! No hay productos con stock bajo.
                </Text>
            </Card>
        )
    }

    return (
        <Card className="p-5 border border-red-200 bg-white dark:bg-gray-900 dark:border-red-900/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
                <AlertTriangle size={24} className="animate-pulse" />
                <Text size="4" weight="bold">Alerta de Stock Crítico</Text>
                <Badge color="red" radius="full" size="2">
                    {stockBajo.length}
                </Badge>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <Table.Root variant="surface" size="2">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell align="right">Stock Actual</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    
                    <Table.Body>
                        {stockBajo.map(prod => (
                            <Table.Row key={prod.id_producto}>
                                <Table.RowHeaderCell className="font-medium">
                                    {prod.nombre}
                                </Table.RowHeaderCell>
                                <Table.Cell align="right">
                                    <Badge color={prod.stock === 0 ? "crimson" : "orange"} variant="soft" size="2">
                                        {prod.stock} {prod.stock === 0 ? "(Agotado)" : "u."}
                                    </Badge>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </div>
        </Card>
    )
}