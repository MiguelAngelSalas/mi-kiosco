"use client"

import { Button, Flex, Text, TextField, Callout, Dialog, IconButton } from "@radix-ui/themes"
import { AlertCircle, UserPlus, X, Save, Loader2 } from "lucide-react"
import { useCreateUserModal } from "../hooks/useCreateUserModal"

export default function CreateUserModal() {
   const {open,errorMsg,loading,rolSeleccionado,setRolSeleccionado,handleSubmit, handleOpenChange} = useCreateUserModal()

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            {/* --- BOTÓN DISPARADOR (Se ve en el AdminPanel) --- */}
            <Dialog.Trigger>
                <Button 
                    size="3" 
                    radius="large"
                    className="cursor-pointer bg-white text-[#33589c] border-2 border-[#33589c]/20 hover:bg-[#33589c]/10 dark:bg-transparent dark:border-[#33589c]/50 dark:hover:bg-[#33589c]/20 shadow-sm h-12 px-5 transition-all"
                >
                    <UserPlus size={18} className="mr-1" /> Nuevo Empleado
                </Button>
            </Dialog.Trigger>

            {/* --- CONTENEDOR DEL MODAL --- */}
            <Dialog.Content maxWidth="450px" className="!p-0 border border-gray-300 dark:border-gray-700 shadow-2xl rounded-2xl bg-white dark:bg-gray-900 overflow-hidden font-sans">
                
                {/* --- HEADER DEL MODAL --- */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                    <Flex align="center" gap="2">
                        <UserPlus className="text-[#33589c]" size={22} />
                        <Dialog.Title className="text-gray-900 dark:text-white font-bold m-0 text-lg">
                            Crear Nuevo Usuario
                        </Dialog.Title>
                    </Flex>
                    <Dialog.Close>
                        <IconButton 
                            type="button"
                            variant="ghost" 
                            color="gray" 
                            disabled={loading}
                            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                        >
                            <X size={20} />
                        </IconButton>
                    </Dialog.Close>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* --- CUERPO DEL MODAL --- */}
                    <div className="p-6 flex flex-col gap-5">
                        <Dialog.Description size="2" className="text-gray-600 dark:text-gray-400 m-0 leading-relaxed">
                            Completá los datos para darle acceso a un nuevo cajero o administrador al sistema.
                        </Dialog.Description>

                        {errorMsg && (
                            <Callout.Root color="red" size="1" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg">
                                <Callout.Icon>
                                    <AlertCircle size={16} />
                                </Callout.Icon>
                                <Callout.Text>{errorMsg}</Callout.Text>
                            </Callout.Root>
                        )}

                        <div>
                            <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">
                                Nombre de Usuario *
                            </Text>
                            <TextField.Root 
                                name="nombre" 
                                required 
                                placeholder="Ej: juan_cajero" 
                                size="3" 
                                radius="large"
                                disabled={loading}
                                autoFocus
                                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                            />
                        </div>

                        <div>
                            <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">
                                Contraseña *
                            </Text>
                            <TextField.Root 
                                name="password" 
                                type="password" 
                                required 
                                placeholder="••••••••" 
                                size="3" 
                                radius="large"
                                disabled={loading}
                                className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                            />
                        </div>

                        <div>
                            <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">
                                Rol *
                            </Text>
                            <select 
                                name="rol"
                                value={rolSeleccionado}
                                onChange={(e) => setRolSeleccionado(e.target.value)}
                                disabled={loading}
                                className="w-full h-[40px] px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm shadow-sm focus:outline-none focus:border-[#33589c] focus:ring-1 focus:ring-[#33589c] transition-all disabled:opacity-50"
                            >
                                <option value="0">Cajero</option>
                                <option value="1">Administrador</option>
                            </select>
                        </div>
                    </div>

                    {/* --- FOOTER DEL MODAL --- */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                        <Dialog.Close>
                            <Button 
                                type="button"
                                variant="soft" 
                                color="gray" 
                                disabled={loading} 
                                className="cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shadow-sm"
                            >
                                Cancelar
                            </Button>
                        </Dialog.Close>
                        <Button 
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b] shadow-sm"
                        >
                            {loading ? (
                                <><Loader2 size={16} className="animate-spin mr-1" /> Registrando...</>
                            ) : (
                                <><Save size={16} className="mr-1" /> Crear Usuario</>
                            )}
                        </Button>
                    </div>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    )
}