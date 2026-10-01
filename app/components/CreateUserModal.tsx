"use client"

import { Button, Flex, Text, TextField, Callout, Dialog } from "@radix-ui/themes"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { registerUserAction } from "../admin/actions"
import { useState } from "react"
import toast from "react-hot-toast"

export default function CreateUserModal() {
    // Estado para controlar si el modal está abierto o cerrado
    const [open, setOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [rolSeleccionado, setRolSeleccionado] = useState("0") // Por defecto Cajero

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrorMsg(null)
        setLoading(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        try {
            const respuesta = await registerUserAction(formData)

            if (respuesta?.error) {
                setErrorMsg(respuesta.error)
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            toast.success("Usuario creado exitosamente")
            form.reset()          // Limpia los inputs de texto del HTML
            setRolSeleccionado("0") // Vuelve el select a Cajero
            setLoading(false)     // Habilita los botones de nuevo
            setOpen(false)        // Cierra el modal // Cerramos el modal automáticamente tras el éxito
            
            // Opcional: Acá podrías disparar un router.refresh() si tenés una tabla de usuarios detrás
            
        } catch (err: any) {
            if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
                toast.success("Usuario creado exitosamente")
                setOpen(false)
                throw err
            }

            const errorMessage = err?.message || "Ocurrió un error inesperado al registrar"
            setErrorMsg(errorMessage)
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    // Limpia el formulario si el usuario cierra el modal a mano
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            setErrorMsg(null)
            setLoading(false)
            setRolSeleccionado("0")
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            {/* Este es el botón que va a estar visible en tu panel para abrir el modal */}
            <Dialog.Trigger>
                <Button size="3" className="cursor-pointer bg-[#33589c] text-white hover:bg-[#254275] transition-colors">
                    + Nuevo Empleado
                </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px" className="border-2 border-[#33589c] rounded-xl bg-white dark:bg-gray-800">
                <Dialog.Title className="text-[#33589c] dark:text-white">
                    Crear Nuevo Usuario
                </Dialog.Title>
                <Dialog.Description size="2" mb="4" className="text-gray-500 dark:text-gray-400">
                    Completá los datos para darle acceso a un nuevo cajero al sistema.
                </Dialog.Description>

                {errorMsg && (
                    <Callout.Root color="crimson" size="1" mb="4">
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>{errorMsg}</Callout.Text>
                    </Callout.Root>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Nombre de Usuario
                        </Text>
                        <TextField.Root 
                            name="nombre" 
                            required 
                            placeholder="Ej: juan_cajero" 
                            size="3" 
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Contraseña
                        </Text>
                        <TextField.Root 
                            name="password" 
                            type="password" 
                            required 
                            placeholder="••••••••" 
                            size="3" 
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Rol
                        </Text>
                        <select 
                            name="rol"
                            value={rolSeleccionado}
                            onChange={(e) => setRolSeleccionado(e.target.value)}
                            disabled={loading}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#33589c] text-sm disabled:opacity-50"
                        >
                            <option value="0">Cajero</option>
                            <option value="1">Administrador</option>
                        </select>
                    </div>

                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray" disabled={loading} className="cursor-pointer">
                                Cancelar
                            </Button>
                        </Dialog.Close>
                        <Button 
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer bg-[#9d3358] text-white hover:bg-[#7d2645] transition-colors"
                        >
                            {loading ? "Registrando..." : "Crear Usuario"}
                        </Button>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    )
}