"use client"
import Link from "next/link" 
import { useState, useEffect } from "react"
import { Search, Printer, Wallet, ShoppingCart, LayoutDashboard } from "lucide-react" 
import { LinkButton } from "@/src/app/components/ui/LinkButton"
import ModalCierreCaja from "@/src/app/features/Turnos/ModalCierreCaja"
import { useTurnosManager } from "../hooks/useTurnosManager"
import { obtenerResumenCajaAction } from "../actions" 
import { generarPdfResumenCaja } from "../hooks/useTurnosManager" 
import toast from "react-hot-toast"

export function TurnosScreen() {
    const {
        cajaActiva, 
        loading, 
        loadingApertura, 
        loadingCierre,
        fechaFiltro, setFechaFiltro,
        numeroFiltro, setNumeroFiltro,
        usuarioFiltro, setUsuarioFiltro,
        historialFiltrado,
        handleAbrirCaja, 
        handleCerrarTurno, 
        limpiarFiltros, 
        formatearFecha
    } = useTurnosManager()

    const [isAdmin, setIsAdmin] = useState(false)
    const [descargandoId, setDescargandoId] = useState<number | null>(null)

    useEffect(() => {
        const role = localStorage.getItem("rolUsuario")
        if (role === "administrador") {
            setIsAdmin(true)
        }
    }, [])

    const handleImprimirHistorial = async (idCaja: number) => {
        setDescargandoId(idCaja)
        const toastId = toast.loading(`Generando PDF de la caja #${idCaja}...`)

        const res = await obtenerResumenCajaAction(idCaja)

        if (res.success && res.datos) {
            generarPdfResumenCaja(res.datos, idCaja)
            toast.success("PDF descargado correctamente.", { id: toastId })
        } else {
            toast.error(res.error || "No se pudo obtener el resumen de esta caja.", { id: toastId })
        }

        setDescargandoId(null)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">
            
            {/* ENCABEZADO */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border-2 border-gray-300 dark:border-gray-800 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        Gestión de Turnos
                    </h1>
                    <p className="text-sm text-gray-700 dark:text-gray-400 mt-1 font-medium">
                        Administración de cajas, aperturas y cierres de la sucursal.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <Link href="/CheckoutMenu" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#33589c] hover:bg-[#28467b] text-white font-bold rounded-md transition-colors text-sm shadow-sm flex-1 md:flex-none cursor-pointer">
                        <ShoppingCart size={18} /> Ir a la Caja
                    </Link>
                    
                    {isAdmin && (
                        <Link href="/admin" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#33589c] hover:bg-[#28467b] text-white font-bold rounded-md transition-colors text-sm shadow-sm flex-1 md:flex-none cursor-pointer">
                            <LayoutDashboard size={18} /> Panel Admin
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* COLUMNA IZQUIERDA: TURNO ACTIVO */}
                <div className="col-span-1 flex flex-col gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border-2 border-gray-300 dark:border-gray-800 p-5 relative overflow-hidden">
                        
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${cajaActiva ? 'bg-[#33589c]' : 'bg-gray-500'}`}></div>

                        <div className="flex items-center justify-between mb-4 mt-1">
                            <h3 className={`font-bold uppercase text-sm tracking-wider ${cajaActiva ? 'text-[#33589c] dark:text-blue-400' : 'text-gray-700 dark:text-gray-400'}`}>
                                TURNO ACTUAL
                            </h3>
                            {cajaActiva ? (
                                <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-green-300 dark:border-green-800">
                                    <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span> ACTIVO
                                </span>
                            ) : (
                                <span className="bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-400 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-300 dark:border-gray-700">
                                    CERRADO
                                </span>
                            )}
                        </div>
                        
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin w-8 h-8 border-4 border-[#33589c] border-t-transparent rounded-full"></div>
                            </div>
                        ) : cajaActiva ? (
                            <>
                                <div className="text-sm text-gray-800 dark:text-gray-300 space-y-2.5 mb-6 bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                                    <p className="flex justify-between"><span className="text-gray-600 dark:text-gray-400 font-medium">ID Caja:</span> <span className="font-bold text-gray-900 dark:text-white">#{cajaActiva.id}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-600 dark:text-gray-400 font-medium">Apertura:</span> <span className="font-semibold text-gray-900 dark:text-white">{formatearFecha(cajaActiva.fechaInicio)}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-600 dark:text-gray-400 font-medium">Operador:</span> <span className="font-bold text-gray-900 dark:text-white capitalize">{cajaActiva.nombreUsuario?.toLowerCase()}</span></p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <ModalCierreCaja esSoloResumen={true} idCaja={cajaActiva.id} />
                                    
                                    {loadingCierre ? (
                                        <button disabled className="w-full bg-[#33589c] text-white font-semibold py-2.5 rounded-md transition-colors text-sm shadow-md flex items-center justify-center gap-2 cursor-not-allowed opacity-50">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Cerrando...
                                        </button>
                                    ) : (
                                        <ModalCierreCaja onCierreExitoso={handleCerrarTurno} idCaja={cajaActiva.id} />
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
                                <Wallet size={48} className="text-gray-500" />
                                <p className="text-sm text-gray-700 dark:text-gray-400 font-medium px-4">
                                    No hay ninguna caja abierta. Iniciá el turno para empezar a registrar ventas.
                                </p>
                                <button onClick={handleAbrirCaja} disabled={loadingApertura} className="w-full mt-2 bg-[#589c33] hover:bg-[#4a852a] disabled:opacity-50 text-white font-bold py-3 rounded-md transition-colors text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                                    {loadingApertura ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Wallet size={18} /> Abrir Nueva Caja</>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMNA DERECHA: HISTORIAL */}
                <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border-2 border-gray-300 dark:border-gray-800 overflow-hidden flex flex-col">
                    <div className="bg-gray-100 dark:bg-gray-900 px-5 py-4 border-b-2 border-gray-300 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="text-gray-900 dark:text-gray-100 font-bold tracking-wide text-base">Historial de Turnos Cerrados</h3>
                    </div>

                    {/* FILTROS */}
                    <div className="p-5 border-b-2 border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-700 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">Fecha</label>
                                <input type="date" className="border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-md p-2.5 outline-none focus:border-[#33589c] font-medium" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-700 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">Número</label>
                                <input type="text" placeholder="# ID Turno" className="border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-md p-2.5 outline-none focus:border-[#33589c] font-medium placeholder:text-gray-400" value={numeroFiltro} onChange={(e) => setNumeroFiltro(e.target.value)} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-700 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">Usuario</label>
                                <input type="text" placeholder="Nombre operador" className="border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-md p-2.5 outline-none focus:border-[#33589c] font-medium placeholder:text-gray-400" value={usuarioFiltro} onChange={(e) => setUsuarioFiltro(e.target.value)} />
                            </div>

                            <div className="flex items-end justify-end gap-2 mt-2 lg:mt-0">
                                <button onClick={limpiarFiltros} className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full lg:w-auto cursor-pointer">Limpiar</button>
                                <button className="px-4 py-2.5 bg-[#33589c] hover:bg-[#28467b] text-white rounded-md text-sm font-bold shadow-sm transition-colors w-full lg:w-auto flex items-center justify-center gap-1 cursor-pointer"><Search size={16} /> Buscar</button>
                            </div>
                        </div>
                    </div>

                    {/* TABLA */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-800 dark:text-gray-300">
                            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-400 font-bold border-b-2 border-gray-300 dark:border-gray-800 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4">Apertura</th>
                                    <th className="p-4">Cierre</th>
                                    <th className="p-4">Usuario</th>
                                    <th className="p-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-gray-600 font-medium">
                                            <div className="flex justify-center mb-2">
                                                <div className="animate-spin w-6 h-6 border-2 border-[#33589c] border-t-transparent rounded-full"></div>
                                            </div>
                                            Cargando historial...
                                        </td>
                                    </tr>
                                ) : historialFiltrado.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center text-gray-600 font-medium">
                                            No se encontraron turnos.
                                        </td>
                                    </tr>
                                ) : (
                                    historialFiltrado.map((caja) => (
                                        <tr key={caja.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-4 font-bold text-gray-900 dark:text-white">#{caja.id}</td>
                                            <td className="p-4">
                                                <span className="bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-2.5 py-1 rounded text-xs font-bold uppercase border border-gray-300 dark:border-gray-700">CERRADA</span>
                                            </td>
                                            <td className="p-4 font-medium">{formatearFecha(caja.fechaInicio)}</td>
                                            <td className="p-4 font-medium">{formatearFecha(caja.fechaCierre!)}</td>
                                            <td className="p-4 font-medium capitalize text-gray-900 dark:text-white">{caja.nombreUsuario?.toLowerCase()}</td>
                                            <td className="p-4 flex items-center justify-center gap-2">
                                                <LinkButton href={`/turnos/${caja.id}`} colorTheme="blue" size="4">Detalle</LinkButton>
                                                
                                                <button 
                                                    onClick={() => handleImprimirHistorial(caja.id)}
                                                    disabled={descargandoId === caja.id}
                                                    className="p-2.5 rounded border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:text-[#33589c] hover:border-[#33589c] transition-all shadow-sm bg-white dark:bg-gray-900 cursor-pointer disabled:opacity-50" 
                                                    title="Imprimir Resumen en PDF"
                                                >
                                                    {descargandoId === caja.id ? (
                                                        <div className="w-4 h-4 border-2 border-[#33589c] border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Printer size={18} />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}