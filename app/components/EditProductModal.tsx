"use client"
import { Heading, Button, Card, Flex, TextField, Text } from "@radix-ui/themes"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { updateProductAction } from "../admin/actions" // Ajustá la ruta

export interface Categoria {
    id_categoria: string | number
    nombre_categoria: string
}

export interface Product {
    id_producto: string | number
    nombre: string
    id_categoria: string | number
    precio_venta: number
    stock: number
    costo: number
    codigo_barras?: string // Agregado para estar sincronizados con la DB
}

interface EditProductModalProps {
    product: Product | null
    onClose: () => void
    onSuccess?: (updated: Product) => void
    categoria: Categoria[]
}

export default function EditProductModal({ product, onClose, onSuccess, categoria = [] }: EditProductModalProps) {
    const [loading, setLoading] = useState(false)
    const [editForm, setEditForm] = useState({
        nombre: "",
        codigo_barras: "",
        precio_venta: 0,
        costo: 0,
        stock: 0,
        id_categoria: ""
    })

    useEffect(() => {
        if (product) {
            setEditForm({
                nombre: product.nombre || "",
                codigo_barras: product.codigo_barras || "",
                precio_venta: product.precio_venta || 0,
                costo: product.costo || 0,
                stock: product.stock || 0,
                id_categoria: product.id_categoria?.toString() || ""
            })
        }
    }, [product])

    if (!product) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!editForm.nombre.trim()) {
            toast.error("El nombre del producto es obligatorio")
            return
        }
        if (!editForm.id_categoria) {
            toast.error("Debés seleccionar una categoría")
            return
        }

        setLoading(true)

        // Armamos el FormData a mano con los valores del estado controlado
        const formData = new FormData()
        formData.append("nombre", editForm.nombre)
        formData.append("codigoBarras", editForm.codigo_barras)
        formData.append("precioVenta", editForm.precio_venta.toString())
        formData.append("precioCosto", editForm.costo.toString())
        formData.append("stock", editForm.stock.toString())
        formData.append("categoriaId", editForm.id_categoria)

        try {
            const respuesta = await updateProductAction(product.id_producto, formData)

            if (respuesta?.error) {
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            const productoActualizado: Product = {
                ...product,
                nombre: editForm.nombre.trim(),
                codigo_barras: editForm.codigo_barras.trim(),
                precio_venta: Number(editForm.precio_venta) || 0,
                costo: Number(editForm.costo) || 0,
                stock: Number(editForm.stock) || 0,
                id_categoria: editForm.id_categoria
            }

            if (onSuccess) onSuccess(productoActualizado)
            
            setLoading(false)
            onClose()
        } catch (err) {
            toast.error("Ocurrió un error al actualizar")
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 border-2 border-[#33589c] shadow-xl max-h-[90vh] overflow-y-auto">
                <Heading size="4" className="text-[#33589c] dark:text-white mb-4">
                    Editar Producto: {product.nombre}
                </Heading>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Nombre
                        </Text>
                        <TextField.Root 
                            size="3"
                            value={editForm.nombre} 
                            disabled={loading}
                            onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                        />
                    </div>

                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Código de Barras
                        </Text>
                        <TextField.Root 
                            size="3"
                            value={editForm.codigo_barras} 
                            disabled={loading}
                            onChange={(e) => setEditForm({ ...editForm, codigo_barras: e.target.value })}
                        />
                    </div>
                    
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Categoría
                        </Text>
                        <select 
                            value={editForm.id_categoria}
                            disabled={loading}
                            onChange={(e) => setEditForm({ ...editForm, id_categoria: e.target.value })}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#33589c] text-sm disabled:opacity-50"
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
                                Precio Venta ($)
                            </Text>
                            <TextField.Root 
                                type="number"
                                size="3"
                                min="0"
                                step="0.01"
                                disabled={loading}
                                value={editForm.precio_venta === 0 ? "" : editForm.precio_venta} 
                                onChange={(e) => setEditForm({ ...editForm, precio_venta: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Costo ($)
                            </Text>
                            <TextField.Root 
                                type="number"
                                size="3"
                                min="0"
                                step="0.01"
                                disabled={loading}
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
                            min="0"
                            disabled={loading}
                            value={editForm.stock === 0 ? "" : editForm.stock} 
                            onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                        />
                    </div>

                    <Flex justify="end" gap="3" mt="4">
                        <Button type="button" variant="soft" color="gray" size="3" onClick={onClose} disabled={loading} className="cursor-pointer">
                            Cancelar
                        </Button>
                        <Button type="submit" size="3" disabled={loading} className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]">
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </Flex>
                </form>
            </Card>
        </div>
    )
}