import { Button, Flex, TextField } from "@radix-ui/themes"
import { Search, Plus, Wallet } from "lucide-react"
import toast from "react-hot-toast"
import CreateUserModal from "../CreateUserModal" // Ajustá la ruta según tu estructura

interface AdminToolbarProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    onOpenAddProduct: () => void
}

export default function AdminToolbar({ searchTerm, setSearchTerm, onOpenAddProduct }: AdminToolbarProps) {
    return (
        <Flex direction={{ initial: "column", md: "row" }} gap="4" align={{ md: "center" }} justify="between">
            <div className="relative w-full md:w-[450px]">
                <TextField.Root 
                    placeholder="Buscar producto por nombre o ID..." 
                    size="3"
                    radius="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="transition-all h-14 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 focus-within:border-[#33589c] shadow-md text-lg"
                >
                    <TextField.Slot>
                        <Search size={20} className="text-gray-500" />
                    </TextField.Slot>    
                </TextField.Root>
            </div>
            
            <Flex gap="3" wrap="wrap">
                <Button 
                    size="3"
                    radius="large"
                    onClick={onOpenAddProduct} 
                    className="cursor-pointer bg-[#589c33] text-white hover:bg-[#4a822a] shadow-md h-12 px-5"
                >
                    <Plus size={18} className="mr-1" /> Nuevo Producto
                </Button>

                <CreateUserModal />

                <Button 
                    size="3"
                    radius="large"
                    variant="surface"
                    onClick={() => toast("Sección de Cajas en desarrollo", { icon: "ℹ️" })}
                    className="cursor-pointer text-[#33589c] bg-white border-2 border-gray-300 hover:bg-gray-50 shadow-sm h-12 dark:bg-transparent dark:border-[#33589c]/30 dark:hover:bg-[#33589c]/10"
                >
                    <Wallet size={18} className="mr-1" /> Cajas Diarias
                </Button>
            </Flex>
        </Flex>
    )
}