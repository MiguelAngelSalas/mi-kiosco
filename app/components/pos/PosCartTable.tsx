import { Heading, Card, Table, IconButton, Flex, Text } from "@radix-ui/themes"
import { ShoppingCart, Trash2, Plus, Minus, Barcode } from "lucide-react"
import { CartItem } from "@/app/hooks/useCart"

interface PosCartTableProps {
    cart: CartItem[]
    loadingData: boolean
    handleDecrement: (id: string) => void
    handleManualQuantity: (id: string, value: string, stock: number) => void
    handleManualBlur: (id: string) => void
    handleIncrement: (id: string) => void
    handleRemove: (id: string) => void
}

export default function PosCartTable({ 
    cart, loadingData, handleDecrement, handleManualQuantity, 
    handleManualBlur, handleIncrement, handleRemove 
}: PosCartTableProps) {
    return (
        <Card className="grow w-full border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl p-0 overflow-hidden shadow-md">
            <div className="p-4 border-b border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/50">
                <Heading size="4" className="text-gray-800 dark:text-gray-200 font-bold flex items-center gap-2">
                    <ShoppingCart size={18} /> Detalle de venta
                </Heading>
            </div>

            <Table.Root className="w-full">
                <Table.Header className="bg-white dark:bg-gray-900 border-b-2 border-gray-300 dark:border-gray-800">
                    <Table.Row>
                        <Table.ColumnHeaderCell className="text-gray-600 dark:text-gray-400 font-bold text-sm pl-5 py-4">Producto</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell justify="center" className="text-gray-600 dark:text-gray-400 font-bold text-sm py-4">Cantidad</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell justify="end" className="text-gray-600 dark:text-gray-400 font-bold text-sm py-4">Subtotal</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell justify="center" className="text-gray-600 dark:text-gray-400 font-bold text-sm pr-5 py-4">Quitar</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {cart.length === 0 ? (
                        <Table.Row>
                            <Table.Cell colSpan={4}>
                                <Flex direction="column" align="center" justify="center" className="py-20 text-gray-500">
                                    <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-full mb-4 border border-gray-200 dark:border-transparent">
                                        <Barcode size={48} className="opacity-40 text-gray-500" />
                                    </div>
                                    <Text size="4" weight="bold" className="text-gray-700 dark:text-gray-300 mb-1">
                                        El carrito está vacío
                                    </Text>
                                    <Text size="2" className="text-gray-500">
                                        {loadingData ? "Cargando inventario..." : "Buscá un producto por nombre o escaneá el código de barras."}
                                    </Text>
                                </Flex>
                            </Table.Cell>
                        </Table.Row>
                    ) : (
                        cart.map((item) => (
                            <Table.Row key={item.id_producto} align="center" className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                <Table.RowHeaderCell className="font-semibold text-gray-900 dark:text-gray-100 text-base pl-5 py-3">
                                    {item.nombre}
                                </Table.RowHeaderCell>
                                <Table.Cell justify="center">
                                    <Flex gap="2" align="center" justify="center" className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-300 dark:border-gray-700 w-fit mx-auto shadow-inner">
                                        <IconButton 
                                            size="1" 
                                            variant="ghost"
                                            onClick={() => handleDecrement(item.id_producto)} 
                                            className="cursor-pointer text-gray-600 hover:text-[#33589c] hover:bg-white dark:hover:bg-[#33589c]/10 rounded shadow-sm"
                                        >
                                            <Minus size={16} />
                                        </IconButton>
                                        
                                        <input 
                                            type="number" 
                                            value={item.qty === 0 ? "" : item.qty} 
                                            onChange={(e) => handleManualQuantity(item.id_producto, e.target.value, item.stock)}
                                            onBlur={() => handleManualBlur(item.id_producto)} 
                                            className="w-12 text-center font-bold text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        
                                        <IconButton 
                                            size="1" 
                                            variant="ghost"
                                            onClick={() => handleIncrement(item.id_producto)} 
                                            disabled={item.qty >= item.stock}
                                            className={`transition-colors duration-200 rounded shadow-sm
                                                ${item.qty >= item.stock 
                                                    ? 'opacity-40 cursor-not-allowed text-gray-400' 
                                                    : 'cursor-pointer text-gray-600 hover:text-[#33589c] hover:bg-white dark:hover:bg-[#33589c]/10' 
                                                }`}>                                                
                                            <Plus size={16} />
                                        </IconButton>
                                    </Flex> 
                                </Table.Cell>
                                <Table.Cell justify="end" className="text-gray-900 dark:text-gray-200 font-bold text-lg">
                                    ${(Number(item.precio_venta) * item.qty).toFixed(2)}
                                </Table.Cell>
                                <Table.Cell justify="center" className="pr-5">
                                    <IconButton 
                                        size="2" 
                                        variant="soft"
                                        color="red"
                                        onClick={() => handleRemove(item.id_producto)} 
                                        className="cursor-pointer hover:bg-red-200 bg-red-100 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                                    >
                                        <Trash2 size={16} />
                                    </IconButton>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table.Root>
        </Card>
    )
}