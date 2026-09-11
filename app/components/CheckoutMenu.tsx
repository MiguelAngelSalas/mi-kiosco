"use client"
import { Heading, TextField, Button, Card, Table, IconButton, Flex, Text } from "@radix-ui/themes"
import { TrashIcon, PlusIcon, MinusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutMenu() {
    const router = useRouter()
    const [userRole, setUserRole] = useState("")

    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")

        if (!storedRole) {
            router.push("/login")
        } else {
            setUserRole(storedRole)
        }
    }, [router])

    const mockCart = [
        { id: 1, name: "Alfajor Guaymallen Blanco", qty: 2, price: 500 },
        { id: 2, name: "Coca Cola 500ml", qty: 1, price: 1200 },
    ]

    return (
        // Contenedor principal con soporte oscuro
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            
            {/* Cabecera con borde azul */}
            <Flex justify="between" align="center" className="border-b-[3px] border-[#33589c] pb-4">
                <Heading as="h1" size="6" className="text-[#33589c] dark:text-white">
                    Punto de Venta
                </Heading>
                
                <Flex align="center" gap="4">
                    <Text className="text-gray-500 dark:text-gray-300 font-medium">
                        Rol activo: <span className="capitalize">{userRole}</span>
                    </Text>
                    
                    {/* Botón Admin: Solo visible para el dueño */}
                    {userRole === "administrador" && (
                        <Button 
                            variant="ghost"
                            className="cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-[#33589c] text-[#33589c] dark:text-white bg-transparent hover:bg-[#33589c] hover:text-white dark:hover:bg-[#33589c]"
                            onClick={() => router.push("/AdminDashboard")}
                        >
                            Panel Admin
                        </Button>
                    )}
                    
                    {/* Botón Logout: Color Magenta (#9d3358) */}
                    <Button 
                        variant="ghost"
                        className="cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-[#9d3358] text-[#9d3358] dark:text-white bg-transparent hover:bg-[#9d3358] hover:text-white dark:hover:bg-[#9d3358]"
                        onClick={() => {
                            localStorage.removeItem("rolUsuario")
                            router.push("/login")
                        }}
                    >
                        Cerrar Sesión
                    </Button>
                </Flex>
            </Flex>

            {/* Buscador */}
            <TextField.Root 
                placeholder="Buscar producto o escanear código de barras..." 
                size="3"
                className="transition-colors border border-gray-300 dark:border-gray-600 hover:border-[#33589c] dark:hover:border-[#33589c] bg-white dark:bg-gray-800"
            >
                <TextField.Slot>
                    <MagnifyingGlassIcon height="16" width="16" className="text-gray-500 dark:text-gray-400" />
                </TextField.Slot>    
            </TextField.Root>

            {/* Área Principal: Tabla y Resumen */}
            <div className="flex flex-row gap-6 grow">
                
                {/* Tarjeta de la Tabla */}
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
                            {mockCart.map((item) => (
                                <Table.Row key={item.id} align="center" className="border-b border-gray-200 dark:border-gray-700">
                                    <Table.RowHeaderCell className="font-medium dark:text-gray-200 text-base">{item.name}</Table.RowHeaderCell>
                                    
                                    <Table.Cell justify="center">
                                        <Flex gap="3" align="center" justify="center">
                                            <IconButton size="1" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                                                <MinusIcon />
                                            </IconButton>
                                            <Text weight="bold" className="dark:text-white w-4 text-center">{item.qty}</Text>
                                            <IconButton size="1" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                                                <PlusIcon />
                                            </IconButton>
                                        </Flex> 
                                    </Table.Cell>
                                    
                                    <Table.Cell justify="end" className="dark:text-gray-200 text-base">
                                        ${item.price * item.qty}
                                    </Table.Cell>
                                    
                                    <Table.Cell justify="center">
                                        {/* Botón Borrar: Color Magenta (#9d3358) */}
                                        <IconButton size="2" className="cursor-pointer bg-transparent border border-[#9d3358] text-[#9d3358] hover:bg-[#9d3358] hover:text-white transition-colors">
                                            <TrashIcon />
                                        </IconButton>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Card>

                {/* Tarjeta de Resumen de Orden */}
                <Card className="w-[320px] border-2 border-[#33589c] bg-white dark:bg-gray-800 p-5 rounded-lg flex flex-col justify-between">
                    <Flex direction="column" gap="4">
                        <Heading size="4" className="text-[#33589c] dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                            Resumen de orden
                        </Heading>
                        
                        <Flex justify="between" mt="2">
                            <Text className="text-gray-500 dark:text-gray-400">Subtotal</Text>
                            <Text className="dark:text-gray-200 font-medium">$2200</Text>
                        </Flex>
                        
                        <Flex justify="between" mt="2" align="center">
                            <Text size="6" weight="bold" className="dark:text-white">Total</Text>
                            <Text size="6" weight="bold" className="text-[#589c33]">
                                $2200
                            </Text>
                        </Flex>
                    </Flex>
                    
                    {/* Botón Checkout: Color Verde (#589c33) */}
                    <Button 
                        size="4" 
                        variant="solid"
                        className="w-full mt-6 cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-[#589c33] bg-[#589c33] text-white hover:bg-white hover:text-[#589c33] dark:hover:bg-gray-800"
                    >
                        CHECKOUT
                    </Button>
                </Card>
                
            </div>
        </div>
    )
}