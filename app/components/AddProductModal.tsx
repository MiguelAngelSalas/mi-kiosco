"use client"
import { Heading, Button, Card, Flex, TextField, Text } from "@radix-ui/themes"
import { useState } from "react"
import toast from "react-hot-toast"
import { addProductAction } from "../admin/actions" // Ajustá la ruta según tu proyecto
import { Categoria } from "./EditProductModal" // Asegurate de importar la interfaz de donde la tengas

export interface Product {
    id_producto: string | number
    nombre: string
    id_categoria: string | number
    precio_venta: number
    costo: number
    stock: number
    codigo_barras?: string // Agregado para el backend
}

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
    
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)

        // Validaciones básicas en el front
        if (!formData.get("nombre") || !formData.get("codigoBarras") || formData.get("categoriaId") === "") {
            toast.error("Completá todos los campos obligatorios")
            return
        }

        setLoading(true)

        try {
            const respuesta = await addProductAction(formData)

            if (respuesta?.error) {
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            toast.success("Producto creado en el servidor")
            
            // Simulamos el producto nuevo para que se agregue a tu tabla instantáneamente
            onSuccess({
                id_producto: Date.now().toString(), // Provisorio hasta recargar la página real
                nombre: formData.get("nombre") as string,
                codigo_barras: formData.get("codigoBarras") as string,
                precio_venta: Number(formData.get("precioVenta")),
                costo: Number(formData.get("precioCosto")),
                stock: Number(formData.get("stock")),
                id_categoria: formData.get("categoriaId") as string
            })
            
            form.reset()
            setLoading(false)
            onClose()

        } catch (err) {
            toast.error("Error inesperado al guardar el producto")
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 border-2 border-[#33589c] shadow-xl max-h-[90vh] overflow-y-auto">
                <Heading size="4" className="text-[#33589c] dark:text-white mb-4">
                    Agregar Nuevo Producto
                </Heading>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Text as="label" size="2" weight="medium" className="mb-1 block">Nombre del Producto *</Text>
                        <TextField.Root name="nombre" required placeholder="Ej: Alfajor Guaymallén" size="3" disabled={loading} />
                    </div>

                    <div>
                        <Text as="label" size="2" weight="medium" className="mb-1 block">Código de Barras *</Text>
                        <TextField.Root name="codigoBarras" required placeholder="Ej: 779123456789" size="3" disabled={loading} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Text as="label" size="2" weight="medium" className="mb-1 block">Precio Costo ($) *</Text>
                            <TextField.Root name="precioCosto" type="number" required min="0" step="0.01" placeholder="0.00" size="3" disabled={loading} />
                        </div>
                        <div>
                            <Text as="label" size="2" weight="medium" className="mb-1 block">Precio Venta ($) *</Text>
                            <TextField.Root name="precioVenta" type="number" required min="0" step="0.01" placeholder="0.00" size="3" disabled={loading} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Text as="label" size="2" weight="medium" className="mb-1 block">Stock Inicial *</Text>
                            <TextField.Root name="stock" type="number" required min="0" placeholder="0" size="3" disabled={loading} />
                        </div>
                        <div>
                            <Text as="label" size="2" weight="medium" className="mb-1 block">Categoría *</Text>
                            <select 
                                name="categoriaId" 
                                required
                                disabled={loading}
                                className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:border-[#33589c]"
                            >
                                <option value="">Seleccione...</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>
                                        {cat.nombre_categoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <Flex justify="between" align="center" mt="2">
                        <Button type="button" variant="ghost" size="2" onClick={onOpenCategoryModal} className="text-[#9d3358] cursor-pointer">
                            + Nueva Categoría
                        </Button>
                        
                        <Flex gap="3">
                            <Button type="button" variant="soft" color="gray" onClick={onClose} disabled={loading} className="cursor-pointer">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]">
                                {loading ? "Guardando..." : "Guardar"}
                            </Button>
                        </Flex>
                    </Flex>
                </form>
            </Card>
        </div>
    )
}