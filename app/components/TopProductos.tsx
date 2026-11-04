"use client"
import { useState } from "react" 
import { useRouter } from "next/navigation" // 👈 Importamos el router
import { Table, Card, Text, Badge, Flex, Select, Button } from "@radix-ui/themes" 
import { Trophy, AlertCircle, Loader2, Store, LayoutDashboard } from "lucide-react" // 👈 Sumamos iconos
import { useTopProductos } from "../hooks/useTopProductos"

export default function TopProductos() {
    const { productosTop, loading, error } = useTopProductos()
    const [criterioOrden, setCriterioOrden] = useState<"cantidad" | "recaudacion">("cantidad")
    const router = useRouter() // 👈 Inicializamos el router

    // --- RENDER DE ESTADOS ---
    if (loading) {
        return (
            <Card className="p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <Loader2 className="animate-spin text-[#33589c]" size={40} />
                <Text color="gray">Calculando estadísticas de ventas...</Text>
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

    if (productosTop.length === 0) {
        return (
            <Card className="p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <Text color="gray">Aún no hay ventas registradas para calcular el ranking.</Text>
            </Card>
        )
    }

    const productosOrdenados = [...productosTop].sort((a, b) => {
        if (criterioOrden === "cantidad") {
            return b.cantidadVendida - a.cantidadVendida;
        } else {
            return b.recaudacionTotal - a.recaudacionTotal;
        }
    });

    return (
        <Card size="4" className="shadow-lg bg-white dark:bg-gray-900 border-none">
            <Flex direction="column" gap="4">
                
                {/* 👇 Nueva Botonera de Navegación */}
                <Flex justify="end" gap="3" className="mb-2">
                    <Button 
                        variant="soft" 
                        color="gray" 
                        size="2"
                        className="cursor-pointer border border-gray-300 dark:border-gray-700"
                        onClick={() => router.push("/AdminPage")}
                    >
                        <LayoutDashboard size={16} className="mr-1" />
                        Panel Admin
                    </Button>
                    <Button 
                        variant="solid" 
                        size="2"
                        className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]"
                        onClick={() => router.push("/CheckoutMenu")}
                    >
                        <Store size={16} className="mr-1" />
                        Ir a la Caja
                    </Button>
                </Flex>
                
                {/* Cabecera del Ranking */}
                <Flex justify="between" align="center" className="border-b pb-4 border-gray-200 dark:border-gray-700 flex-wrap gap-4">
                    <Flex align="center" gap="2">
                        <Trophy size={28} className="text-yellow-500" />
                        <Text size="6" weight="bold">Ranking de Productos Más Vendidos</Text>
                    </Flex>

                    <Select.Root value={criterioOrden} onValueChange={(v: "cantidad" | "recaudacion") => setCriterioOrden(v)}>
                        <Select.Trigger radius="large" className="w-[200px]" />
                        <Select.Content>
                            <Select.Item value="cantidad">Ordenar por Unidades</Select.Item>
                            <Select.Item value="recaudacion">Ordenar por Recaudación</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Flex>

                <div className="overflow-x-auto">
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row className="bg-gray-50 dark:bg-gray-800">
                                <Table.ColumnHeaderCell>Posición</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Producto</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="center">Unidades Vendidas</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="end">Recaudación</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {productosOrdenados.map((producto, index) => {
                                let medalla = null;
                                if (index === 0) medalla = <span className="text-2xl" title="1er Puesto">🥇</span>;
                                if (index === 1) medalla = <span className="text-2xl" title="2do Puesto">🥈</span>;
                                if (index === 2) medalla = <span className="text-2xl" title="3er Puesto">🥉</span>;

                                return (
                                    <Table.Row key={producto.id_producto} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        
                                        <Table.Cell className="font-medium align-middle">
                                            <Flex align="center" gap="2">
                                                {medalla ? medalla : <span className="ml-2 text-gray-400 font-bold">#{index + 1}</span>}
                                            </Flex>
                                        </Table.Cell>

                                        <Table.Cell className="align-middle">
                                            <Text weight={index < 3 ? "bold" : "regular"}>
                                                {producto.nombre}
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell justify="center" className="align-middle">
                                            <Badge color={index === 0 ? "yellow" : index < 3 ? "blue" : "gray"} size="2">
                                                {producto.cantidadVendida} un.
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell justify="end" className="align-middle">
                                            <Text color="green" weight="medium">
                                                ${producto.recaudacionTotal.toLocaleString("es-AR")}
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table.Root>
                </div>
            </Flex>
        </Card>
    )
}