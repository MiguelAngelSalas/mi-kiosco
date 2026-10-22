"use client"
import { useState } from "react"
import { Search, Printer, Eye, Lock } from "lucide-react"

// Ajustá la ruta a tu botón
import { LinkButton } from "@/app/components/ui/LinkButton" 
// Si querés, acá ya podés importar el ModalCierreCaja que hicimos recién para reemplazar el botón de "CERRAR TURNO"

// 1. Tipamos estrictamente lo que esperamos del backend en el futuro
interface CajaTurno {
    id_caja: number;
    estado: string;
    fecha_apertura: string;
    fecha_cierre: string | null;
    nombre_usuario: string;
}

// 2. Datos falsos (Mocks) para maquetar la UI hoy
const mockCajaActiva: CajaTurno = {
    id_caja: 1045,
    estado: "abierta",
    fecha_apertura: "2026-10-22T08:30:00",
    fecha_cierre: null,
    nombre_usuario: "MIGUEL SALAS"
}

const mockCajasCerradas: CajaTurno[] = [
    { id_caja: 1044, estado: "cerrada", fecha_apertura: "2026-10-21T16:00:00", fecha_cierre: "2026-10-21T23:45:00", nombre_usuario: "ADMIN" },
    { id_caja: 1043, estado: "cerrada", fecha_apertura: "2026-10-21T08:00:00", fecha_cierre: "2026-10-21T15:55:00", nombre_usuario: "MIGUEL SALAS" },
    { id_caja: 1042, estado: "cerrada", fecha_apertura: "2026-10-20T16:30:00", fecha_cierre: "2026-10-20T23:50:00", nombre_usuario: "EVELYN RUHL" },
]

export default function TurnosPage() {
    // EL DÍA DE MAÑANA ESTOS ESTADOS SE ALIMENTAN DE TU BACKEND C#
    const [cajas, setCajas] = useState<CajaTurno[]>(mockCajasCerradas)
    const [loading, setLoading] = useState(false)
    
    // Estados para los filtros
    const [fechaFiltro, setFechaFiltro] = useState("")
    const [numeroFiltro, setNumeroFiltro] = useState("")
    const [usuarioFiltro, setUsuarioFiltro] = useState("")

    const limpiarFiltros = () => {
        setFechaFiltro("")
        setNumeroFiltro("")
        setUsuarioFiltro("")
    }

    const formatearFecha = (fechaISO: string) => {
        return new Date(fechaISO).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short', hour12: false })
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">
            
            {/* ENCABEZADO */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                        Gestión de Turnos
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                        Administración de cajas, aperturas y cierres de la sucursal.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* COLUMNA IZQUIERDA: TURNO ACTIVO */}
                <div className="col-span-1 flex flex-col gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-[#33589c]/30 dark:border-[#33589c]/50 p-5 relative overflow-hidden">
                        
                        {/* Decoración visual para la caja activa */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#33589c]"></div>

                        <div className="flex items-center justify-between mb-4 mt-1">
                            <h3 className="font-bold text-[#33589c] dark:text-blue-400 uppercase text-sm tracking-wider">
                                TURNO ACTUAL
                            </h3>
                            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                ACTIVO
                            </span>
                        </div>
                        
                        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2 mb-6 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                            <p className="flex justify-between">
                                <span className="text-gray-500">ID Caja:</span> 
                                <span className="font-bold">#{mockCajaActiva.id_caja}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-500">Apertura:</span> 
                                <span className="font-medium">{formatearFecha(mockCajaActiva.fecha_apertura)}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-500">Operador:</span> 
                                <span className="font-bold capitalize">{mockCajaActiva.nombre_usuario.toLowerCase()}</span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white font-semibold py-2.5 rounded-md transition-colors text-sm shadow-sm flex items-center justify-center gap-2">
                                <Eye size={16} /> Ver Detalles
                            </button>
                            {/* ACÁ PODRÍAS REEMPLAZAR ESTE BOTÓN DIRECTAMENTE POR EL COMPONENTE <ModalCierreCaja /> */}
                            <button className="w-full bg-[#33589c] hover:bg-[#28467b] text-white font-semibold py-2.5 rounded-md transition-colors text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                <Lock size={16} /> Cerrar Turno
                            </button>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: HISTORIAL */}
                <div className="col-span-1 lg:col-span-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
                    
                    <div className="bg-gray-50 dark:bg-gray-900 px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="text-gray-800 dark:text-gray-100 font-bold tracking-wide">
                            Historial de Turnos Cerrados
                        </h3>
                    </div>

                    {/* ZONA DE FILTROS */}
                    <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">Fecha</label>
                                <input 
                                    type="date" 
                                    className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-md p-2 outline-none focus:border-[#33589c] focus:ring-1 focus:ring-[#33589c] transition-all"
                                    value={fechaFiltro}
                                    onChange={(e) => setFechaFiltro(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">Número</label>
                                <input 
                                    type="text" 
                                    placeholder="# ID Turno"
                                    className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-md p-2 outline-none focus:border-[#33589c] focus:ring-1 focus:ring-[#33589c] transition-all"
                                    value={numeroFiltro}
                                    onChange={(e) => setNumeroFiltro(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">Usuario</label>
                                <select 
                                    className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-md p-2 outline-none focus:border-[#33589c] focus:ring-1 focus:ring-[#33589c] transition-all"
                                    value={usuarioFiltro}
                                    onChange={(e) => setUsuarioFiltro(e.target.value)}
                                >
                                    <option value="">Todos los usuarios</option>
                                    <option value="MIGUEL SALAS">Miguel Salas</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div className="flex items-end justify-end gap-2 mt-2 lg:mt-0">
                                <button 
                                    onClick={limpiarFiltros}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full lg:w-auto"
                                >
                                    Limpiar
                                </button>
                                <button className="px-4 py-2 bg-[#33589c] hover:bg-[#28467b] text-white rounded-md text-sm font-bold shadow-sm transition-colors w-full lg:w-auto flex items-center justify-center gap-1">
                                    <Search size={16} /> Buscar
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* TABLA DE RESULTADOS */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-800 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4">Apertura</th>
                                    <th className="p-4">Cierre</th>
                                    <th className="p-4">Usuario</th>
                                    <th className="p-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-gray-500">
                                            <div className="flex justify-center mb-2">
                                                <div className="animate-spin w-6 h-6 border-2 border-[#33589c] border-t-transparent rounded-full"></div>
                                            </div>
                                            Cargando historial...
                                        </td>
                                    </tr>
                                ) : cajas.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center text-gray-500 font-medium">
                                            No se encontraron turnos con los filtros aplicados.
                                        </td>
                                    </tr>
                                ) : (
                                    cajas.map((caja) => (
                                        <tr key={caja.id_caja} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-4 font-bold text-gray-900 dark:text-white">#{caja.id_caja}</td>
                                            <td className="p-4">
                                                <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-bold uppercase">
                                                    {caja.estado}
                                                </span>
                                            </td>
                                            <td className="p-4">{formatearFecha(caja.fecha_apertura)}</td>
                                            <td className="p-4 font-medium">{caja.fecha_cierre ? formatearFecha(caja.fecha_cierre) : "---"}</td>
                                            <td className="p-4 capitalize">{caja.nombre_usuario.toLowerCase()}</td>
                                            <td className="p-4 flex items-center justify-center gap-2">
                                                <LinkButton 
                                                    href={`/turnos/${caja.id_caja}`} 
                                                    colorTheme="blue" 
                                                    size="4"
                                                >
                                                    Detalle
                                                </LinkButton>

                                                <button 
                                                    className="p-2.5 rounded border-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-[#33589c] hover:border-[#33589c] dark:hover:text-blue-400 dark:hover:border-blue-400 transition-all shadow-sm bg-white dark:bg-gray-900"
                                                    title="Imprimir Resumen"
                                                >
                                                    <Printer size={18} />
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