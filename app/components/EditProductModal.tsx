"use client"
import { Heading, Button, Card, Flex, TextField, Text } from "@radix-ui/themes"
import { useState, useEffect } from "react"
import { updateProductAction } from "../admin/actions" // Ajustá la ruta según donde tengas tus Server Actions
import { useRouter } from "next/navigation"
import toast from "react-hot-toast" // Importamos toast

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

        try {
            const res = await updateProductAction(product.id, formData)

            if (res?.error) {
                toast.error(res.error) // Reemplazamos el alert
                setLoading(false)
                return
            }

            if (onSuccess) {
                onSuccess({ ...product, ...editForm })
            } else {
                toast.success("Producto actualizado")
                router.refresh()
            }
            onClose()
        } catch (error) {
            toast.error("Ocurrió un error al actualizar el producto")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 border-2 border-[#33589c] shadow-xl">
                <Heading size="4" className="text-[#33589c] dark:text-white mb-4">
                    Editar Producto: {product.id}
                </Heading>
                
                <div className="flex flex-col gap-4">
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Nombre
                        </Text>
                        <TextField.Root 
                            size="3"
                            value={editForm.name} 
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Categoría
                        </Text>
                        <TextField.Root 
                            size="3"
                            value={editForm.category} 
                            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Precio Venta
                            </Text>
                            <TextField.Root 
                                type="number"
                                size="3"
                                value={editForm.priceSell} 
                                onChange={(e) => setEditForm({...editForm, priceSell: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Costo
                            </Text>
                            <TextField.Root 
                                type="number"
                                size="3"
                                value={editForm.cost} 
                                onChange={(e) => setEditForm({...editForm, cost: Number(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Stock
                        </Text>
                        <TextField.Root 
                            type="number"
                            size="3"
                            value={editForm.stock} 
                            onChange={(e) => setEditForm({...editForm, stock: Number(e.target.value)})}
                        />
                    </div>

                    <Flex justify="end" gap="3" mt="4">
                        <Button 
                            variant="soft" 
                            color="gray"
                            size="3"
                            onClick={onClose}
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            size="3"
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