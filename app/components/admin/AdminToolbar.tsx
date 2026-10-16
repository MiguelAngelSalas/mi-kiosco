import { Button, Flex, TextField, Dialog } from "@radix-ui/themes"
import { Search, Plus, Wallet, Barcode } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"
import CreateUserModal from "../CreateUserModal" 
import BarcodeScanner from "../BarcodeScanner" // Asegurate de que la ruta sea correcta

interface AdminToolbarProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    onOpenAddProduct: () => void
}

export default function AdminToolbar({ searchTerm, setSearchTerm, onOpenAddProduct }: AdminToolbarProps) {
    const [isScannerOpen, setIsScannerOpen] = useState(false)

    // Esta función la llama el escáner cuando lee un código
    const handleScanSuccess = (codigoLeido: string) => {
        setSearchTerm(codigoLeido) // Escribe el código en tu barra de búsqueda
        setIsScannerOpen(false)    // Cierra el modal de la cámara
        toast.success("Código detectado", { icon: "📷" })
    }

    return (
        <Flex direction={{ initial: "column", md: "row" }} gap="4" align={{ md: "center" }} justify="between">
            <Flex gap="2" className="w-full md:w-[450px]">
                <div className="relative w-full">
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

                {/* BOTÓN Y MODAL DEL ESCÁNER */}
                <Dialog.Root open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                    <Dialog.Trigger>
                        <Button 
                            size="3" 
                            variant="soft" 
                            className="cursor-pointer h-14 px-4 bg-blue-50 text-[#33589c] hover:bg-blue-100 border-2 border-transparent shadow-sm dark:bg-[#33589c]/20 dark:text-blue-400"
                            title="Escanear código de barras"
                        >
                            <Barcode size={24} />
                        </Button>
                    </Dialog.Trigger>
                    
                    <Dialog.Content style={{ maxWidth: 450 }} className="rounded-2xl">
                        <Dialog.Title className="text-xl font-bold mb-2">Escanear Producto</Dialog.Title>
                        <Dialog.Description size="2" mb="4" color="gray">
                            Apuntá el código de barras del producto hacia la cámara para buscarlo en el inventario.
                        </Dialog.Description>
                        
                        {/* Renderizamos la cámara solo cuando el modal está abierto */}
                        {isScannerOpen && (
                            <BarcodeScanner onScan={handleScanSuccess} />
                        )}
                        
                        <Flex justify="end" mt="4">
                            <Dialog.Close>
                                <Button variant="soft" color="gray" className="cursor-pointer">
                                    Cancelar
                                </Button>
                            </Dialog.Close>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            </Flex>
            
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