import { Dialog, Button, Flex } from "@radix-ui/themes"   
import { useState } from "react"
interface ButtonCheckOutProps{
    subTotal: string;
    onClearCart: ()=>void
}

export default function ButtonCheckOut({subTotal, onClearCart}: ButtonCheckOutProps){
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const handleCompleteSale= (method:string)=>{
        alert(`Venta realizada con exito por ${method}!`)
        onClearCart()
        setIsCheckoutOpen(false)
    }

    return <>
    {/* Botón de Checkout que abre el Modal de Cobro */}
        <Dialog.Root open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <Dialog.Trigger >
                <Button 
                    size="4" 
                    variant="solid"
                    className="w-full mt-6 cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-[#589c33] bg-[#589c33] text-white hover:bg-white hover:text-[#589c33] dark:hover:bg-gray-800"
                >
                    CHECKOUT
                </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }} className="bg-white dark:bg-gray-800 border-2 border-[#33589c] p-6 rounded-lg">
                <Dialog.Title className="text-[#33589c] dark:text-white text-xl font-bold mb-2">
                    Seleccionar Medio de Pago
                </Dialog.Title>
                <Dialog.Description className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    Total a cobrar: <span className="font-bold text-[#589c33] text-base">{subTotal}</span>
                </Dialog.Description>

                {/* Opciones de pago */}
                <Flex direction="column" gap="3">
                    <Button 
                        size="3" 
                        variant="outline" 
                        onClick={() => handleCompleteSale("Efectivo")}
                        className="cursor-pointer border-2 border-[#33589c] text-[#33589c] dark:text-white hover:bg-[#33589c] hover:text-white justify-center font-medium"
                    >
                        💵 Efectivo
                    </Button>
                    
                    <Button 
                        size="3" 
                        variant="outline" 
                        onClick={() => handleCompleteSale("QR / Mercado Pago")}
                        className="cursor-pointer border-2 border-[#33589c] text-[#33589c] dark:text-white hover:bg-[#33589c] hover:text-white justify-center font-medium"
                    >
                        📱 QR / Mercado Pago
                    </Button>

                    <Button 
                        size="3" 
                        variant="outline" 
                        onClick={() => handleCompleteSale("Transferencia (Alias)")}
                        className="cursor-pointer border-2 border-[#33589c] text-[#33589c] dark:text-white hover:bg-[#33589c] hover:text-white justify-center font-medium"
                    >
                        🏦 Transferencia (Alias)
                    </Button>

                    <Button 
                        size="3" 
                        variant="outline" 
                        onClick={() => handleCompleteSale("Tarjeta (Débito/Crédito)")}
                        className="cursor-pointer border-2 border-[#33589c] text-[#33589c] dark:text-white hover:bg-[#33589c] hover:text-white justify-center font-medium"
                    >
                        💳 Tarjeta
                    </Button>
                </Flex>

                <Flex gap="3" mt="6" justify="end">
                    <Dialog.Close>
                        <Button 
                            variant="soft" 
                            color="gray"
                            className="cursor-pointer text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                        >
                            Cancelar
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    </>
}