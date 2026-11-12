import { useState, useEffect } from "react"
import toast from "react-hot-toast"

// Si ya las mudaste, cambiá esta ruta a '@/src/app/features/Turnos/actions'
import { getCajasAction, abrirCajaAction, cerrarCajaAction } from "../actions"
import {CajaTurno} from "../interfaces/interfaces"

export function useTurnosManager() {
    const [cajas, setCajas] = useState<CajaTurno[]>([])
    const [cajaActiva, setCajaActiva] = useState<CajaTurno | null>(null)
    
    const [loading, setLoading] = useState(true)
    const [loadingApertura, setLoadingApertura] = useState(false)
    const [loadingCierre, setLoadingCierre] = useState(false)
    
    const [fechaFiltro, setFechaFiltro] = useState("")
    const [numeroFiltro, setNumeroFiltro] = useState("")
    const [usuarioFiltro, setUsuarioFiltro] = useState("")

    const cargarCajas = async () => {
        setLoading(true)
        const res = await getCajasAction()
        
        if (res.error) {
            toast.error(res.error)
        } else if (res.success && res.data) {
            const abierta = res.data.find((c: CajaTurno) => c.fechaCierre === null)
            setCajaActiva(abierta || null)
            
            const cerradas = res.data.filter((c: CajaTurno) => c.fechaCierre !== null)
            setCajas(cerradas.sort((a: CajaTurno, b: CajaTurno) => b.id - a.id))
        }
        setLoading(false)
    }

    useEffect(() => {
        cargarCajas()
    }, [])

    const handleAbrirCaja = async () => {
        setLoadingApertura(true)
        const res = await abrirCajaAction() 
        
        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Caja abierta correctamente")
            cargarCajas() 
        }
        setLoadingApertura(false)
    }

    const handleCerrarTurno = async () => {
        if (!cajaActiva) return
        
        setLoadingCierre(true)
        const res = await cerrarCajaAction(cajaActiva.id)
        
        if (res.error) {
            toast.error(res.error) 
        } else {
            toast.success("Turno cerrado correctamente")
            cargarCajas() 
        }
        setLoadingCierre(false)
    }

    const limpiarFiltros = () => {
        setFechaFiltro("")
        setNumeroFiltro("")
        setUsuarioFiltro("")
    }

    const formatearFecha = (fechaISO: string) => {
        if (!fechaISO) return "---"
        return new Date(fechaISO).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short', hour12: false })
    }

    const historialFiltrado = cajas.filter(c => {
        const matchNumero = numeroFiltro === "" || c.id.toString().includes(numeroFiltro)
        const matchUsuario = usuarioFiltro === "" || c.nombreUsuario.toLowerCase().includes(usuarioFiltro.toLowerCase())
        const matchFecha = fechaFiltro === "" || c.fechaInicio.startsWith(fechaFiltro) 
        
        return matchNumero && matchUsuario && matchFecha
    })

    return {
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
    }
}