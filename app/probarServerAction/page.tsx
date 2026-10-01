"use client"
import { Link } from "@radix-ui/themes"
// ⚠️ IMPORTANTE: Ajustá esta ruta al archivo donde creaste la función (ej: product.actions.ts)
import { addProductAction } from "../admin/actions" 

export default function LandingPage() {

    const probarServerAction = async () => {
        console.log("Enviando petición de prueba...")
        
        // Armamos el FormData asegurándonos de usar los nombres exactos que espera la DB
        const formDataFalso = new FormData()
    
        formDataFalso.append("nombre", "Alfajor de Prueba")
      
        formDataFalso.append("precioVenta", "1500") 
        formDataFalso.append("precioCosto", "800")
   

        // Ejecutamos la acción
        const respuesta = await addProductAction(formDataFalso)
        
        // Vemos qué contestó el backend en la consola (F12)
        console.log("Respuesta del servidor:", respuesta)
    }

    return (
        <div className="flex flex-col items-center justify-center gap-8 p-10 h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
            
            {/* Main Brand / Logo */}
            <Link 
                href="/landingPage" 
                size="6" 
                weight="bold"
                className="flex justify-center text-pretty rounded py-4 px-8 shadow-lg transition-all duration-300 hover:scale-105 border-[3px] border-[#33589c] text-[#33589c] dark:text-white bg-white dark:bg-gray-800 hover:bg-[#33589c] hover:text-white dark:hover:bg-[#33589c]"
            >
                My Kiosco
            </Link>

            {/* Actions Container */}
            <div className="flex flex-row items-center justify-center gap-6 rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg border-2 border-[#33589c] bg-white dark:bg-gray-800">
                
                <Link 
                    href="/login" 
                    size="4" 
                    weight="medium"
                    className="flex justify-center w-full text-pretty rounded py-2 px-6 shadow-sm transition-all duration-200 hover:scale-105 border-2 border-[#589c33] text-[#589c33] dark:text-white bg-white dark:bg-gray-800 hover:bg-[#589c33] hover:text-white dark:hover:bg-[#589c33]"
                >
                    Login
                </Link>

                <Link 
                    href="/createUser" 
                    size="4" 
                    weight="medium"
                    className="flex justify-center w-full text-pretty rounded py-2 px-6 shadow-sm transition-all duration-200 hover:scale-105 border-2 border-[#9d3358] text-[#9d3358] dark:text-white bg-white dark:bg-gray-800 hover:bg-[#9d3358] hover:text-white dark:hover:bg-[#9d3358]"
                >
                    Create User
                </Link>
                
            </div>
            
            {/* 🔥 BOTÓN DE PRUEBA 🔥 */}
            <button 
                onClick={probarServerAction}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white py-3 px-6 font-bold rounded-lg mt-8 shadow-lg transition-transform hover:scale-105"
            >
                PROBAR BACKEND
            </button>
            
        </div>
    )
}