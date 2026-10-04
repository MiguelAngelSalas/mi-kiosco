import { Heading, Flex, IconButton } from "@radix-ui/themes"
import { Edit, X } from "lucide-react"

interface EditProductHeaderProps {
    nombre: string
    onClose: () => void
    loading: boolean
}

export default function EditProductHeader({ nombre, onClose, loading }: EditProductHeaderProps) {
    return (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
            <Flex align="center" gap="2">
                <Edit className="text-[#33589c]" size={22} />
                <Heading size="4" className="text-gray-900 dark:text-white font-bold truncate max-w-[280px]">
                    Editar: {nombre}
                </Heading>
            </Flex>
            <IconButton 
                type="button"
                variant="ghost" 
                color="gray" 
                onClick={onClose} 
                disabled={loading}
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
                <X size={20} />
            </IconButton>
        </div>
    )
}