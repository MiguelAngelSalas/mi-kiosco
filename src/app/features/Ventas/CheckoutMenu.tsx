"use client"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

import { usePosData } from "./hooks/usePosData"
import { useCart } from "./hooks/useCart"
import { usePosSearch } from "./hooks/usePosSearch"
import { useStockAlert } from "@/src/app/features/Ventas/hooks/useStockAlert" 

import PosHeader from "@/src/app/features/Ventas/componentes/PosHeader"
import PosSearch from "@/src/app/features/Ventas/componentes/PosSearch"
import PosCartTable from "@/src/app/features/Ventas/componentes/PosCartTable"
import PosSummary from "@/src/app/features/Ventas/componentes/PosSummary"

import BarcodeScanner from "@/src/app/components/ui/BarcodeScanner" 

// 👇 1. Importamos la acción para buscar la caja
import { getCajasAction } from "../Turnos/actions"

export default function CheckoutMenu() {
    // Estado del escáner
    const [isScannerOpen, setIsScannerOpen] = useState(false)
    
    // 👇 2. Estado para guardar el ID de la caja activa
    const [idCajaActiva, setIdCajaActiva] = useState<number | null>(null)

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

    // 👇 3. Buscamos la caja abierta silenciosamente cuando entramos al POS
    useEffect(() => {
        const buscarCajaActiva = async () => {
            const res = await getCajasAction()
            if (res.success && res.data) {
                const cajaAbierta = res.data.find((c: any) => c.fechaCierre === null)
                if (cajaAbierta) {
                    setIdCajaActiva(cajaAbierta.id)
                }
            }
        }
        buscarCajaActiva()
    }, [])

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
            
            {/* 👇 4. Le pasamos el ID real de la caja al Header (para el botón de Cerrar Turno) */}
            <PosHeader 
                userRole={userRole} 
                idCajaActiva={idCajaActiva} 
            />

            <PosSearch 
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                handleKeyDown={handleKeyDown}
                loadingData={loadingData}
                searchContainerRef={searchContainerRef}
                productosFiltrados={productosFiltrados}
                selectedIndex={selectedIndex}
                handleSelectProduct={handleSelectProduct}
                onOpenScanner={() => setIsScannerOpen(true)} 
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
                    mode="caja" 
                />
            )}
        </div>
    )
}