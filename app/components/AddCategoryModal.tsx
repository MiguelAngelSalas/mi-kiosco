"use client"
import { Heading, Button, Card, Flex, TextField, Text } from "@radix-ui/themes"
import { useState } from "react"
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

    if (!isOpen) return null

    const handleSave = () => {
        const nombreLimpio = nombreCategoria.trim()

        if (!nombreLimpio) {
            toast.error("El nombre de la categoría es obligatorio")
            return
        }

        // Creamos la categoría localmente sin llamar al backend
        onSuccess({
            id_categoria: Date.now(), 
            nombre_categoria: nombreLimpio
        })
        
        toast.success("Categoría agregada")
        setNombreCategoria("")
        onClose()
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
                                if (e.key === "Enter") {
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
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            size="3"
                            className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]" 
                            onClick={handleSave}
                        >
                            Guardar
                        </Button>
                    </Flex>
                </div>
            </Card>
        </div>
    )
}