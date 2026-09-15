"use client"
import { Heading, TextField, Button, Card, Table, IconButton, Flex, Text } from "@radix-ui/themes"
import { TrashIcon, PlusIcon, MinusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import ButtonCheckOut from "@/app/components/ButtonCheckOut"

interface Product {
    id: string
    name: string
    category: string
    qty: number
    priceSell: number
    stock: number
    cost: number
}

interface CheckoutMenuProps {
    initialProducts: Product[]
}

export default function CheckoutMenu({ initialProducts }: CheckoutMenuProps) {
    const router = useRouter()
    const [userRole, setUserRole] = useState("")
    const [cart, setCart] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [productos] = useState<Product[]>(initialProducts || [])

    const handleAddCart = (producto: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === producto.id)
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === producto.id ? { ...item, qty: item.qty + 1 } : item
                )
            }
            return [...prevCart, { ...producto, qty: 1, price: producto.priceSell }]
        })
        setSearchTerm("")
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)

        const exactMatch = productos.find(item => 
            item.id.toString().toLowerCase() === value.trim().toLowerCase() || 
            item.name.toLowerCase() === value.trim().toLowerCase()
        )
        if (exactMatch) {
            handleAddCart(exactMatch)
        }
    }

    const handleIncrement = (id: string | number) => {
        setCart(cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item))
    }

    const handleDecrement = (id: string | number) => {
        setCart(cart.map(item => {
            if (item.id === id && item.qty > 1) {
                return { ...item, qty: item.qty - 1 }
            }
            return item
        }))
    }

    const handleRemove = (id: string | number) => {
        setCart(cart.filter(item => item.id !== id))
        toast.success("Producto removido del carrito")
    }

    const subTotal = cart.reduce((acc, item) => acc + (item.priceSell * item.qty), 0)

    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")
        if (!storedRole) {
            toast.error("Debes iniciar sesión")
            router.push("/login")
        } else {
            setUserRole(storedRole)
        }
    }, [router])

    const productosFiltrados = searchTerm.trim() === "" ? [] : productos.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Cabecera */}
            <Flex justify="between" align="center" className="border-b-[3px] border-[#33589c] pb-4">
                <Heading as="h1" size="6" className="text-[#33589c] dark:text-white">
                    Punto de Venta
                </Heading>
                
                <Flex align="center" gap="4">
                    <Text className="text-gray-500 dark:text-gray-300 font-medium">
                        Rol activo: <span className="capitalize">{userRole}</span>
                    </Text>
                    
                    {userRole === "administrador" && (
                        <Button 
                            variant="solid"
                            className="cursor-pointer transition-all duration-200 hover:scale-105 bg-[#33589c] text-white hover:bg-[#28467b]"
                            onClick={() => router.push("/AdminPage")}
                        >
                            Panel Admin
                        </Button>
                    )}
                    
                    <Button 
                        variant="solid"
                        className="cursor-pointer transition-all duration-200 hover:scale-105 bg-[#9d3358] text-white hover:bg-[#7d2645]"
                        onClick={() => {
                            localStorage.removeItem("rolUsuario")
                            toast.success("Sesión cerrada")
                            router.push("/login")
                        }}
                    >
                        Cerrar Sesión
                    </Button>
                </Flex>
            </Flex>

            {/* Buscador */}
            <div className="relative w-full">
                <TextField.Root 
                    placeholder="Buscar producto o escanear código de barras..." 
                    size="3"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="transition-colors border border-gray-300 dark:border-gray-600 hover:border-[#33589c] dark:hover:border-[#33589c] bg-white dark:bg-gray-800"
                >
                    <TextField.Slot>
                        <MagnifyingGlassIcon height="16" width="16" className="text-gray-500 dark:text-gray-400" />
                    </TextField.Slot>    
                </TextField.Root>
                
                {productosFiltrados.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-gray-800 border-2 border-[#33589c] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {productosFiltrados.map((product) => (
                            <div 
                                key={product.id}
                                onClick={() => handleAddCart(product)}
                                className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-none transition-colors"
                            >
                                <span className="font-medium text-gray-800 dark:text-gray-200">{product.name}</span>
                                <div className="flex gap-4 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Stock: {product.stock}</span>
                                    <span className="font-bold text-[#589c33]">${product.priceSell}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabla y Carrito */}
            <div className="flex flex-row gap-6 grow">
                <Card className="grow border-2 border-[#33589c] bg-white dark:bg-gray-800 rounded-lg p-0 overflow-hidden">
                    <Table.Root variant="surface" className="w-full">
                        <Table.Header className="bg-[#33589c]">
                            <Table.Row>
                                <Table.ColumnHeaderCell className="text-white text-base">Producto</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="center" className="text-white text-base">Cant.</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="end" className="text-white text-base">Precio</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell justify="center" className="text-white text-base">Acción</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {cart.map((item) => (
                                <Table.Row key={item.id} align="center" className="border-b border-gray-200 dark:border-gray-700">
                                    <Table.RowHeaderCell className="font-medium dark:text-gray-200 text-base">{item.name}</Table.RowHeaderCell>
                                    <Table.Cell justify="center">
                                        <Flex gap="3" align="center" justify="center">
                                            <IconButton size="1" onClick={() => handleDecrement(item.id)} className="cursor-pointer border border-[#33589c] text-[#33589c] bg-transparent hover:bg-[#33589c] hover:text-white dark:border-blue-400 dark:text-white">
                                                <MinusIcon />
                                            </IconButton>
                                            <Text weight="bold" className="dark:text-white w-4 text-center">{item.qty}</Text>
                                            <IconButton size="1" onClick={() => handleIncrement(item.id)} className="cursor-pointer border border-[#33589c] text-[#33589c] bg-transparent hover:bg-[#33589c] hover:text-white dark:border-blue-400 dark:text-white">
                                                <PlusIcon />
                                            </IconButton>
                                        </Flex> 
                                    </Table.Cell>
                                    <Table.Cell justify="end" className="dark:text-gray-200 text-base">${item.price * item.qty}</Table.Cell>
                                    <Table.Cell justify="center">
                                        <IconButton size="2" onClick={() => handleRemove(item.id)} className="cursor-pointer border border-[#9d3358] text-[#9d3358] bg-transparent hover:bg-[#9d3358] hover:text-white">
                                            <TrashIcon />
                                        </IconButton>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Card>

                {/* Resumen */}
                <Card className="w-[320px] border-2 border-[#33589c] bg-white dark:bg-gray-800 p-5 rounded-lg flex flex-col justify-between">
                    <Flex direction="column" gap="4">
                        <Heading size="4" className="text-[#33589c] dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                            Resumen de orden
                        </Heading>
                        <Flex justify="between" mt="2">
                            <Text className="text-gray-500 dark:text-gray-400">Subtotal</Text>
                            <Text className="dark:text-gray-200 font-medium">${subTotal}</Text>
                        </Flex>
                        <Flex justify="between" mt="2" align="center">
                            <Text size="6" weight="bold" className="dark:text-white">Total</Text>
                            <Text size="6" weight="bold" className="text-[#589c33]">
                                ${subTotal}
                            </Text>
                        </Flex>
                    </Flex>
                    
                    <ButtonCheckOut subTotal={subTotal} onClearCart={() => setCart([])} />
                </Card>
            </div>
        </div>
    )
}