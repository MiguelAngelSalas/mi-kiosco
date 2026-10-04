"use client"
import { Heading, Button, Card, Flex, TextField, Text, IconButton } from "@radix-ui/themes"
import { FolderPlus, X, Save, Loader2 } from "lucide-react"
import { useAddCategory, Categoria } from "@/app/hooks/useAddCategory" // Ajustá la ruta

interface AddCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (nuevaCategoria: Categoria) => void
}

export default function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
    // 👇 Llamamos al Hook
    const { 
        nombreCategoria, 
        setNombreCategoria, 
        loading, 
        handleClose, 
        handleSubmit 
    } = useAddCategory(onClose, onSuccess)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 transition-all duration-300">
            <Card className="w-full max-w-sm bg-white dark:bg-gray-900 p-0 border border-gray-300 dark:border-gray-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
                
                {/* --- HEADER DEL MODAL --- */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                    <Flex align="center" gap="2">
                        <FolderPlus className="text-[#33589c]" size={22} />
                        <Heading size="4" className="text-gray-900 dark:text-white font-bold">
                            Nueva Categoría
                        </Heading>
                    </Flex>
                    <IconButton 
                        type="button"
                        variant="ghost" 
                        color="gray" 
                        onClick={handleClose} 
                        disabled={loading}
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                        <X size={20} />
                    </IconButton>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* --- CUERPO DEL MODAL --- */}
                    <div className="p-6">
                        <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">
                            Nombre de la Categoría *
                        </Text>
                        <TextField.Root 
                            name="nombre"
                            size="3"
                            radius="large"
                            placeholder="Ej: Almacén, Bebidas, etc."
                            value={nombreCategoria} 
                            onChange={(e) => setNombreCategoria(e.target.value)}
                            disabled={loading}
                            autoFocus
                            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                        />
                    </div>
                    
                    {/* --- FOOTER DEL MODAL --- */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                        <Button 
                            type="button"
                            variant="soft" 
                            color="gray" 
                            onClick={handleClose} 
                            disabled={loading}
                            className="cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shadow-sm"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b] shadow-sm" 
                        >
                            {loading ? (
                                <><Loader2 size={16} className="animate-spin mr-1" /> Guardando...</>
                            ) : (
                                <><Save size={16} className="mr-1" /> Guardar</>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}