"use client"
import { Dialog, Button, Flex } from "@radix-ui/themes"   
import { useState } from "react"
import toast from "react-hot-toast" // Reemplazamos los alerts por toast
import { procesarVentaAction } from "../admin/sales.action"

interface CartItem {
    idProducto: string;
    cantidad: number;
    precioUnitario: number;
}

interface ButtonCheckOutProps{
    subTotal: string;
    items: CartItem[]; 
    idCaja: number;    
    onClearCart: () => void
}

export default function ButtonCheckOut({subTotal, items, idCaja, onClearCart}: ButtonCheckOutProps){
    
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleCompleteSale = async (methodKey: string) => {
        if (!items || items.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }

        setLoading(true);

        try {
            const respuesta = await procesarVentaAction({
                idCaja: idCaja || 1, // Recordá que este id_caja tiene que existir en public.cajas_diarias por tu FOREIGN KEY
                tipoMedio: methodKey,
                items: items
            });

            if (respuesta && 'error' in respuesta) {
                toast.error(`Error: ${respuesta.error}`);
            } else {
                toast.success(`¡Venta realizada con éxito!`);
                onClearCart();
                setIsCheckoutOpen(false);
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado al procesar el pago.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Si no hay items, mostramos un botón deshabilitado que NO abre el modal */}
            {items.length === 0 ? (
                <Button 
                    size="4" 
                    variant="solid"
                    disabled
                    className="w-full mt-6 transition-all duration-200 border-2 border-[#589c33] bg-[#589c33] text-white disabled:opacity-50"
                >
                    Realizar Venta
                </Button>
            ) : (
                <Dialog.Root open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <Dialog.Trigger>
                        <Button 
                            size="4" 
                            variant="solid"
                            className="w-full mt-6 cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-[#589c33] bg-[#589c33] text-white hover:bg-white hover:text-[#589c33] dark:hover:bg-gray-800"
                        >
                            Realizar Venta
                        </Button>
                    </Dialog.Trigger>

                    <Dialog.Content style={{ maxWidth: 450 }} className="bg-white dark:bg-gray-800 border-2 border-[#33589c] p-6 rounded-lg">
                        <Dialog.Title className="text-[#33589c] dark:text-white text-xl font-bold mb-2">
                            Seleccionar Medio de Pago
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                            Total a cobrar: <span className="font-bold text-[#589c33] text-base">{subTotal}</span>
                        </Dialog.Description>

                        <Flex direction="column" gap="3">
                            <Button 
                                size="3" 
                                variant="outline" 
                                disabled={loading}
                                onClick={() => handleCompleteSale("efectivo")}
                                className="cursor-pointer border-2 border-[#33589c] text-[#33589c] dark:text-white hover:bg-[#33589c] hover:text-white justify-center font-medium"
                            >
                                💵 Efectivo
                            </Button>

                            <Button 
                                size="3" 
                                variant="outline" 
                                disabled={loading}
                                onClick={() => handleCompleteSale("cuentaDni")} 
                                className="cursor-pointer border-2 border-[#33589c] text-[#33589c] dark:text-white hover:bg-[#33589c] hover:text-white justify-center font-medium"
                            >
                                🔵 Cuenta DNI
                            </Button>
                            
                            <Button 
                                size="3" 
                                variant="outline" 
                                disabled={loading}
                                onClick={() => handleCompleteSale("qr/mercadopago")}
                                className="cursor-pointer border-2 border-[#33589c] text-[#33589c] dark:text-white hover:bg-[#33589c] hover:text-white justify-center font-medium"
                            >
                                📱 QR / Mercado Pago
                            </Button>

                            <Button 
                                size="3" 
                                variant="outline" 
                                disabled={loading}
                                onClick={() => handleCompleteSale("transferencia")}
                                className="cursor-pointer border-2 border-[#33589c] text-[#33589c] dark:text-white hover:bg-[#33589c] hover:text-white justify-center font-medium"
                            >
                                🏦 Transferencia (Alias)
                            </Button>

                            <Button 
                                size="3" 
                                variant="outline" 
                                disabled={loading}
                                onClick={() => handleCompleteSale("tarjeta")}
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
                                    disabled={loading}
                                    className="cursor-pointer text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                                >
                                    Cancelar
                                </Button>
                            </Dialog.Close>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>
            )}
        </>
    )
}