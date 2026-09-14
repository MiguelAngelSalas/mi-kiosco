"use client"
import { Heading, Button, Card, Flex, TextField } from "@radix-ui/themes"
import { useState } from "react"
import { addProductAction } from "@/app/admin/actions"

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
        if (!form.name) {
            alert("El ID y el Nombre son obligatorios")
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

        await addProductAction(formData)
        setLoading(false)

        onSuccess({
            ...form,
            qty: 1
        })
        setForm({ id: "", name: "", category: "Golosinas", priceSell: 0, cost: 0, stock: 0 })
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
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                        <TextField.Root 
                            value={form.name} 
                            onChange={(e) => setForm({...form, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                        <TextField.Root 
                            value={form.category} 
                            onChange={(e) => setForm({...form, category: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Precio Venta</label>
                            <TextField.Root 
                                type="number"
                                value={form.priceSell} 
                                onChange={(e) => setForm({...form, priceSell: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Costo</label>
                            <TextField.Root 
                                type="number"
                                value={form.cost} 
                                onChange={(e) => setForm({...form, cost: Number(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                        <TextField.Root 
                            type="number"
                            value={form.stock} 
                            onChange={(e) => setForm({...form, stock: Number(e.target.value)})}
                        />
                    </div>
                    <Flex justify="end" gap="3" mt="4">
                        <Button variant="soft" color="gray" onClick={onClose} disabled={loading} className="cursor-pointer">
                            Cancelar
                        </Button>
                        <Button className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]" onClick={handleSave} disabled={loading}>
                            {loading ? "Creando..." : "Crear Producto"}
                        </Button>
                    </Flex>
                </div>
            </Card>
        </div>
    )
}