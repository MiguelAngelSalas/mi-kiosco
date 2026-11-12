"use client"
import { useState } from "react"
import toast from "react-hot-toast"

// 👇 1. IMPORTAMOS NUESTROS DOS HOOKS SEPARADOS POR RESPONSABILIDAD
import { useAdminAuth } from "@/src/app/features/Admin/hooks/useAdminAuth"
import { useProductosInventory } from "@/src/app/features/Productos/hooks/useProductosInventory"

// Modales (Asumiendo que ya los tenés en su carpeta de Productos)
import EditProductModal from "@/src/app/features/Productos/Componentes/EditProductModal" 
import AddProductModal from "@/src/app/features/Productos/Componentes/AddProductModal"
import AddCategoryModal from "@/src/app/features/Productos/Componentes/AddCategoryModal"

// Componentes Visuales del Admin
import AdminHeader from "./Componentes/AdminHeader"
import AdminToolbar from "./Componentes/AdminToolbar"
import AdminTable from "./Componentes/AdminTable"
import PanelStockBajo from "@/src/app/features/Productos/Componentes/PanelStockBajo" 

export default function AdminPanel() {
    // 👇 2. USAMOS EL PATOVICA (Seguridad)
    const { isAuthorized } = useAdminAuth()
    
    // 👇 3. USAMOS EL REPOSITOR (Datos)
    const { 
        loadingData, productos, setProductos, 
        categorias, setCategorias, handleDeleteProduct 
    } = useProductosInventory()
    
    // Estados Locales UI (Quedan intactos)
    const [searchTerm, setSearchTerm] = useState("")
    const [editingProduct, setEditingProduct] = useState<any | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)

    // Filtrado de Tabla (Queda intacto)
    const productosFiltrados = productos.filter((item) => {
        const query = searchTerm.toLowerCase().trim()
        if (!query) return true 
        
        const nombre = (item.nombre || "").toLowerCase()
        const codigo = String(item.id_producto || "").padStart(4, "0").toLowerCase()
        return nombre.includes(query) || codigo.includes(query)
    })

    // El patovica te frena acá si no sos admin
    if (!isAuthorized) return null

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">
            
            <AdminHeader />

            {/* Panel de Stock Bajo */}
            {!loadingData && (
                <PanelStockBajo productos={productos} umbral={5} />
            )}

            <AdminToolbar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                onOpenAddProduct={() => setIsAddOpen(true)} 
            />

            <AdminTable 
                productosFiltrados={productosFiltrados}
                loadingData={loadingData}
                handleOpenEdit={(item) => setEditingProduct(item)}
                handleDeleteProduct={handleDeleteProduct}
            />

            {/* --- ZONA DE MODALES --- */}
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
                productos={productos}
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