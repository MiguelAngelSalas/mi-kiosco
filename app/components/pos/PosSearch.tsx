import { TextField } from "@radix-ui/themes"
import { Search, Barcode, Loader2 } from "lucide-react"
import { Product } from "@/app/hooks/useCart"
import { ChangeEvent, KeyboardEvent, RefObject } from "react"

interface PosSearchProps {
    searchTerm: string
    handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void
    handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
    loadingData: boolean
    searchContainerRef: RefObject<HTMLDivElement | null>
    productosFiltrados: Product[]
    selectedIndex: number
    handleSelectProduct: (producto: Product) => void
}

export default function PosSearch({
    searchTerm, handleSearchChange, handleKeyDown, loadingData,
    searchContainerRef, productosFiltrados, selectedIndex, handleSelectProduct
}: PosSearchProps) {
    return (
        <div className="relative w-full z-20" ref={searchContainerRef}>
            <TextField.Root 
                placeholder="Buscar producto por nombre o escanear código de barras..." 
                size="3"
                radius="large"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown} 
                className="transition-all h-14 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 focus-within:border-[#33589c] shadow-md text-lg"
            >
                <TextField.Slot>
                    {loadingData ? <Loader2 size={20} className="animate-spin text-gray-500" /> : <Search size={20} className="text-gray-500" />}
                </TextField.Slot>    
                <TextField.Slot side="right" className="pr-3">
                    <Barcode size={24} className="text-gray-400" />
                </TextField.Slot>
            </TextField.Root>
            
            {productosFiltrados.length > 0 && !loadingData && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                    {productosFiltrados.map((product, index) => (
                        <div 
                            key={product.id_producto}
                            onClick={() => handleSelectProduct(product)}
                            className={`flex justify-between items-center px-5 py-3.5 cursor-pointer border-b border-gray-200 dark:border-gray-800 last:border-none transition-all ${
                                selectedIndex === index 
                                ? "bg-blue-50 border-l-4 border-l-[#33589c] dark:bg-[#33589c]/30 dark:border-l-[#5381d6]" 
                                : "border-l-4 border-l-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-3">
                                <span className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400 font-mono text-sm tracking-wider shadow-sm">
                                    {String(product.id_producto).padStart(4, '0')}
                                </span>
                                {product.nombre}
                            </span>
                            <div className="flex items-center gap-6 text-base">
                                <span className={`text-sm font-bold px-2 py-1 rounded shadow-sm ${
                                    product.stock < 10 ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-gray-100 text-gray-700 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                }`}>
                                    Stock: {product.stock}
                                </span>
                                <span className="font-extrabold text-[#33589c] dark:text-[#589c33] text-xl">${Number(product.precio_venta).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}