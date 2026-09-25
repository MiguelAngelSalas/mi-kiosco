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
        } catch (err: any) {
            if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
                toast.success("Usuario creado exitosamente")
                throw err
            }

            const errorMessage = err?.message || "Ocurrió un error inesperado al registrar"
            setErrorMsg(errorMessage)
            toast.error(errorMessage)
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
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Nombre de Usuario
                        </Text>
                        <TextField.Root 
                            name="nombre" 
                            required 
                            placeholder="Ej: miguel" 
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
                            disabled={loading}
                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#33589c] text-sm disabled:opacity-50"
                        >
                            <option value="0">Cajero (0)</option>
                            <option value="1">Administrador (1)</option>
                        </select>
                    </div>

                    <Button 
                        type="submit"
                        size="3"
                        disabled={loading}
                        className="cursor-pointer bg-[#9d3358] text-white hover:bg-[#7d2645] mt-2 w-full transition-colors"
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