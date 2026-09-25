"use client"
import { Heading, Card, Button, Flex, Text, TextField, Callout } from "@radix-ui/themes"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { registerUserAction } from "../admin/actions"
import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"

export default function CreateUserPage() {
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrorMsg(null)
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        
        try {
            const respuesta = await registerUserAction(formData)
            
            // Verificamos si la acción nos devolvió un error controlado (ej: email duplicado)
            if (respuesta && respuesta.error) {
                setErrorMsg(respuesta.error)
                toast.error(respuesta.error)
                setLoading(false)
                return // Cortamos la ejecución acá
            }

        } catch (err: any) {
            // Si es la redirección de Next.js, significa que todo salió bien
            if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
                toast.success("Usuario creado exitosamente")
                throw err 
            }
            
            // Si ocurre un error fatal del servidor
            const errorMessage = err.message || "Ocurrió un error inesperado al registrar"
            setErrorMsg(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            <Card className="w-full max-w-md border-2 border-[#33589c] bg-white dark:bg-gray-800 p-8 shadow-xl rounded-lg">
                <Heading size="6" className="text-[#33589c] dark:text-white mb-6 text-center">
                    Crear Nuevo Usuario
                </Heading>

                {errorMsg && (
                    <Callout.Root color="crimson" size="1" mb="4">
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>{errorMsg}</Callout.Text>
                    </Callout.Root>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Nombre
                            </Text>
                            <TextField.Root name="nombre" required placeholder="Ej: Carlos" size="3" />
                        </div>
                        <div className="w-1/2">
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Apellido
                            </Text>
                            <TextField.Root name="apellido" required placeholder="Ej: Gómez" size="3" />
                        </div>
                    </div>

                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Correo Electrónico (Email)
                        </Text>
                        <TextField.Root name="email" type="email" required placeholder="cajero@kiosco.com" size="3" />
                    </div>

                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Teléfono (Opcional)
                        </Text>
                        <TextField.Root name="telefono" placeholder="11 1234 5678" size="3" />
                    </div>

                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Contraseña
                        </Text>
                        <TextField.Root name="password" type="password" required placeholder="••••••••" size="3" />
                    </div>

                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Rol
                        </Text>
                        <select 
                            name="rol"
                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#33589c] text-sm"
                        >
                            <option value="cajero">Cajero</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>

                    <Button 
                        type="submit"
                        size="3"
                        disabled={loading}
                        className="cursor-pointer bg-[#9d3358] text-white hover:bg-[#7d2645] mt-2 w-full"
                    >
                        {loading ? "Registrando..." : "Registrar"}
                    </Button>
                </form>

                <Flex justify="center" mt="4">
                    <Link href="/login" className="text-sm text-[#33589c] dark:text-blue-400 hover:underline">
                        ¿Ya tenés cuenta? Iniciar sesión
                    </Link>
                </Flex>
            </Card>
        </div>
    )
}