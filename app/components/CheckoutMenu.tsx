"use client"
import { Heading, TextField, Button, Card, Table, IconButton, Flex, Text, Dialog } from "@radix-ui/themes"
import { TrashIcon, PlusIcon, MinusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import ButtonCheckOut from "@/app/components/ButtonCheckOut"
import { abrirCajaAction } from "../actions/cajas.action" // Ajustá la ruta si tu action está en otra carpeta

interface Product {
    id_producto: string
    nombre: string
    id_categoria: string
    precio_venta: number
    stock: number
    costo: number
}

interface CartItem extends Product {
    qty: number
}

interface CheckoutMenuProps {
    initialProducts: Product[]
}

export default function CheckoutMenu({ initialProducts }: CheckoutMenuProps) {
    const router = useRouter()
    const [userRole, setUserRole] = useState("")
    const [cart, setCart] = useState<CartItem[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [productos] = useState<Product[]>(initialProducts || [])
    
    // Estados para la caja
    const [idCaja, setIdCaja] = useState<number>(0) // 0 significa cerrada
    const [montoCaja, setMontoCaja] = useState("")
    const [isOpening, setIsOpening] = useState(false)
    const [cajaModalOpen, setCajaModalOpen] = useState(false)

    const handleAddCart = (producto: Product) => {
        if (producto.stock < 1) {
            toast.error(`No hay stock disponible de ${producto.nombre}`)
            return
        }
        if (idCaja === 0) {
            toast.error("Debes abrir la caja antes de vender")
            return
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id_producto === producto.id_producto)
            if (existingItem) {
                if (existingItem.qty >= producto.stock) {
                    toast.error(`Solo hay ${producto.stock} unidades en stock`)
                    return prevCart
                }
                return prevCart.map((item) =>
                    item.id_producto === producto.id_producto ? { ...item, qty: item.qty + 1 } : item
                )
            }
            return [...prevCart, { ...producto, qty: 1 }]
        })
        setSearchTerm("")
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        const query = value.trim().toLowerCase()
        
        const exactMatch = productos.find(item => {
            const codigoFormateado = String(item.id_producto).padStart(4, '0').toLowerCase()
            const codigoCrudo = String(item.id_producto).toLowerCase()
            return codigoFormateado === query || codigoCrudo === query || item.nombre.toLowerCase() === query
        })

        if (exactMatch) {
            handleAddCart(exactMatch)
        }
    }

    const handleIncrement = (id_producto: string) => {
        setCart(cart.map(item => {
            if (item.id_producto === id_producto) {
                if (item.qty >= item.stock) {
                    toast.error(`Stock máximo alcanzado (${item.stock})`)
                    return item
                }
                return { ...item, qty: item.qty + 1 }
            }
            return item
        }))
    }

    const handleDecrement = (id_producto: string) => {
        setCart(cart.map(item => {
            if (item.id_producto === id_producto && item.qty > 1) {
                return { ...item, qty: item.qty - 1 }
            }
            return item
        }))
    }

    const handleRemove = (id_producto: string) => {
        setCart(cart.filter(item => item.id_producto !== id_producto))
        toast.success("Producto removido del carrito")
    }

    const subTotal = cart.reduce((acc, item) => acc + (Number(item.precio_venta) * item.qty), 0)
    const subTotalFormateado = `$${subTotal.toFixed(2)}`

    const vaciarCarrito = () => {
        setCart([])
    }

    const handleAbrirCaja = async () => {
        const montoNum = Number(montoCaja)
        if (isNaN(montoNum) || montoNum < 0) {
            toast.error("Ingresá un monto válido")
            return
        }

        setIsOpening(true)

        try {
            // Buscamos el ID del usuario (Si no existe en localStorage, usamos 1 temporalmente)
            const storedUserId = localStorage.getItem("idUsuario")
            const userId = storedUserId ? Number(storedUserId) : 1 

            // Llamamos a la BD
            const respuesta = await abrirCajaAction(userId, montoNum)

            if (respuesta?.error) {
                toast.error(respuesta.error)
            } else if (respuesta?.success && respuesta?.id_caja) {
                // Guardamos el ID real de la base de datos y habilitamos el sistema
                setIdCaja(respuesta.id_caja)
                toast.success(`Caja abierta exitosamente con $${montoNum}`)
                setMontoCaja("")
                setCajaModalOpen(false) // Cerramos el modal
            }
        } catch (error) {
            toast.error("Ocurrió un error al intentar abrir la caja")
            console.error(error)
        } finally {
            setIsOpening(false)
        }
    }

    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")
        if (!storedRole) {
            toast.error("Debes iniciar sesión")
            router.push("/login")
        } else {
            setUserRole(storedRole)
        }
    }, [router])

    const productosFiltrados = searchTerm.trim() === "" ? [] : productos.filter(item => {
        const query = searchTerm.toLowerCase().trim()
        const nombre = (item.nombre || "").toLowerCase()
        const codigo = String(item.id_producto || "").padStart(4, '0').toLowerCase()
        return nombre.includes(query) || codigo.includes(query)
    })

    const itemsParaCheckout = cart.map(item => ({
        idProducto: item.id_producto,
        cantidad: item.qty,
        precioUnitario: Number(item.precio_venta)
    }))

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

                    {/* BOTÓN Y MODAL DE ABRIR CAJA */}
                    {idCaja === 0 ? (
                        <Dialog.Root open={cajaModalOpen} onOpenChange={setCajaModalOpen}>
                            <Dialog.Trigger>
                                <Button 
                                    variant="solid"
                                    className="cursor-pointer transition-all duration-200 hover:scale-105 bg-[#589c33] text-white hover:bg-[#467d28]"
                                >
                                    Abrir Caja
                                </Button>
                            </Dialog.Trigger>

                            <Dialog.Content style={{ maxWidth: 400 }} className="bg-white dark:bg-gray-800 border-2 border-[#33589c] p-6 rounded-lg">
                                <Dialog.Title className="text-[#33589c] dark:text-white">
                                    Abrir Turno / Caja
                                </Dialog.Title>
                                <Dialog.Description className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                                    Ingresá el monto inicial en efectivo con el que empezás el turno.
                                </Dialog.Description>

                                <Flex direction="column" gap="3">
                                    <Text as="div" size="2" mb="1" weight="bold" className="dark:text-white">
                                        Monto Inicial ($)
                                    </Text>
                                    <TextField.Root 
                                        type="number" 
                                        placeholder="Ej: 5000" 
                                        value={montoCaja}
                                        onChange={(e) => setMontoCaja(e.target.value)}
                                        className="dark:bg-gray-700"
                                        disabled={isOpening}
                                    />

                                    <Flex gap="3" mt="4" justify="end">
                                        <Button 
                                            variant="soft" 
                                            color="gray" 
                                            className="cursor-pointer"
                                            onClick={() => setCajaModalOpen(false)}
                                            disabled={isOpening}
                                        >
                                            Cancelar
                                        </Button>
                                        
                                        <Button 
                                            className="cursor-pointer bg-[#589c33] text-white hover:bg-[#467d28]"
                                            onClick={handleAbrirCaja}
                                            disabled={!montoCaja || isOpening}
                                        >
                                            {isOpening ? "Abriendo..." : "Confirmar Apertura"}
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Dialog.Content>
                        </Dialog.Root>
                    ) : (
                        <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-md text-sm font-bold border border-green-300 dark:border-green-700">
                            Caja Abierta (ID: {idCaja})
                        </div>
                    )}
                    
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
                {/* Envolvemos en un div para aplicar los estilos de deshabilitado sin romper la hidratación de React */}
                <div className={idCaja === 0 ? "opacity-50 cursor-not-allowed" : ""}>
                    <TextField.Root 
                        placeholder={idCaja === 0 ? "Abrí la caja para buscar productos..." : "Buscar producto o escanear código de barras..."} 
                        size="3"
                        value={searchTerm}
                        // Solo permitimos escribir si la caja está abierta
                        onChange={(e) => {
                            if (idCaja !== 0) handleSearchChange(e);
                        }}
                        // Evita que el usuario llegue al input con la tecla TAB si la caja está cerrada
                        tabIndex={idCaja === 0 ? -1 : 0} 
                        className={`transition-colors border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 ${
                            idCaja === 0 ? "pointer-events-none" : "hover:border-[#33589c] dark:hover:border-[#33589c]"
                        }`}
                    >
                        <TextField.Slot>
                            <MagnifyingGlassIcon height="16" width="16" className="text-gray-500 dark:text-gray-400" />
                        </TextField.Slot>    
                    </TextField.Root>
                </div>
                
                {productosFiltrados.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-gray-800 border-2 border-[#33589c] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {productosFiltrados.map((product) => (
                            <div 
                                key={product.id_producto}
                                onClick={() => handleAddCart(product)}
                                className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-none transition-colors"
                            >
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                    <span className="text-gray-400 font-mono text-xs mr-2">{String(product.id_producto).padStart(4, '0')}</span>
                                    {product.nombre}
                                </span>
                                <div className="flex gap-4 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Stock: {product.stock}</span>
                                    <span className="font-bold text-[#589c33]">${Number(product.precio_venta).toFixed(2)}</span>
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
                            {cart.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400 font-medium">
                                        {idCaja === 0 ? "🔒 Caja cerrada. Abrí la caja para empezar a cobrar." : "🛒 El carrito está vacío."}
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                cart.map((item) => (
                                    <Table.Row key={item.id_producto} align="center" className="border-b border-gray-200 dark:border-gray-700">
                                        <Table.RowHeaderCell className="font-medium dark:text-gray-200 text-base">{item.nombre}</Table.RowHeaderCell>
                                        <Table.Cell justify="center">
                                            <Flex gap="3" align="center" justify="center">
                                                <IconButton size="1" onClick={() => handleDecrement(item.id_producto)} className="cursor-pointer border border-[#33589c] text-[#33589c] bg-transparent hover:bg-[#33589c] hover:text-white dark:border-blue-400 dark:text-white">
                                                    <MinusIcon />
                                                </IconButton>
                                                <input 
                                                    type="number" 
                                                    value={item.qty === 0 ? "" : item.qty} 
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const newQty = value === "" ? 0 : parseInt(value, 10);
                                                        
                                                        if (!isNaN(newQty) && newQty >= 0) {
                                                            if (newQty > item.stock) {
                                                                toast.error(`Solo hay ${item.stock} unidades en stock`)
                                                                setCart(cart.map(i => i.id_producto === item.id_producto ? { ...i, qty: item.stock } : i));
                                                            } else {
                                                                setCart(cart.map(i => i.id_producto === item.id_producto ? { ...i, qty: newQty } : i));
                                                            }
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        if (item.qty === 0) {
                                                            setCart(cart.map(i => i.id_producto === item.id_producto ? { ...i, qty: 1 } : i));
                                                        }
                                                    }} 
                                                    className="w-10 text-center font-bold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-[#33589c] focus:outline-none dark:text-white dark:hover:border-gray-600 transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                                <IconButton 
                                                    size="1" 
                                                    onClick={() => handleIncrement(item.id_producto)} 
                                                    disabled={item.qty >= item.stock}
                                                    className={`border border-[#33589c] text-[#33589c] bg-transparent dark:border-blue-400 dark:text-white transition-colors duration-200 
                                                        ${item.qty >= item.stock 
                                                            ? 'opacity-50 cursor-not-allowed' 
                                                            : 'cursor-pointer hover:bg-[#33589c] hover:text-white' 
                                                        }`}>                                                
                                                    <PlusIcon />
                                                </IconButton>
                                            </Flex> 
                                        </Table.Cell>
                                        <Table.Cell justify="end" className="dark:text-gray-200 text-base">${(Number(item.precio_venta) * item.qty).toFixed(2)}</Table.Cell>
                                        <Table.Cell justify="center">
                                            <IconButton size="2" onClick={() => handleRemove(item.id_producto)} className="cursor-pointer border border-[#9d3358] text-[#9d3358] bg-transparent hover:bg-[#9d3358] hover:text-white">
                                                <TrashIcon />
                                            </IconButton>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
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
                            <Text className="dark:text-gray-200 font-medium">${subTotal.toFixed(2)}</Text>
                        </Flex>
                        <Flex justify="between" mt="2" align="center">
                            <Text size="6" weight="bold" className="dark:text-white">Total</Text>
                            <Text size="6" weight="bold" className="text-[#589c33]">
                                ${subTotal.toFixed(2)}
                            </Text>
                        </Flex>
                    </Flex>
                    
                    <ButtonCheckOut 
                        subTotal={subTotalFormateado} 
                        items={itemsParaCheckout} 
                        idCaja={idCaja} 
                        onClearCart={vaciarCarrito} 
                    />
                </Card>
            </div>
        </div>
    )
}