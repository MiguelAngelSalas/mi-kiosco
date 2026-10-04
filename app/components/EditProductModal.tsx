"use client"
import { Card } from "@radix-ui/themes"
import { useEditProduct, Product } from "@/app/hooks/useEditProduct"

// Importamos nuestros dos componentes visuales
import EditProductHeader from "./EditProductHeader"
import EditProductForm from "./EditProductForm"

export interface Categoria {
    id_categoria: string | number
    nombre_categoria: string
}

interface EditProductModalProps {
    product: Product | null
    onClose: () => void
    onSuccess?: (updated: Product) => void
    categoria: Categoria[]
}

export default function EditProductModal({ product, onClose, onSuccess, categoria = [] }: EditProductModalProps) {
    // 1. Instanciamos el cerebro (Hook)
    const { loading, editForm, setEditForm, handleSubmit } = useEditProduct(product, onClose, onSuccess)

    // 2. Si no hay producto, no mostramos nada
    if (!product) return null

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
            <Card className="w-full max-w-lg bg-white dark:bg-gray-900 p-0 border border-gray-300 dark:border-gray-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
                
                {/* 3. Encabezado Visual */}
                <EditProductHeader 
                    nombre={product.nombre} 
                    onClose={onClose} 
                    loading={loading} 
                />
                
                {/* 4. Formulario Visual */}
                <EditProductForm 
                    editForm={editForm}
                    setEditForm={setEditForm}
                    handleSubmit={handleSubmit}
                    onClose={onClose}
                    loading={loading}
                    categoria={categoria}
                />

            </Card>
        </div>
    )
}