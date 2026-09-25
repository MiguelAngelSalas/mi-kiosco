"use client"
import { Dialog, Button, Flex, TextField, Text } from "@radix-ui/themes"
import { useState } from "react"
import toast from "react-hot-toast"
import { abrirCajaAction } from "../actions/cajas.action" // Ajustá la ruta

interface AbrirCajaProps {
    userId: number;
    onCajaAbierta: (idCaja: number) => void;
}

export default function AbrirCajaModal({ userId, onCajaAbierta }: AbrirCajaProps) {
    const [monto, setMonto] = useState("")
    const [loading, setLoading] = useState(false)

    const handleAbrir = async () => {
        const montoNum = Number(monto)
        if (isNaN(montoNum) || montoNum < 0) {
            toast.error("Ingresá un monto válido")
            return
        }

        setLoading(true)
        const res = await abrirCajaAction(userId, montoNum)
        
        if (res.error) {
            toast.error(res.error)
        } else if (res.id_caja) {
            toast.success("Caja abierta exitosamente")
            onCajaAbierta(res.id_caja)
        }
        setLoading(false)
    }

    // Usamos open={true} para obligarlo a abrirla si no hay caja
    return (
        <Dialog.Root open={true}>
            <Dialog.Content style={{ maxWidth: 400 }}>
                <Dialog.Title>Abrir Turno / Caja</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Ingresá el monto inicial en efectivo (cambio) con el que empezás el turno.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">Monto Inicial ($)</Text>
                        <TextField.Root 
                            type="number" 
                            placeholder="Ej: 5000" 
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                        />
                    </label>
                    <Button mt="4" onClick={handleAbrir} disabled={loading || !monto}>
                        {loading ? "Abriendo..." : "Abrir Caja"}
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}