"use client"
import { Button, Flex, Heading, Text } from "@radix-ui/themes"
import { Store, LogIn, CheckCircle2, ArrowRight } from "lucide-react" 
import Link from "next/link"
import { useRandomBackground } from "@/app/hooks/useRandomBackground" // Ajustá la ruta a tu carpeta de hooks


export default function LandingPage() {
    // 👇 Toda la lógica compleja se resume en esta sola línea
    const { currentBg, isVisible } = useRandomBackground()

    return (
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-950 font-sans">
            
            {/* --- LADO IZQUIERDO: Imagen dinámica --- */}
            <div className="hidden lg:flex w-1/2 relative bg-[#1a2b4c] overflow-hidden">
                <div 
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-50' : 'opacity-0'}`}
                    style={{ backgroundImage: `url(${currentBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#33589c]/60 to-transparent" />

                <div className="relative z-10 flex flex-col justify-end w-full h-full p-14 text-white">
                    <Heading size="8" className="font-bold leading-tight mb-4">
                        El sistema definitivo <br/> para tu comercio.
                    </Heading>
                    <Text size="3" className="text-gray-200 max-w-md block">
                        Diseñado específicamente para agilizar la atención al público y mantener tus números claros.
                    </Text>
                </div>
            </div>

            {/* --- LADO DERECHO: Presentación y Call to Action --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 xl:p-20 relative">
                
                <div className="w-full max-w-[480px] mx-auto lg:mx-0">
                    
                    {/* Header / Logo */}
                    <Flex align="center" gap="3" className="mb-12">
                        <div className="bg-[#33589c] p-3 rounded-xl text-white shadow-lg">
                            <Store size={28} />
                        </div>
                        <Heading size="7" className="font-extrabold text-[#33589c] dark:text-white tracking-tight">
                            MiKiosco
                        </Heading>
                    </Flex>

                    {/* Value Proposition */}
                    <div className="mb-10">
                        <Heading size="8" className="text-gray-900 dark:text-white mb-4 font-bold tracking-tight leading-tight">
                            Gestión simple, <br/> ventas rápidas.
                        </Heading>
                        <Text size="4" className="text-gray-500 dark:text-gray-400 leading-relaxed">
                            Centralizá tu inventario, controlá los accesos de tus cajeros y visualizá tus ganancias en tiempo real con una interfaz moderna e intuitiva.
                        </Text>
                    </div>

                    {/* Features List */}
                    <Flex direction="column" gap="4" className="mb-12">
                        {[
                            "Punto de venta optimizado para códigos de barra",
                            "Control de stock y categorías de productos",
                            "Sistema de roles (Administrador y Cajero)",
                            "Almacenamiento seguro en la nube"
                        ].map((feature, idx) => (
                            <Flex key={idx} align="center" gap="3">
                                <CheckCircle2 size={20} className="text-[#33589c] flex-shrink-0" />
                                <Text size="3" className="text-gray-700 dark:text-gray-300 font-medium">
                                    {feature}
                                </Text>
                            </Flex>
                        ))}
                    </Flex>

                    {/* Call to Actions */}
                    <Flex direction="column"  gap="4">
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button 
                                size="4"
                                radius="large"
                                className="w-full cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-[#33589c] to-[#255286] text-white hover:shadow-lg font-bold h-14 px-8 text-base"
                            >
                                <LogIn size={20} className="mr-2" />
                                Iniciar Sesión
                            </Button>
                        </Link>
                        
                        <Link href="#caracteristicas" className="w-full sm:w-auto">
                            <Button 
                                size="4"
                                variant="surface"
                                radius="large"
                                color="gray"
                                className="w-full cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold h-14 px-8 text-base"
                            >
                                Saber más <ArrowRight size={20} className="ml-2" />
                            </Button>
                        </Link>
                    </Flex>
                </div>
            </div>
        </div> 
    )
}