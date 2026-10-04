"use client"
import { usePosData } from "@/app/hooks/usePosData"
import { useCart } from "@/app/hooks/useCart"
import { usePosSearch } from "@/app/hooks/usePosSearch"

// Importamos nuestras 4 piezas visuales
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

    // 3. Buscador
    const {
        searchTerm, selectedIndex, searchContainerRef, productosFiltrados,
        handleSearchChange, handleKeyDown, handleSelectProduct
    } = usePosSearch(productos, handleAddCart)

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">
            
            {/* 1. EL ENCABEZADO */}
            <PosHeader userRole={userRole} />

            {/* 2. EL BUSCADOR Y LÁSER */}
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
                {/* 3. LA TABLA DEL CARRITO */}
                <PosCartTable 
                    cart={cart}
                    loadingData={loadingData}
                    handleDecrement={handleDecrement}
                    handleManualQuantity={handleManualQuantity}
                    handleManualBlur={handleManualBlur}
                    handleIncrement={handleIncrement}
                    handleRemove={handleRemove}
                />

                {/* 4. EL RESUMEN Y BOTÓN DE COBRO */}
                <PosSummary 
                    totalItems={totalItems}
                    subTotal={subTotal}
                    subTotalFormateado={subTotalFormateado}
                    itemsParaCheckout={itemsParaCheckout}
                    vaciarCarrito={vaciarCarrito}
                />
            </div>
        </div>
    )
}