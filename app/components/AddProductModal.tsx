"use client"
import { Heading, Button, Card, Flex, TextField, Text } from "@radix-ui/themes"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Categoria } from "./EditProductModal"

export interface Product {
    id_producto: string
    nombre: string
    id_categoria: string 
    precio_venta: number
    stock: number
    costo: number
}

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (newProduct: Product) => void
    onOpenCategoryModal?: () => void
    categorias: Categoria[]
}

export default function AddProductModal({ isOpen, onClose, onSuccess, onOpenCategoryModal, categorias }: AddProductModalProps) {
    const [form, setForm] = useState({
        nombre: "",
        id_categoria: "",
        precio_venta: 0,
        costo: 0,
        stock: 0,
    })

    // Autoseleccionar la primera categoría disponible si no hay ninguna elegida
    useEffect(() => {
        if (categorias && categorias.length > 0 && !form.id_categoria) {
            setForm(prev => ({ ...prev, id_categoria: String(categorias[0].id_categoria) }))
        }
    }, [categorias, form.id_categoria])

    if (!isOpen) return null

    const handleSave = () => {
        if (!form.nombre.trim()) {
            toast.error("El nombre del producto es obligatorio")
            return
        }
        if (!form.id_categoria) {
            toast.error("Debés seleccionar una categoría")
            return
        }

        // Generamos el producto en memoria
        const nuevoProducto: Product = {
            id_producto: Date.now().toString(),
            nombre: form.nombre.trim(),
            id_categoria: form.id_categoria,
            precio_venta: Number(form.precio_venta) || 0,
            costo: Number(form.costo) || 0,
            stock: Number(form.stock) || 0,
        }

        onSuccess(nuevoProducto)
        toast.success("Producto creado exitosamente")

        // Reset del formulario
        setForm({
            nombre: "",
            id_categoria: categorias[0]?.id_categoria ? String(categorias[0].id_categoria) : "",
            precio_venta: 0,
            costo: 0,
            stock: 0,
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 border-2 border-[#33589c] shadow-xl">
                <Heading size="4" className="text-[#33589c] dark:text-white mb-4">
                    Agregar Nuevo Producto
                </Heading>
                
                <div className="flex flex-col gap-4">
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Nombre
                        </Text>
                        <TextField.Root 
                            size="3"
                            placeholder="Ej: Alfajor Guaymallén"
                            value={form.nombre} 
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        />
                    </div>
                    
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Categoría
                        </Text>
                        <select 
                            value={form.id_categoria}
                            onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#33589c] text-sm"
                        >
                            <option value="" disabled>Seleccionar categoría...</option>
                            {categorias && categorias.map((cat) => (
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
                                placeholder="0"
                                value={form.precio_venta === 0 ? "" : form.precio_venta} 
                                onChange={(e) => setForm({ ...form, precio_venta: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Costo
                            </Text>
                            <TextField.Root 
                                type="number"
                                size="3"
                                placeholder="0"
                                value={form.costo === 0 ? "" : form.costo} 
                                onChange={(e) => setForm({ ...form, costo: Number(e.target.value) })}
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
                            placeholder="0"
                            value={form.stock === 0 ? "" : form.stock} 
                            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                        />
                    </div>
                    
                    <Flex justify="between" align="center" mt="4" className="pt-2">
                        <Button 
                            type="button"
                            variant="surface"
                            size="2"
                            className="cursor-pointer text-[#33589c] bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
                            onClick={onOpenCategoryModal}
                        >
                            + Nueva Categoría
                        </Button>
                        
                        <Flex gap="3">
                            <Button 
                                variant="soft" 
                                color="gray" 
                                size="3"
                                onClick={onClose} 
                                className="cursor-pointer"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                size="3"
                                className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]" 
                                onClick={handleSave}
                            >
                                Crear Producto
                            </Button>
                        </Flex>
                    </Flex>
                </div>
            </Card>
        </div>
    )
}