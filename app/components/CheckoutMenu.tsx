"use client"
import { usePosData } from "@/app/hooks/usePosData"
import { useCart } from "@/app/hooks/useCart"
import { usePosSearch } from "@/app/hooks/usePosSearch"
import { useStockAlert } from "@/app/hooks/useStockAlert" // 👈 Importamos nuestro nuevo hook

import PosHeader from "@/app/components/pos/PosHeader"
import PosSearch from "@/app/components/pos/PosSearch"
import PosCartTable from "@/app/components/pos/PosCartTable"
import PosSummary from "@/app/components/pos/PosSummary"

export default function CheckoutMenu() {
    // 1. Datos
    const { userRole, productos, loadingData } = usePosData()

    // 2. Carrito
    const { 
        cart, handleAddCart, handleIncrement, handleDecrement, handleManualQuantity, 
        handleManualBlur, handleRemove, vaciarCarrito, subTotal, subTotalFormateado, 
        totalItems, itemsParaCheckout 
    } = useCart()

    // 3. Alerta Flotante (Lógica aislada)
    const { 
        ultimoAgregado, handleAddCartConAlerta, getColorStock 
    } = useStockAlert(handleAddCart)

    // 4. Buscador
    const {
        searchTerm, selectedIndex, searchContainerRef, productosFiltrados,
        handleSearchChange, handleKeyDown, handleSelectProduct
    } = usePosSearch(productos, handleAddCartConAlerta)

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans relative">
            
            <PosHeader userRole={userRole} />

            <PosSearch 
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                handleKeyDown={handleKeyDown}
                loadingData={loadingData}
                searchContainerRef={searchContainerRef}
                productosFiltrados={productosFiltrados}
                selectedIndex={selectedIndex}
                handleSelectProduct={handleSelectProduct}
            />

            <div className="flex flex-col lg:flex-row gap-6 grow items-start">
                <PosCartTable 
                    cart={cart}
                    loadingData={loadingData}
                    handleDecrement={handleDecrement}
                    handleManualQuantity={handleManualQuantity}
                    handleManualBlur={handleManualBlur}
                    handleIncrement={handleIncrement}
                    handleRemove={handleRemove}
                />

                <PosSummary 
                    totalItems={totalItems}
                    subTotal={subTotal}
                    subTotalFormateado={subTotalFormateado}
                    itemsParaCheckout={itemsParaCheckout}
                    vaciarCarrito={vaciarCarrito}
                />
            </div>

            {/* CÍRCULO FLOTANTE DE STOCK */}
            {ultimoAgregado && (
                <div className="fixed bottom-8 left-8 z-50 transition-all duration-300 animate-in fade-in zoom-in">
                    <div 
                        className={`w-12 h-12 rounded-full border-4 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center ${getColorStock(ultimoAgregado.stock)}`}
                        title={`Stock disponible: ${ultimoAgregado.stock}`}
                    >
                        <div className="absolute w-full h-full rounded-full animate-ping [animation-iteration-count:1] opacity-50 bg-inherit" />
                    </div>
                </div>
            )}
        </div>
    )
}