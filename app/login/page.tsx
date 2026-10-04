"use client"
import { TextField, Button, Flex, Heading, Callout, Text } from "@radix-ui/themes"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { User, Lock, Store, ArrowRight } from "lucide-react" 
import { useLogin } from "@/app/hooks/useLogin"
import Link from "next/link"
import { useRandomBackground } from "../hooks/useRandomBackground"

export default function Login() {
    const { 
        handleLogin, 
        errorMsg, 
        loading, 
        inputUsername, 
        setInputUsername, 
        inputPassword, 
        setInputPassword 
    } = useLogin()

    const { currentBg, isVisible } = useRandomBackground()

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-950 font-sans">
            
            {/* --- LADO IZQUIERDO: Imagen dinámica y Branding --- */}
            <div className="hidden lg:flex w-1/2 relative bg-[#1a2b4c] overflow-hidden">
                
                {/* Imagen de fondo con transición suave */}
                <div 
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-50' : 'opacity-0'}`}
                    style={{ backgroundImage: `url(${currentBg})` }}
                />
                
                {/* Degradado oscuro sobre la imagen para que el texto siempre se lea bien */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#33589c]/60 to-transparent" />

                {/* Contenido sobre la imagen */}
                <div className="relative z-10 flex flex-col justify-between w-full h-full p-14 text-white">
                    <Flex align="center" gap="2">
                        <Store className="text-white" size={32} />
                        <Heading size="6" className="font-extrabold tracking-tight">
                            MiKiosco
                        </Heading>
                    </Flex>
                    
                    <div>
                        <Heading size="8" className="font-bold leading-tight mb-4">
                            Llevá tu negocio <br/> al próximo nivel.
                        </Heading>
                        <Text size="3" className="text-gray-200 max-w-md block">
                            Tu inventario, tus ventas y tus cajas organizadas en un sistema rápido, seguro y fácil de usar.
                        </Text>
                    </div>
                </div>
            </div>

            {/* --- LADO DERECHO: Formulario de Login --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
                
                <div className="w-full max-w-[400px]">
                    
                    {/* Botón flotante para volver a la landing en mobile */}
                    <div className="absolute top-6 right-6 lg:top-10 lg:right-10">
                        <Link href="/landingPage" className="text-sm font-medium flex items-center gap-2 text-gray-500 hover:text-[#33589c] transition-colors">
                            Volver al inicio <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <Heading size="7" className="text-gray-900 dark:text-white mb-2 font-bold">
                            Ingreso al Sistema
                        </Heading>
                        <Text size="3" className="text-gray-500 dark:text-gray-400">
                            Por favor, identificáte para continuar.
                        </Text>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        
                        {errorMsg && (
                            <Callout.Root color="crimson" size="1" className="mb-2">
                                <Callout.Icon><InfoCircledIcon /></Callout.Icon>
                                <Callout.Text>{errorMsg}</Callout.Text>
                            </Callout.Root>
                        )}
                        
                        <Flex direction="column" gap="4">
                            <div>
                                <TextField.Root 
                                    size="3"
                                    radius="large"
                                    disabled={loading}
                                    value={inputUsername} 
                                    onChange={(e) => setInputUsername(e.target.value)} 
                                    placeholder="Usuario"
                                    required
                                    className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 focus-within:border-[#33589c]"
                                >
                                    <TextField.Slot>
                                        <User size={18} className="text-gray-400" />
                                    </TextField.Slot>
                                </TextField.Root>
                            </div>

                            <div>
                                <TextField.Root 
                                    size="3"
                                    radius="large"
                                    disabled={loading}
                                    value={inputPassword} 
                                    onChange={(e) => setInputPassword(e.target.value)} 
                                    placeholder="Contraseña" 
                                    type="password"
                                    required
                                    className="h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 focus-within:border-[#33589c]"
                                >
                                    <TextField.Slot>
                                        <Lock size={18} className="text-gray-400" />
                                    </TextField.Slot>
                                </TextField.Root>
                            </div>
                        </Flex>

                        <Flex justify="end">
                            <Link href="/recuperar" className="text-sm font-medium text-[#33589c] hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </Flex>

                        <Button 
                            type="submit"
                            size="4"
                            radius="large"
                            disabled={loading}
                            className="w-full mt-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-[#33589c] to-[#255286] text-white hover:shadow-lg font-bold h-12"
                        >
                            {loading ? "Entrando..." : "Iniciar Sesión"}
                        </Button>
                    </form>
                </div>
            </div>
        </div> 
    )
}