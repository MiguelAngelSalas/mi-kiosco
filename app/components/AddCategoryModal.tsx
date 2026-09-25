"use client"
import { Heading, Button, Card, Flex, TextField, Text } from "@radix-ui/themes"
import { useState } from "react"
import { addCategoryAction } from "@/app/admin/actions" // Asegurate de crear esta Server Action
import toast from "react-hot-toast"

export interface Categoria {
    id_categoria: string | number
    nombre_categoria: string
}

interface AddCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (nuevaCategoria: Categoria) => void
}

export default function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
    const [nombreCategoria, setNombreCategoria] = useState("")
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSave = async () => {
        if (!nombreCategoria.trim()) {
            toast.error("El nombre de la categoría es obligatorio")
            return
        }

        setLoading(true)
        const formData = new FormData()
        
        // Enviamos el nombre al backend
        formData.append("nombre_categoria", nombreCategoria)

        try {
            // Llamamos a la Server Action (que tenés que crear en actions.ts)
            const respuesta = await addCategoryAction(formData)
            
            if (respuesta?.error) {
                toast.error(respuesta.error)
                setLoading(false)
                return
            }
            
            // Si todo sale bien, actualizamos el estado en el componente padre
            onSuccess({
                id_categoria: respuesta?.idCategoria || "AUTOGENERADO", 
                nombre_categoria: nombreCategoria
            })
            
            toast.success("Categoría creada exitosamente")
            setNombreCategoria("")
            onClose()
        } catch (error) {
            toast.error("Ocurrió un error al crear la categoría")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <Card className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 border-2 border-[#33589c] shadow-xl">
                <Heading size="4" className="text-[#33589c] dark:text-white mb-4">
                    Agregar Nueva Categoría
                </Heading>
                
                <div className="flex flex-col gap-4">
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Nombre de la Categoría
                        </Text>
                        <TextField.Root 
                            size="3"
                            placeholder="Ej: Almacén, Bebidas, etc."
                            value={nombreCategoria} 
                            onChange={(e) => setNombreCategoria(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleSave()
                                }
                            }}
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
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </Flex>
                </div>
            </Card>
        </div>
    )
}