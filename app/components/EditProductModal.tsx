"use client"
import { Heading, Button, Card, Flex, TextField, Text } from "@radix-ui/themes"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export interface Categoria {
    id_categoria: string | number
    nombre_categoria: string
}

interface Product {
    id_producto: string
    nombre: string
    id_categoria: string
    precio_venta: number
    stock: number
    costo: number
}

interface EditProductModalProps {
    product: Product | null
    onClose: () => void
    onSuccess?: (updated: Product) => void
    categoria: Categoria[]
}

export default function EditProductModal({ product, onClose, onSuccess, categoria = [] }: EditProductModalProps) {
    const [editForm, setEditForm] = useState({
        nombre: "",
        precio_venta: 0,
        costo: 0,
        stock: 0,
        id_categoria: ""
    })

    useEffect(() => {
        if (product) {
            setEditForm({
                nombre: product.nombre || "",
                precio_venta: product.precio_venta || 0,
                costo: product.costo || 0,
                stock: product.stock || 0,
                id_categoria: product.id_categoria?.toString() || ""
            })
        }
    }, [product])

    if (!product) return null

    const handleSave = () => {
        if (!editForm.nombre.trim()) {
            toast.error("El nombre del producto es obligatorio")
            return
        }

        if (!editForm.id_categoria) {
            toast.error("Debés seleccionar una categoría")
            return
        }

        const productoActualizado: Product = {
            ...product,
            nombre: editForm.nombre.trim(),
            precio_venta: Number(editForm.precio_venta) || 0,
            costo: Number(editForm.costo) || 0,
            stock: Number(editForm.stock) || 0,
            id_categoria: editForm.id_categoria
        }

        if (onSuccess) {
            onSuccess(productoActualizado)
        }

        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 border-2 border-[#33589c] shadow-xl">
                <Heading size="4" className="text-[#33589c] dark:text-white mb-4">
                    Editar Producto: {product.nombre}
                </Heading>
                
                <div className="flex flex-col gap-4">
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Nombre
                        </Text>
                        <TextField.Root 
                            size="3"
                            value={editForm.nombre} 
                            onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                        />
                    </div>
                    
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Categoría
                        </Text>
                        <select 
                            value={editForm.id_categoria}
                            onChange={(e) => setEditForm({ ...editForm, id_categoria: e.target.value })}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#33589c] text-sm"
                        >
                            <option value="" disabled>Seleccionar categoría...</option>
                            {categoria.map((cat) => (
                                <option key={cat.id_categoria} value={String(cat.id_categoria)}>
                                    {cat.nombre_categoria}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Precio Venta
                            </Text>
                            <TextField.Root 
                                type="number"
                                size="3"
                                value={editForm.precio_venta === 0 ? "" : editForm.precio_venta} 
                                onChange={(e) => setEditForm({ ...editForm, precio_venta: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Costo
                            </Text>
                            <TextField.Root 
                                type="number"
                                size="3"
                                value={editForm.costo === 0 ? "" : editForm.costo} 
                                onChange={(e) => setEditForm({ ...editForm, costo: Number(e.target.value) })}
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
                            value={editForm.stock === 0 ? "" : editForm.stock} 
                            onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                        />
                    </div>

                    <Flex justify="end" gap="3" mt="4">
                        <Button variant="soft" color="gray" size="3" onClick={onClose} className="cursor-pointer">
                            Cancelar
                        </Button>
                        <Button size="3" className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]" onClick={handleSave}>
                            Guardar Cambios
                        </Button>
                    </Flex>
                </div>
            </Card>
        </div>
    )
}