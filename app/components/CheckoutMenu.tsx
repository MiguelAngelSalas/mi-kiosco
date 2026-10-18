"use client"
import { useState } from "react"
import toast from "react-hot-toast"

import { usePosData } from "@/app/hooks/usePosData"
import { useCart } from "@/app/hooks/useCart"
import { usePosSearch } from "@/app/hooks/usePosSearch"
import { useStockAlert } from "@/app/hooks/useStockAlert" 

import PosHeader from "@/app/components/pos/PosHeader"
import PosSearch from "@/app/components/pos/PosSearch"
import PosCartTable from "@/app/components/pos/PosCartTable"
import PosSummary from "@/app/components/pos/PosSummary"

import BarcodeScanner from "@/app/components/BarcodeScanner" // Ajustá tu ruta

export default function CheckoutMenu() {
    // Estado del escáner
    const [isScannerOpen, setIsScannerOpen] = useState(false)

    const { userRole, productos, loadingData } = usePosData()
    const { 
        cart, handleAddCart, handleIncrement, handleDecrement, handleManualQuantity, 
        handleManualBlur, handleRemove, vaciarCarrito, subTotal, subTotalFormateado, 
        totalItems, itemsParaCheckout 
    } = useCart()
    const { 
        ultimoAgregado, handleAddCartConAlerta, getColorStock 
    } = useStockAlert(handleAddCart)

    const {
        searchTerm, selectedIndex, searchContainerRef, productosFiltrados,
        handleSearchChange, handleKeyDown, handleSelectProduct
    } = usePosSearch(productos, handleAddCartConAlerta)

    // Función del escáner
    const handleScanSuccess = (codigoLeido: string) => {
        const productoEncontrado = productos.find(p => p.codigo_barras === codigoLeido)

        if (productoEncontrado) {
            handleAddCartConAlerta(productoEncontrado)
            toast.success(`${productoEncontrado.nombre} agregado!`, {
                icon: "🛒",
                style: { background: '#dcfce3', color: '#166534' }
            })
            setIsScannerOpen(false) 
        } else {
            toast.error("Producto no encontrado en el inventario", { duration: 3000 })
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans relative">
            
            <PosHeader userRole={userRole} />

            {/* 👇 Le pasamos la función onOpenScanner a tu buscador */}
            <PosSearch 
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                handleKeyDown={handleKeyDown}
                loadingData={loadingData}
                searchContainerRef={searchContainerRef}
                productosFiltrados={productosFiltrados}
                selectedIndex={selectedIndex}
                handleSelectProduct={handleSelectProduct}
                onOpenScanner={() => setIsScannerOpen(true)} // <-- NUEVO
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

            {/* EL MODAL DEL ESCÁNER */}
            {isScannerOpen && (
                <BarcodeScanner 
                    productos={productos} 
                    onClose={() => setIsScannerOpen(false)} 
                    onScanSuccess={handleScanSuccess} 
                    mode="caja" // 👈 LE AGREGAMOS ESTO
                />
            )}
        </div>
    )
}