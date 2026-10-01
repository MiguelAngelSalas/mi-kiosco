"use client"

import { Heading, Table, Button, Card, Text, Flex, TextField } from "@radix-ui/themes"
import { MagnifyingGlassIcon, TrashIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import EditProductModal, { Categoria } from "./EditProductModal" 
import AddProductModal, { Product } from "@/app/components/AddProductModal"
import AddCategoryModal from "@/app/components/AddCategoryModal"
import CreateUserModal from "./CreateUserModal" 
import { deleteProductAction,getProductsAction, getCategoriesAction } from "../admin/actions" // Ajustá la ruta!

export default function AdminPanel() {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [loadingData, setLoadingData] = useState(true) // Nuevo estado para la carga inicial
    
    const [productos, setProductos] = useState<Product[]>([])
    const [categorias, setCategorias] = useState<Categoria[]>([])
    
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)

    // Control de sesión y carga de datos reales
    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")

        if (!storedRole || storedRole !== "administrador") {
            toast.error("Acceso denegado. Solo administradores.")
            router.push("/login") 
            return
        } 
        
        setIsAuthorized(true)

        // Función para ir a buscar los datos a Render apenas entramos
        const fetchRealData = async () => {
            setLoadingData(true)
            
            // Hacemos las dos peticiones en paralelo para que sea más rápido
            const [prodRes, catRes] = await Promise.all([
                getProductsAction(),
                getCategoriesAction()
            ])

            if (prodRes.success && prodRes.data) {
                // Mapeamos lo que manda Agus a la estructura de tu Frontend
                const productosAdaptados: Product[] = prodRes.data.map((p: any) => ({
                    id_producto: p.id, // o p.productoId, fijate cómo le llama Agus al ID
                    nombre: p.nombre,
                    codigo_barras: p.codigoBarras,
                    precio_venta: p.precioVenta,
                    costo: p.precioCosto,
                    stock: p.stock,
                    id_categoria: p.categoriaId
                }))
                setProductos(productosAdaptados)
            } else {
                toast.error("No se pudieron cargar los productos")
            }

            if (catRes.success && catRes.data) {
                const categoriasAdaptadas: Categoria[] = catRes.data.map((c: any) => ({
                    id_categoria: c.id, // o c.categoriaId
                    nombre_categoria: c.nombre
                }))
                setCategorias(categoriasAdaptadas)
            }

            setLoadingData(false)
        }

        fetchRealData()
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

    const handleDeleteProduct = async (id: string | number, nombre: string) => {
        if (window.confirm(`¿Estás seguro que querés borrar el producto "${nombre}"?`)) {
            
            // Ponemos un toast de carga porque borrar en BD puede tardar medio segundo
            const toastId = toast.loading("Eliminando producto...")

            try {
                const respuesta = await deleteProductAction(id)

                if (respuesta?.error) {
                    toast.error(respuesta.error, { id: toastId })
                    return
                }

                // Si salió todo bien, lo sacamos de la tabla
                setProductos(prev => prev.filter(p => p.id_producto !== id))
                toast.success(`Producto "${nombre}" eliminado`, { id: toastId })

            } catch (err) {
                toast.error("Ocurrió un error al eliminar", { id: toastId })
            }
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

                <CreateUserModal />

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
                    
                    <div className="overflow-y-auto grow border border-[#33589c] rounded-lg relative">
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
                                {loadingData ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} justify="center" className="py-12 text-[#33589c] font-bold text-center">
                                            Cargando inventario desde el servidor...
                                        </Table.Cell>
                                    </Table.Row>
                                ) : productosFiltrados.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={6} justify="center" className="py-8 text-gray-500 text-center">
                                            No se encontraron productos
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
            
            <AddProductModal 
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                categorias={categorias} 
                onSuccess={(newProduct) => {
                    setProductos(prev => [newProduct, ...prev])
                }}
                onOpenCategoryModal={() => setIsCategoryOpen(true)} 
            />

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