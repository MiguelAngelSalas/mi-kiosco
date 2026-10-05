import { Heading, Table, Button, Card, Text, Flex } from "@radix-ui/themes"
import { Trash2, Edit2, Loader2, PackageSearch } from "lucide-react"

interface AdminTableProps {
    productosFiltrados: any[]
    loadingData: boolean
    handleOpenEdit: (item: any) => void
    handleDeleteProduct: (id: string | number, nombre: string) => void
}

export default function AdminTable({ 
    productosFiltrados, loadingData, handleOpenEdit, handleDeleteProduct 
}: AdminTableProps) {
    return (
        <Card className="grow flex flex-col p-0 border border-gray-300 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-300 dark:border-gray-800 flex justify-between items-center bg-gray-100 dark:bg-gray-900">
                <Heading size="4" className="text-gray-800 dark:text-gray-200 font-bold">
                    Inventario
                </Heading>
                <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-full border border-gray-300 dark:border-gray-700 shadow-sm">
                    {productosFiltrados.length} items
                </span>
            </div>
            
            <div className="overflow-y-auto grow relative">
                <Table.Root className="w-full">
                    <Table.Header className="bg-white dark:bg-gray-900 sticky top-0 z-10 border-b-2 border-gray-300 dark:border-gray-800 shadow-sm">
                        <Table.Row>
                            <Table.ColumnHeaderCell className="text-gray-600 dark:text-gray-400 font-bold w-24 pl-5 py-4">ID</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-gray-600 dark:text-gray-400 font-bold py-4">Cód. Barras</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="text-gray-600 dark:text-gray-400 font-bold py-4">Producto</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify="end" className="text-gray-600 dark:text-gray-400 font-bold py-4">Costo</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify="end" className="text-gray-600 dark:text-gray-400 font-bold py-4">Precio Venta</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify="center" className="text-gray-600 dark:text-gray-400 font-bold py-4">Stock</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify="center" className="text-gray-600 dark:text-gray-400 font-bold pr-5 py-4">Acciones</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {loadingData ? (
                            <Table.Row key="loading">
                                {/* colSpan ahora es 7 porque sumamos el código de barras */}
                                <Table.Cell colSpan={7}>
                                    <Flex direction="column" align="center" justify="center" className="py-16 text-[#33589c]">
                                        <Loader2 size={40} className="animate-spin mb-4 opacity-50" />
                                        <Text size="3" weight="bold">Cargando inventario...</Text>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ) : productosFiltrados.length === 0 ? (
                            <Table.Row key="empty">
                                {/* colSpan ahora es 7 porque sumamos el código de barras */}
                                <Table.Cell colSpan={7}>
                                    <Flex direction="column" align="center" justify="center" className="py-16 text-gray-500">
                                        <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-full mb-4 border border-gray-200 dark:border-transparent">
                                            <PackageSearch size={48} className="opacity-40 text-gray-500" />
                                        </div>
                                        <Text size="4" weight="bold" className="text-gray-700 dark:text-gray-300 mb-1">
                                            No se encontraron productos
                                        </Text>
                                        <Text size="2">Revisá el término de búsqueda o agregá uno nuevo.</Text>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ) : (
                            productosFiltrados.map((item) => (
                                <Table.Row key={item.id_producto} align="center" className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <Table.Cell className="pl-5">
                                        <span className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400 font-mono text-xs tracking-wider shadow-sm border border-gray-300 dark:border-transparent">
                                            {String(item.id_producto).padStart(4, "0")}
                                        </span>
                                    </Table.Cell>
                                    
                                    {/* Nueva celda para Código de Barras */}
                                    <Table.Cell className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                                        {item.codigo_barras || "-"}
                                    </Table.Cell>

                                    <Table.RowHeaderCell className="font-semibold text-gray-900 dark:text-gray-200">
                                        {item.nombre}
                                    </Table.RowHeaderCell>
                                    <Table.Cell justify="end" className="text-gray-600 dark:text-gray-400 font-medium">
                                        ${item.costo}
                                    </Table.Cell>
                                    <Table.Cell justify="end">
                                        <Text weight="bold" className="text-[#33589c] dark:text-white text-base">
                                            ${item.precio_venta}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell justify="center">
                                        <span className={`px-3 py-1 rounded-md text-xs font-bold shadow-sm border ${
                                            (item.stock || 0) < 10 
                                            ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50" 
                                            : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50"
                                        }`}>
                                            {item.stock} u.
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell justify="center" className="pr-5">
                                        <Flex gap="2" justify="center">
                                            <Button 
                                                size="1" 
                                                variant="soft" 
                                                onClick={() => handleOpenEdit(item)}
                                                className="cursor-pointer text-[#33589c] bg-blue-50 border border-blue-200 hover:bg-blue-100 dark:border-transparent dark:bg-[#33589c]/10 dark:hover:bg-[#33589c]/20 shadow-sm"
                                                title="Editar producto"
                                            >
                                                <Edit2 size={14} />
                                            </Button>
                                            <Button 
                                                size="1" 
                                                variant="soft" 
                                                color="red"
                                                onClick={() => handleDeleteProduct(item.id_producto, item.nombre)}
                                                className="cursor-pointer hover:bg-red-200 bg-red-100 text-red-700 border border-red-200 dark:border-transparent dark:hover:bg-red-900/50 shadow-sm"
                                                title="Eliminar producto"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        )}
                    </Table.Body>
                </Table.Root>
            </div>
        </Card>
    )
}