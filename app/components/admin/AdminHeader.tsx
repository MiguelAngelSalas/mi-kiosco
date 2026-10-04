import { Heading, Button, Flex, Text } from "@radix-ui/themes"
import { LayoutDashboard, Store, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function AdminHeader() {
    const router = useRouter()

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b-2 border-gray-300 dark:border-gray-800">
            <Flex align="center" gap="3">
                <div className="bg-[#33589c] p-2.5 rounded-xl text-white shadow-md">
                    <LayoutDashboard size={24} />
                </div>
                <div>
                    <Heading as="h1" size="6" className="text-gray-900 dark:text-white font-bold tracking-tight">
                        Panel de Administración
                    </Heading>
                    <Text size="2" className="text-gray-600 dark:text-gray-400 font-medium">Gestión centralizada del kiosco</Text>
                </div>
            </Flex>

            <Flex gap="3" wrap="wrap">
                <Button 
                    size="3"
                    className="cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg bg-[#33589c] text-white hover:bg-[#28467b]"
                    onClick={() => router.push("/CheckoutMenu")}
                >
                    <Store size={18} className="mr-1" />
                    Ir al Mostrador
                </Button>
                <Button 
                    size="3"
                    variant="soft" 
                    color="red"
                    className="cursor-pointer transition-all duration-200 hover:bg-red-200 bg-red-100 text-red-700 shadow-sm border border-red-200 dark:border-transparent dark:hover:bg-red-900/30 dark:text-red-400"
                    onClick={() => {
                        localStorage.removeItem("rolUsuario")
                        toast.success("Sesión cerrada")
                        router.push("/login")
                    }}
                >
                    <LogOut size={18} className="mr-1" />
                    Salir
                </Button>
            </Flex>
        </div>
    )
}