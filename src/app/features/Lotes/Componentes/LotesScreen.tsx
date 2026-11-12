"use client"
import { useEffect, useRef } from "react"
import { Heading, Button, Flex, Text, TextField, Table, Badge } from "@radix-ui/themes"
// 👇 Importamos los íconos acá en la vista
import { CalendarClock, Search, ArrowLeft, PackagePlus, CheckCircle2, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePosSearch } from "../../Ventas/hooks/usePosSearch"
import { useLotesManager } from "../hooks/useLotesManager"

export function LotesScreen() {
    const router = useRouter()
    const cantidadInputRef = useRef<HTMLInputElement>(null)

    const {
        productos, loadingProductos,
        productoSeleccionado, setProductoSeleccionado,
        cantidad, setCantidad,
        fechaVencimiento, setFechaVencimiento,
        lotesProducto, loadingLotes, loading,
        handleGuardarLote, obtenerEstadoVencimiento
    } = useLotesManager()

    const { 
        searchTerm, selectedIndex, searchContainerRef, 
        productosFiltrados, handleSearchChange, handleKeyDown 
    } = usePosSearch(productos, (producto) => {
        setProductoSeleccionado(producto)
        return false 
    })

    useEffect(() => {
        if (productoSeleccionado && cantidadInputRef.current) {
            cantidadInputRef.current.focus()
        }
    }, [productoSeleccionado])

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 font-sans">
            {/* ENCABEZADO */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 gap-4">
                <Flex align="center" gap="3">
                    <div className="bg-[#33589c] p-2.5 rounded-xl text-white shadow-md">
                        <CalendarClock size={24} />
                    </div>
                    <div>
                        <Heading as="h1" size="6" className="text-gray-900 dark:text-white font-bold tracking-tight">
                            Gestión de Lotes y Vencimientos
                        </Heading>
                        <Text size="2" className="text-gray-600 dark:text-gray-400 font-medium">Buscá o escaneá el producto para registrar su caducidad</Text>
                    </div>
                </Flex>

                <Button size="3" className="cursor-pointer bg-gray-800 hover:bg-gray-900 text-white font-bold" onClick={() => router.push("/admin")}>
                    <ArrowLeft size={18} className="mr-1" /> Volver al Admin
                </Button>
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <div ref={searchContainerRef} className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="relative w-full md:w-[450px]">
                    <TextField.Root 
                        placeholder="Buscar producto..." 
                        size="3" radius="large"
                        value={searchTerm} onChange={handleSearchChange} onKeyDown={handleKeyDown}
                        className="transition-all h-14 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 focus-within:border-[#33589c] shadow-md text-lg"
                    >
                        <TextField.Slot><Search size={20} className="text-gray-500" /></TextField.Slot>    
                    </TextField.Root>
                </div>
            </div>

            {/* PANEL INFERIOR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* LISTA DE PRODUCTOS FILTRADOS */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col gap-4">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">
                        Productos Encontrados ({productosFiltrados.length})
                    </h3>

                    <div className="overflow-y-auto max-h-[500px] space-y-2 pr-1 custom-scrollbar">
                        {loadingProductos ? (
                            <p className="text-center py-10 text-gray-500">Cargando productos...</p>
                        ) : productosFiltrados.length === 0 ? (
                            <p className="text-center py-10 text-gray-500">Escribí o escaneá para buscar.</p>
                        ) : (
                            productosFiltrados.map((p, index) => {
                                const seleccionado = productoSeleccionado?.id_producto === p.id_producto;
                                const isHighlighted = index === selectedIndex;
                                return (
                                    <div 
                                        key={`${p.id_producto}-${p.codigo_barras || p.nombre}`}
                                        onMouseDown={() => setProductoSeleccionado(p)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${
                                            seleccionado ? "border-[#33589c] bg-[#33589c]/10 dark:bg-[#33589c]/20" : isHighlighted ? "border-blue-400 bg-blue-50 dark:bg-blue-950/40" : "border-gray-200 dark:border-gray-800 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-base">{p.nombre}</p>
                                            <span className="text-xs text-gray-500 font-medium">ID: #{p.id_producto} | Stock: {p.stock} | ${p.precio_venta}</span>
                                        </div>
                                        
                                        {seleccionado ? (
                                            <span className="bg-[#33589c] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                                                <CheckCircle2 size={16} /> Seleccionado
                                            </span>
                                        ) : (
                                            <button 
                                                type="button"
                                                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setProductoSeleccionado(p); }}
                                                className="text-xs text-[#33589c] font-bold px-4 py-1.5 rounded-full border-2 border-[#33589c] hover:bg-[#33589c] hover:text-white transition-all shadow-sm cursor-pointer"
                                            >
                                                Elegir
                                            </button>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* FORMULARIO Y TABLA DE LOTES */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col">
                    <form onSubmit={handleGuardarLote} className="space-y-5">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">Detalles del Lote Entrante</h3>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
                            <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Producto Seleccionado:</span>
                            <p className="text-base font-bold text-[#33589c] dark:text-blue-400">
                                {productoSeleccionado ? productoSeleccionado.nombre : "⚠️ Ninguno"}
                            </p>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Cantidad que ingresa</label>
                            <input ref={cantidadInputRef} type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white rounded-md p-3 outline-none focus:border-[#33589c]" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Fecha de Vencimiento</label>
                            <input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white rounded-md p-3 outline-none focus:border-[#33589c]" />
                        </div>

                        <Button size="3" disabled={loading || !productoSeleccionado} className="w-full bg-[#33589c] hover:bg-[#28467b] text-white font-bold py-3 cursor-pointer shadow-md disabled:opacity-50">
                            {loading ? "Registrando..." : <> <PackagePlus size={18} className="mr-1" /> Registrar Ingreso de Lote </>}
                        </Button>
                    </form>

                    {productoSeleccionado && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider mb-4">Lotes actuales</h3>
                            {loadingLotes ? <p className="text-sm animate-pulse">Buscando lotes...</p> : lotesProducto.length === 0 ? <p className="text-sm p-3 border rounded-lg">No hay lotes registrados.</p> : (
                                <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                                    <Table.Root variant="surface" size="1">
                                        <Table.Header>
                                            <Table.Row className="bg-gray-50 dark:bg-gray-800/50">
                                                <Table.ColumnHeaderCell>Cant.</Table.ColumnHeaderCell>
                                                <Table.ColumnHeaderCell>Vencimiento</Table.ColumnHeaderCell>
                                                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {lotesProducto.map((lote) => {
                                                const estado = obtenerEstadoVencimiento(lote.fechaVencimiento || lote.fecha_vencimiento)
                                                return (
                                                    <Table.Row key={lote.id || lote.id_lote}>
                                                        <Table.Cell className="font-bold">
                                                            {lote.cantidadActual} un.
                                                        </Table.Cell>
                                                        
                                                        <Table.Cell>
                                                            {new Date(lote.fechaVencimiento || lote.fecha_vencimiento).toLocaleDateString("es-AR")}
                                                        </Table.Cell>
                                                        
                                                        <Table.Cell>
                                                            <Badge color={estado.color as any} size="1" className="flex items-center gap-1 w-fit">
                                                                {estado.color === "red" && <XCircle size={14} />}
                                                                {estado.color === "orange" && <AlertTriangle size={14} />}
                                                                {estado.color === "green" && <CheckCircle size={14} />}
                                                                {estado.label}
                                                            </Badge>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                        </Table.Body>
                                    </Table.Root>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}