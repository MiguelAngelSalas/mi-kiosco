"use client"
import { Card } from "@radix-ui/themes"
import { useAddProduct, Product } from "@/app/hooks/useAddProduct" 
import { Categoria } from "./EditProductModal" 

// Importamos las piezas visuales (Ajustá las rutas si hace falta)
import AddProductHeader from "./AddProductHeader"
import AddProductForm from "./AddProductForm"

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
    categorias: Categoria[]
    onSuccess: (newProduct: Product) => void
    onOpenCategoryModal: () => void
}

export default function AddProductModal({ 
    isOpen, 
    onClose, 
    categorias, 
    onSuccess, 
    onOpenCategoryModal 
}: AddProductModalProps) {
    
    // El hook maneja la conexión con el servidor
    const { loading, handleSubmit } = useAddProduct(onClose, onSuccess)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <Card className="w-full max-w-lg bg-white dark:bg-gray-900 p-0 border border-gray-300 dark:border-gray-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
                
                <AddProductHeader 
                    onClose={onClose} 
                    loading={loading} 
                />
                
                <AddProductForm 
                    handleSubmit={handleSubmit}
                    onClose={onClose}
                    loading={loading}
                    categorias={categorias}
                    onOpenCategoryModal={onOpenCategoryModal}
                />
                
            </Card>
        </div>
    )
}