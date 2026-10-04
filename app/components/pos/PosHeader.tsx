import { Heading, Button, Flex, Text } from "@radix-ui/themes"
import { Store, UserCircle, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface PosHeaderProps {
    userRole: string
}

export default function PosHeader({ userRole }: PosHeaderProps) {
    const router = useRouter()

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b-2 border-gray-300 dark:border-gray-800">
            <Flex align="center" gap="3">
                <div className="bg-[#33589c] p-2.5 rounded-xl text-white shadow-md">
                    <Store size={24} />
                </div>
                <div>
                    <Heading as="h1" size="6" className="text-gray-900 dark:text-white font-bold tracking-tight">
                        Punto de Venta
                    </Heading>
                    <Text size="2" className="text-gray-600 dark:text-gray-400 font-medium">Mostrador activo</Text>
                </div>
            </Flex>
            
            <Flex align="center" gap="4" wrap="wrap">
                <Flex align="center" gap="2" className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-800 shadow-sm">
                    <UserCircle size={18} className="text-gray-500" />
                    <Text className="text-gray-700 dark:text-gray-300 font-bold text-sm">
                        <span className="capitalize">{userRole || "Usuario"}</span>
                    </Text>
                </Flex>

                <div className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-bold border border-green-300 dark:border-green-800/50 flex items-center gap-1 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Caja Habilitada
                </div>
                
                {userRole === "administrador" && (
                    <Button 
                        size="3"
                        variant="surface"
                        className="cursor-pointer transition-all duration-200 text-[#33589c] bg-white border border-gray-300 hover:bg-gray-50 shadow-sm dark:bg-transparent dark:border-transparent dark:hover:bg-[#33589c]/10"
                        onClick={() => router.push("/AdminPage")}
                    >
                        <Settings size={18} className="mr-1" /> Panel Admin
                    </Button>
                )}
                
                <Button 
                    size="3"
                    variant="soft"
                    color="red"
                    className="cursor-pointer transition-all duration-200 hover:bg-red-200 bg-red-100 text-red-700 shadow-sm border border-red-200 dark:border-transparent dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    onClick={() => {
                        localStorage.removeItem("rolUsuario")
                        localStorage.removeItem("token")
                        toast.success("Sesión cerrada")
                        router.push("/login")
                    }}
                >
                    <LogOut size={18} className="mr-1" /> Salir
                </Button>
            </Flex>
        </div>
    )
}