"use client"

import { Heading, Table, Button, Card, Text, Flex, TextField } from "@radix-ui/themes"
import { MagnifyingGlassIcon, TrashIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import EditProductModal, { Categoria } from "./EditProductModal" 
import AddProductModal, { Product } from "@/app/components/AddProductModal"
import AddCategoryModal from "@/app/components/AddCategoryModal" 

// Datos mock iniciales para desarrollo local mientras el backend implementa los endpoints
const DEFAULT_CATEGORIAS: Categoria[] = [
    { id_categoria: "1", nombre_categoria: "Golosinas" },
    { id_categoria: "2", nombre_categoria: "Bebidas" },
    { id_categoria: "3", nombre_categoria: "Cigarrillos" },
    { id_categoria: "4", nombre_categoria: "Almacén" },
]

const DEFAULT_PRODUCTOS: Product[] = [
    { id_producto: "1", nombre: "Alfajor Guaymallén Chocolate", id_categoria: "1", precio_venta: 450, costo: 280, stock: 120 },
    { id_producto: "2", nombre: "Coca Cola 500ml", id_categoria: "2", precio_venta: 1200, costo: 750, stock: 45 },
    { id_producto: "3", nombre: "Caramelos Sugus x bolsa", id_categoria: "1", precio_venta: 850, costo: 500, stock: 15 },
    { id_producto: "4", nombre: "Agua Mineral 500ml", id_categoria: "2", precio_venta: 900, costo: 520, stock: 80 },
]

interface AdminPanelProps {
    initialProducts?: Product[]
    initialCategorias?: Categoria[] 
}

export default function AdminPanel({ 
    initialProducts = DEFAULT_PRODUCTOS, 
    initialCategorias = DEFAULT_CATEGORIAS 
}: AdminPanelProps) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    
    // Si llegan props vacías, usamos los defaults mock
    const [productos, setProductos] = useState<Product[]>(
        initialProducts.length > 0 ? initialProducts : DEFAULT_PRODUCTOS
    )
    const [categorias, setCategorias] = useState<Categoria[]>(
        initialCategorias.length > 0 ? initialCategorias : DEFAULT_CATEGORIAS
    )
    
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)

    // Control de sesión por rol
    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")

        if (!storedRole || storedRole !== "administrador") {
            toast.error("Acceso denegado. Solo administradores.")
            router.push("/login") 
        } else {
            setIsAuthorized(true)
        }
    }, [router])

    const productosFiltrados = productos.filter((item) => {
        const query = searchTerm.toLowerCase().trim()
        if (!query) return true 
        
        const nombre = (item.nombre || "").toLowerCase()
        const codigo = String(item.id_producto || "").padStart(4, "0").toLowerCase()
        return nombre.includes(query) || codigo.includes(query)
    })

    const handleOpenEdit = (item: Product) => {
        setEditingProduct(item)
    }

    const handleDeleteProduct = (id: string, nombre: string) => {
        if (window.confirm(`¿Estás seguro que querés borrar el producto "${nombre}"?`)) {
            setProductos(prev => prev.filter(p => p.id_producto !== id))
            toast.success(`Producto "${nombre}" eliminado`)
        }
    }

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
                        Ir al Mostrador (POS)
                    </Button>
                    <Button 
                        variant="solid" 
                        className="cursor-pointer transition-all duration-200 hover:scale-105 bg-[#9d3358] text-white hover:bg-[#7d2645]"
                        onClick={() => {
                            localStorage.removeItem("rolUsuario")
                            localStorage.removeItem("token")
                            toast.success("Sesión cerrada")
                            router.push("/login")
                        }}
                    >
                        Cerrar Sesión
                    </Button>
                </div>
            </div>

            {/* Barra de Filtro y Acciones */}
            <Flex direction="row" gap="4" align="center">
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
                <Button 
                    onClick={() => setIsAddOpen(true)} 
                    className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]"
                >
                    + Agregar producto
                </Button>
                <Button 
                    variant="soft"
                    onClick={() => toast("Sección de Cajas en desarrollo", { icon: "ℹ️" })}
                    className="cursor-pointer bg-[#33589c]/10 text-[#33589c] dark:text-blue-300 hover:bg-[#33589c]/20"
                >
                    Cajas diarias
                </Button>
            </Flex>

            {/* Tabla de Productos */}
            <Card className="grow border-2 border-[#33589c] rounded-lg bg-white dark:bg-gray-800 p-5 shadow-md overflow-hidden flex flex-col">
                <div className="flex flex-col gap-4 h-full overflow-hidden">
                    <Flex justify="between" align="center">
                        <Heading size="4" className="text-[#9d3358] dark:text-[#d14476]">
                            Gestión de Productos e Inventario
                        </Heading>
                        <Text size="2" className="text-gray-500 dark:text-gray-400">
                            Total: {productosFiltrados.length} productos
                        </Text>
                    </Flex>
                    
                    <div className="overflow-y-auto grow border border-[#33589c] rounded-lg">
                        <Table.Root variant="surface" className="w-full">
                            <Table.Header className="bg-[#33589c] sticky top-0 z-10">
                                <Table.Row>
                                    <Table.ColumnHeaderCell className="text-white w-24">ID</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="text-white">Producto</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell justify="end" className="text-white">Costo</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell justify="end" className="text-white">Precio Venta</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell justify="center" className="text-white">Stock</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell justify="center" className="text-white">Acciones</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {productosFiltrados.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} justify="center" className="py-8 text-gray-500 text-center">
                                            No se encontraron productos con "{searchTerm}"
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    productosFiltrados.map((item) => (
                                        <Table.Row key={item.id_producto} align="center" className="border-b border-gray-200 dark:border-gray-700">
                                            <Table.Cell className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                                                {String(item.id_producto).padStart(4, "0")}
                                            </Table.Cell>
                                            <Table.RowHeaderCell className="font-medium dark:text-gray-200">
                                                {item.nombre}
                                            </Table.RowHeaderCell>
                                            <Table.Cell justify="end" className="dark:text-gray-300">
                                                ${item.costo}
                                            </Table.Cell>
                                            <Table.Cell justify="end">
                                                <Text weight="bold" style={{ color: "#589c33", fontSize: "1.1rem" }}>
                                                    ${item.precio_venta}
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
                                                        onClick={() => handleOpenEdit(item)}
                                                        className="cursor-pointer border border-[#33589c] text-[#33589c] dark:text-white dark:border-blue-400 hover:bg-[#33589c] hover:text-white"
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button 
                                                        size="1" 
                                                        variant="outline" 
                                                        onClick={() => handleDeleteProduct(item.id_producto, item.nombre)}
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

            {/* Modal de Edición */}
            <EditProductModal 
                product={editingProduct} 
                categoria={categorias}
                onClose={() => setEditingProduct(null)}
                onSuccess={(updated) => {
                    setProductos(prev => prev.map(p => p.id_producto === updated.id_producto ? updated : p))
                    setEditingProduct(null)
                    toast.success("Producto actualizado")
                }}
            />
            
            {/* Modal de Agregar Producto */}
            <AddProductModal 
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                categorias={categorias} 
                onSuccess={(newProduct) => {
                    setProductos(prev => [newProduct, ...prev])
                }}
                onOpenCategoryModal={() => setIsCategoryOpen(true)} 
            />

            {/* Modal de Agregar Categoría */}
            <AddCategoryModal 
                isOpen={isCategoryOpen}
                onClose={() => setIsCategoryOpen(false)}
                onSuccess={(nuevaCategoria) => {
                    setCategorias(prev => [...prev, nuevaCategoria])
                    setIsCategoryOpen(false)
                }}
            />
        </div>
    )
}