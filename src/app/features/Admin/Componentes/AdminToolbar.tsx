"use client"
import { Button, Flex, TextField } from "@radix-ui/themes"
import { Search, Plus, Wallet, Trophy, Receipt, CalendarClock } from "lucide-react" 
import toast from "react-hot-toast"
import CreateUserModal from "./CreateUserModal" 
import { useRouter } from "next/navigation"

interface AdminToolbarProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    onOpenAddProduct: () => void
}

export default function AdminToolbar({ searchTerm, setSearchTerm, onOpenAddProduct }: AdminToolbarProps) {
    const router = useRouter()
    return (
        <Flex direction={{ initial: "column", md: "row" }} gap="4" align={{ md: "center" }} justify="between">
            <div className="relative w-full md:w-[450px]">
                <TextField.Root 
                    placeholder="Buscar producto por nombre o ID..." 
                    size="3"
                    radius="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="transition-all h-14 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 focus-within:border-[#33589c] shadow-md text-lg font-medium"
                >
                    <TextField.Slot>
                        <Search size={20} className="text-gray-600 dark:text-gray-400" />
                    </TextField.Slot>    
                </TextField.Root>
            </div>
            
            <Flex gap="3" wrap="wrap">

                {/* Productos más vendidos */}
                <Button 
                    size="3"
                    className="cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg bg-[#33589c] text-white hover:bg-[#28467b] font-bold border-2 border-[#28467b]"
                    onClick={() => router.push("/TopProductos")}
                >
                    <Trophy size={18} className="mr-1" />
                    Productos más vendidos
                </Button>

                {/* Reporte de Ventas */}
                <Button 
                    size="3"
                    radius="large"
                    className="cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg bg-[#33589c] text-white hover:bg-[#28467b] font-bold border-2 border-[#28467b]"
                    onClick={() => router.push("/ReporteVentas")} 
                >
                    <Receipt size={18} className="mr-1" /> 
                    Reporte de Ventas
                </Button>

                {/* Lotes y Vencimientos */}
                <Button 
                    size="3"
                    radius="large"
                    className="cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg bg-[#33589c] text-white hover:bg-[#28467b] font-bold border-2 border-[#28467b]"
                    onClick={() => router.push("/loteVencimiento")}
                >
                    <CalendarClock size={18} className="mr-1" />
                    Lotes / Vencimientos
                </Button>

                {/* Nuevo Producto (Verde de alta visibilidad) */}
                <Button 
                    size="3"
                    radius="large"
                    onClick={onOpenAddProduct} 
                    className="cursor-pointer bg-[#589c33] text-white hover:bg-[#4a822a] font-bold shadow-md h-12 px-5 border-2 border-[#4a822a]"
                >
                    <Plus size={18} className="mr-1" /> Nuevo Producto
                </Button>

                <CreateUserModal />

                {/* Cajas Diarias */}
                <Button 
                    size="3"
                    radius="large"
                    variant="surface"
                    onClick={()=>router.push("/administradorTurnos")}
                    className="cursor-pointer text-[#33589c] bg-white border-2 border-gray-300 hover:bg-gray-50 font-bold shadow-sm h-12 dark:bg-transparent dark:border-[#33589c]/30 dark:hover:bg-[#33589c]/10 dark:text-blue-400"
                >
                    <Wallet size={18} className="mr-1" /> Cajas Diarias
                </Button>
            </Flex>
        </Flex>
    )
}