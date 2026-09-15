"use client"
import { Heading, Button, Card, Flex, TextField, Text } from "@radix-ui/themes"
import { useState } from "react"
import { addProductAction } from "@/app/admin/actions"
import toast from "react-hot-toast"

interface Product {
    id: string
    name: string
    category: string
    qty: number
    priceSell: number
    stock: number
    cost: number
}

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (newProduct: Product) => void
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
    const [form, setForm] = useState({
        id: "",
        name: "",
        category: "Golosinas",
        priceSell: 0,
        cost: 0,
        stock: 0,
    })
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSave = async () => {
        // Solo exigimos el nombre si el ID lo autogenera la base de datos/Server Action
        if (!form.name) {
            toast.error("El Nombre del producto es obligatorio")
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append("id", form.id)
        formData.append("name", form.name)
        formData.append("category", form.category)
        formData.append("priceSell", form.priceSell.toString())
        formData.append("cost", form.cost.toString())
        formData.append("stock", form.stock.toString())

        try {
            await addProductAction(formData)
            
            // Si todo sale bien
            onSuccess({
                ...form,
                id: form.id || "AUTOGENERADO", // Si lo generás en el backend, acá podés poner un placeholder hasta que refresque
                qty: 1
            })
            
            setForm({ id: "", name: "", category: "Golosinas", priceSell: 0, cost: 0, stock: 0 })
            onClose()
            // Nota: el toast.success lo estás disparando en AdminPanel cuando se llama a onSuccess, 
            // pero si querés podés ponerlo acá también y sacarlo del AdminPanel.
        } catch (error) {
            toast.error("Ocurrió un error al crear el producto")
        } finally {
            setLoading(false)
        }
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
                            value={form.name} 
                            onChange={(e) => setForm({...form, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Categoría
                        </Text>
                        <TextField.Root 
                            size="3"
                            value={form.category} 
                            onChange={(e) => setForm({...form, category: e.target.value})}
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
                                value={form.priceSell} 
                                onChange={(e) => setForm({...form, priceSell: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Costo
                            </Text>
                            <TextField.Root 
                                type="number"
                                size="3"
                                value={form.cost} 
                                onChange={(e) => setForm({...form, cost: Number(e.target.value)})}
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
                            value={form.stock} 
                            onChange={(e) => setForm({...form, stock: Number(e.target.value)})}
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
                            {loading ? "Creando..." : "Crear Producto"}
                        </Button>
                    </Flex>
                </div>
            </Card>
        </div>
    )
}