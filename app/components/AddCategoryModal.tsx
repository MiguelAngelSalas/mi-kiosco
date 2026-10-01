"use client"
import { Heading, Button, Card, Flex, TextField, Text } from "@radix-ui/themes"
import { useState } from "react"
import toast from "react-hot-toast"
import { createCategoryAction } from "../admin/actions" // Ajustá esta ruta según dónde esté tu archivo

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const nombreLimpio = nombreCategoria.trim()

        if (!nombreLimpio) {
            toast.error("El nombre de la categoría es obligatorio")
            return
        }

        setLoading(true)

        // Armamos el FormData a mano porque estamos usando un estado controlado
        const formData = new FormData()
        formData.append("nombre", nombreLimpio)

        try {
            const respuesta = await createCategoryAction(formData)

            if (respuesta?.error) {
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            toast.success("Categoría agregada en el servidor")
            
            // Le pasamos al componente padre la categoría (idealmente con el ID real que nos devolvió Agus)
            onSuccess({
                id_categoria: respuesta.data?.id || respuesta.data?.id_categoria || Date.now(), // Fallback si no devuelve ID
                nombre_categoria: respuesta.data?.nombre || nombreLimpio
            })
            
            setNombreCategoria("")
            setLoading(false)
            onClose()

        } catch (err) {
            toast.error("Error inesperado al guardar la categoría")
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <Card className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 border-2 border-[#33589c] shadow-xl">
                <Heading size="4" className="text-[#33589c] dark:text-white mb-4">
                    Agregar Nueva Categoría
                </Heading>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Nombre de la Categoría
                        </Text>
                        <TextField.Root 
                            name="nombre"
                            size="3"
                            placeholder="Ej: Almacén, Bebidas, etc."
                            value={nombreCategoria} 
                            onChange={(e) => setNombreCategoria(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    
                    <Flex justify="end" gap="3" mt="4">
                        <Button 
                            type="button"
                            variant="soft" 
                            color="gray" 
                            size="3"
                            onClick={() => {
                                setNombreCategoria("")
                                onClose()
                            }} 
                            disabled={loading}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit"
                            size="3"
                            disabled={loading}
                            className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b]" 
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </Flex>
                </form>
            </Card>
        </div>
    )
}