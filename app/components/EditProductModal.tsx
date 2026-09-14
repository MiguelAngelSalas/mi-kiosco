"use client"
import { Heading, Button, Card, Flex, TextField } from "@radix-ui/themes"
import { useState, useEffect } from "react"
import { updateProductAction } from "../admin/actions" // Ajustá la ruta según donde tengas tus Server Actions
import { useRouter } from "next/navigation"

interface Product {
    id: string
    name: string
    category: string
    qty: number
    priceSell: number
    stock: number
    cost: number
}

interface EditProductModalProps {
    product: Product | null
    onClose: () => void
    onSuccess?: (updated: Product) => void
}

export default function EditProductModal({ product, onClose, onSuccess }: EditProductModalProps) {
    const router = useRouter()
    const [editForm, setEditForm] = useState({
        name: "",
        priceSell: 0,
        cost: 0,
        stock: 0,
        category: ""
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (product) {
            setEditForm({
                name: product.name || "",
                priceSell: product.priceSell || 0,
                cost: product.cost || 0,
                stock: product.stock || 0,
                category: product.category || ""
            })
        }
    }, [product])

    if (!product) return null

    const handleSave = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append("name", editForm.name)
        formData.append("priceSell", editForm.priceSell.toString())
        formData.append("cost", editForm.cost.toString())
        formData.append("stock", editForm.stock.toString())
        formData.append("category", editForm.category)

        const res = await updateProductAction(product.id, formData)
        setLoading(false)

        if (res?.error) {
            alert(res.error)
            return
        }

        if (onSuccess) {
            onSuccess({ ...product, ...editForm })
        } else {
            router.refresh()
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 border-2 border-[#33589c] shadow-xl">
                <Heading size="4" className="text-[#33589c] dark:text-white mb-4">
                    Editar Producto: {product.id}
                </Heading>
                
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                        <TextField.Root 
                            value={editForm.name} 
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                        <TextField.Root 
                            value={editForm.category} 
                            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Precio Venta</label>
                            <TextField.Root 
                                type="number"
                                value={editForm.priceSell} 
                                onChange={(e) => setEditForm({...editForm, priceSell: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Costo</label>
                            <TextField.Root 
                                type="number"
                                value={editForm.cost} 
                                onChange={(e) => setEditForm({...editForm, cost: Number(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                        <TextField.Root 
                            type="number"
                            value={editForm.stock} 
                            onChange={(e) => setEditForm({...editForm, stock: Number(e.target.value)})}
                        />
                    </div>

                    <Flex justify="end" gap="3" mt="4">
                        <Button 
                            variant="soft" 
                            color="gray"
                            onClick={onClose}
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </Flex>
                </div>
            </Card>
        </div>
    )
}