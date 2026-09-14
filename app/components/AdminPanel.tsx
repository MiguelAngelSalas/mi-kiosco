"use client"
import { Heading, Table, Button, Card, Text, Flex, TextField } from "@radix-ui/themes"
import { MagnifyingGlassIcon, TrashIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast" // Importamos toast
import EditProductModal from "./EditProductModal" 
import AddProductModal from "@/app/components/AddProductModal" 
import { deleteProductAction } from "../admin/actions"

interface Products {
    id: string
    name: string
    category: string
    qty: number
    priceSell: number
    stock: number
    cost: number
}

interface AdminPanelProps {
    initialProducts: Products[]
}

export default function AdminPanel({ initialProducts = [] }: AdminPanelProps) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [productos, setProductos] = useState<Products[]>(initialProducts || [])
    const [editingProduct, setEditingProduct] = useState<Products | null>(null)
    const [editForm, setEditForm] = useState({ name: "", priceSell: 0, cost: 0, stock: 0 })
    const [isAddOpen, setIsAddOpen] = useState(false)

    // Filtrar con safe guards
    const productosFiltrados = productos.filter((item) => {
        const query = searchTerm.toLowerCase().trim()
        if (!query) return true // Muestra todos si no hay búsqueda
        
        const nombre = (item.name || "").toLowerCase()
        const codigo = String(item.id || "").toLowerCase()
        return nombre.includes(query) || codigo.includes(query)
    })

    const handleOpenEdit = (item: Products) => {
        setEditingProduct(item)
        setEditForm({
            name: item.name,
            priceSell: item.priceSell,
            cost: item.cost,
            stock: item.stock
        })
    }

    // Security check: Only admins allowed
    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")

        if (!storedRole || storedRole !== "administrador") {
            toast.error("Acceso denegado. Solo administradores.")
            router.push("/login") 
        } else {
            setIsAuthorized(true)
        }
    }, [router])

    if (!isAuthorized) {
        return null 
    }

    return (
        <div className="flex flex-col gap-5 p-6 h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center border-b-[3px] border-[#33589c] pb-4">
                <Heading as="h1" size="6" className="text-[#33589c] dark:text-white">
                    Admin Dashboard
                </Heading>
                <div className="flex gap-3">
                    <Button 
                        variant="solid" 
                        className="cursor-pointer transition-all duration-200 hover:scale-105 bg-[#33589c] text-white hover:bg-[#28467b]"
                        onClick={() => router.push("/CheckoutMenu")}
                    >
                        Go to POS (Checkout)
                    </Button>
                    <Button 
                        variant="solid" 
                        className="cursor-pointer transition-all duration-200 hover:scale-105 bg-[#9d3358] text-white hover:bg-[#7d2645]"
                        onClick={() => {
                            localStorage.removeItem("rolUsuario")
                            toast.success("Sesión cerrada")
                            router.push("/login")
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <Flex direction={"row"} gap={"6"} align="center">
                <div className="relative w-full max-w-sm">
                    <TextField.Root 
                        placeholder="Filtrar por nombre o ID..." 
                        size="3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="transition-colors border border-gray-300 dark:border-gray-600 hover:border-[#33589c] dark:hover:border-[#33589c] bg-white dark:bg-gray-800"
                    >
                        <TextField.Slot>
                            <MagnifyingGlassIcon height="16" width="16" className="text-gray-500 dark:text-gray-400" />
                        </TextField.Slot>    
                    </TextField.Root>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]">Agregar producto</Button>
                <Button className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]">Cajas diarias</Button>
            </Flex>

            {/* Main Content Area */}
            <Card className="grow border-2 border-[#33589c] rounded-lg bg-white dark:bg-gray-800 p-5 shadow-md overflow-hidden flex flex-col">
                <div className="flex flex-col gap-4 h-full overflow-hidden">
                    <Heading size="4" className="text-[#9d3358] dark:text-[#d14476]">
                        Product & Price Management
                    </Heading>
                    
                    <div className="overflow-y-auto grow border border-[#33589c] rounded-lg">
                        <Table.Root variant="surface" className="w-full">
                            <Table.Header className="bg-[#33589c] sticky top-0 z-10">
                                <Table.Row>
                                    <Table.ColumnHeaderCell className="text-white">Product</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell justify="end" className="text-white">Cost</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell justify="end" className="text-white">Sale Price</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell justify="center" className="text-white">Stock</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell justify="center" className="text-white">Actions</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {productosFiltrados.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={5} justify="center" className="py-8 text-gray-500">
                                            No se encontraron productos con "{searchTerm}"
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    productosFiltrados.map((item) => (
                                        <Table.Row key={item.id} align="center" className="border-b border-gray-200 dark:border-gray-700">
                                            <Table.RowHeaderCell className="font-medium dark:text-gray-200">{item.name}</Table.RowHeaderCell>
                                            <Table.Cell justify="end" className="dark:text-gray-300">${item.cost}</Table.Cell>
                                            <Table.Cell justify="end">
                                                <Text weight="bold" style={{ color: "#589c33", fontSize: "1.1rem" }}>
                                                    ${item.priceSell}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell justify="center">
                                                <Text weight="bold" style={{ color: (item.stock || 0) < 50 ? "#9d3358" : "#589c33" }}>
                                                    {item.stock}
                                                </Text>
                                            </Table.Cell>
                                            <Table.Cell justify="center">
                                                <Flex gap="2" justify="center">
                                                    <Button 
                                                        size="1" 
                                                        variant="outline" 
                                                        onClick={() => setEditingProduct(item)}
                                                        className="cursor-pointer border border-[#33589c] text-[#33589c] dark:text-white dark:border-blue-400 hover:bg-[#33589c] hover:text-white"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        size="1" 
                                                        variant="outline" 
                                                        onClick={async () => {
                                                            if (window.confirm(`¿Estás seguro que querés borrar el producto "${item.name}" definitivamente?`)) {
                                                                try {
                                                                    await deleteProductAction(item.id)
                                                                    setProductos(productos.filter(p => p.id !== item.id))
                                                                    toast.success(`Producto "${item.name}" eliminado`)
                                                                } catch (error) {
                                                                    toast.error("Hubo un error al borrar el producto")
                                                                }
                                                            }
                                                        }}
                                                        className="cursor-pointer border border-[#9d3358] text-[#9d3358] dark:text-white hover:bg-[#9d3358] hover:text-white"
                                                    >
                                                        <TrashIcon />
                                                    </Button>
                                                </Flex>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table.Root>
                        
                    </div>
                </div>
            </Card>
            <EditProductModal 
                product={editingProduct} 
                onClose={() => setEditingProduct(null)}
                onSuccess={(updated) => {
                    setProductos(productos.map(p => p.id === updated.id ? updated : p))
                    toast.success("Producto actualizado")
                }}
            />
            <AddProductModal 
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={(newProduct) => {
                    setProductos([newProduct, ...productos])
                    toast.success("Producto creado exitosamente")
                }}
            />
        </div>
    )
}