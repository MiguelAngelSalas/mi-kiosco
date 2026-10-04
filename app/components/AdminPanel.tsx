"use client"
import { useState } from "react"
import toast from "react-hot-toast"
import { useAdminData } from "../hooks/useAdminData"

// Modales
import EditProductModal from "./EditProductModal" 
import AddProductModal from "@/app/components/AddProductModal"
import AddCategoryModal from "@/app/components/AddCategoryModal"

// Componentes Visuales del Admin
import AdminHeader from "@/app/components/admin/AdminHeader"
import AdminToolbar from "@/app/components/admin/AdminToolbar"
import AdminTable from "@/app/components/admin/AdminTable"

export default function AdminPanel() {
    // 1. Datos gestionados por el hook
    const { 
        isAuthorized, loadingData, productos, setProductos, 
        categorias, setCategorias, handleDeleteProduct 
    } = useAdminData()
    
    // 2. Estados Locales UI
    const [searchTerm, setSearchTerm] = useState("")
    const [editingProduct, setEditingProduct] = useState<any | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)

    // 3. Filtrado de Tabla
    const productosFiltrados = productos.filter((item) => {
        const query = searchTerm.toLowerCase().trim()
        if (!query) return true 
        
        const nombre = (item.nombre || "").toLowerCase()
        const codigo = String(item.id_producto || "").padStart(4, "0").toLowerCase()
        return nombre.includes(query) || codigo.includes(query)
    })

    if (!isAuthorized) return null

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">
            
            <AdminHeader />

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