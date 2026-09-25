"use client"
import { Dialog, Button, Flex, TextField, Text } from "@radix-ui/themes"
import { useState } from "react"
import toast from "react-hot-toast"

interface AbrirCajaProps {
    userId?: number;
    onCajaAbierta: (idCaja: number) => void;
}

export default function AbrirCajaModal({ onCajaAbierta }: AbrirCajaProps) {
    const [monto, setMonto] = useState("")
    const [loading, setLoading] = useState(false)

    const handleAbrir = () => {
        const montoNum = Number(monto)
        if (isNaN(montoNum) || montoNum < 0) {
            toast.error("Ingresá un monto válido")
            return
        }

        setLoading(true)
        
        // Simulamos un breve tiempo de carga
        setTimeout(() => {
            toast.success(`Caja abierta con $${montoNum}`)
            onCajaAbierta(Date.now()) // Generamos un ID local temporal
            setLoading(false)
        }, 500)
    }

    return (
        <Dialog.Root open={true}>
            <Dialog.Content style={{ maxWidth: 400 }} className="bg-white dark:bg-gray-800 border-2 border-[#33589c]">
                <Dialog.Title className="text-[#33589c] dark:text-white">
                    Abrir Turno / Caja
                </Dialog.Title>
                <Dialog.Description size="2" mb="4" className="text-gray-500 dark:text-gray-400">
                    Ingresá el monto inicial en efectivo (cambio) con el que empezás el turno.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold" className="text-gray-700 dark:text-gray-300">
                            Monto Inicial ($)
                        </Text>
                        <TextField.Root 
                            type="number" 
                            placeholder="Ej: 5000" 
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            disabled={loading}
                        />
                    </label>
                    <Button 
                        mt="4" 
                        onClick={handleAbrir} 
                        disabled={loading || !monto}
                        className="cursor-pointer bg-[#589c33] text-white hover:bg-[#467d28]"
                    >
                        {loading ? "Abriendo..." : "Abrir Caja"}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}