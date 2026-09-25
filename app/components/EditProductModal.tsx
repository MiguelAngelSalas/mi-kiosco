"use client"
import { Heading, Button, Card, Flex, TextField, Text } from "@radix-ui/themes"
import { useState, useEffect } from "react"
import { updateProductAction } from "../admin/actions" 
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

// Definimos la estructura de la categoría basándonos en tu tabla
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
    categoria: Categoria[] // <-- ¡Falta agregar esta línea en tu archivo!
}

export default function EditProductModal({ product, onClose, onSuccess, categoria }: EditProductModalProps) {
    const router = useRouter()
    
    // Unificamos el estado para que coincida exactamente con la interfaz Product
    const [editForm, setEditForm] = useState({
        nombre: "",
        precio_venta: 0,
        costo: 0,
        stock: 0,
        id_categoria: ""
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (product) {
            setEditForm({
                nombre: product.nombre || "",
                precio_venta: product.precio_venta || 0,
                costo: product.costo || 0,
                stock: product.stock || 0,
                id_categoria: product.id_categoria?.toString() || "" // Nos aseguramos de que sea string para el select
            })
        }
    }, [product])

    if (!product) return null

    const handleSave = async () => {
        if (!editForm.id_categoria) {
            toast.error("Debes seleccionar una categoría")
            return
        }

        setLoading(true)
        const formData = new FormData()
        
        // Enviamos los datos con los nombres en español al Server Action
        formData.append("nombre", editForm.nombre)
        formData.append("precio_venta", editForm.precio_venta.toString())
        formData.append("costo", editForm.costo.toString())
        formData.append("stock", editForm.stock.toString())
        formData.append("id_categoria", editForm.id_categoria)

        try {
            const res = await updateProductAction(product.id_producto, formData)

            if (res?.error) {
                toast.error(res.error)
                setLoading(false)
                return
            }

            if (onSuccess) {
                // Ahora esto funciona perfecto porque editForm tiene las mismas claves que product
                onSuccess({ ...product, ...editForm, id_categoria: editForm.id_categoria })
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
                            onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                        />
                    </div>
                    
                    {/* Select Dinámico para Categorías */}
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Categoría
                        </Text>
                        <select 
                            value={editForm.id_categoria}
                            onChange={(e) => setEditForm({...editForm, id_categoria: e.target.value})}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#33589c] text-sm"
                        >
                            <option value="" disabled>Seleccionar categoría...</option>
                            {categoria.map((cat) => (
                                <option key={cat.id_categoria} value={cat.id_categoria}>
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
                                onChange={(e) => setEditForm({...editForm, precio_venta: Number(e.target.value)})}
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
                                onChange={(e) => setEditForm({...editForm, costo: Number(e.target.value)})}
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
                            onChange={(e) => setEditForm({...editForm, stock: Number(e.target.value)})}
                        />
                    </div>

                    <Flex justify="end" gap="3" mt="4">
                        <Button variant="soft" color="gray" size="3" onClick={onClose} disabled={loading} className="cursor-pointer">
                            Cancelar
                        </Button>
                        <Button size="3" className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]" onClick={handleSave} disabled={loading}>
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </Flex>
                </div>
            </Card>
        </div>
    )
}