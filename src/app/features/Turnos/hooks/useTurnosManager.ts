import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Si ya las mudaste, cambiá esta ruta a '@/src/app/features/Turnos/actions'
import { getCajasAction, abrirCajaAction, cerrarCajaAction } from "../actions"
import {CajaTurno} from "../interfaces/interfaces"
import { PreCierreDatos } from "../interfaces/interfaces"

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
        cajas,
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

export function generarPdfResumenCaja(datosCierre: PreCierreDatos, idCaja: number) {
    const doc = new jsPDF()

    // Encabezado del reporte
    doc.setFontSize(18)
    doc.setTextColor(51, 88, 156) // Color corporativo (#33589c)
    doc.text(`Reporte de Caja #${idCaja}`, 14, 20)

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Fecha de emision: ${new Date().toLocaleString("es-AR")}`, 14, 27)

    // Total Recaudado
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Total Recaudado: $ ${datosCierre.total_recaudado.toFixed(2)}`, 14, 38)

    // Desglose por método de pago
    const desgloseRows = [
        ["Efectivo", `$ ${datosCierre.desglose.efectivo.toFixed(2)}`],
        ["Cuenta DNI", `$ ${datosCierre.desglose.cuenta_dni.toFixed(2)}`],
        ["MercadoPago / QR", `$ ${datosCierre.desglose.mercadopago_qr.toFixed(2)}`],
        ["Tarjeta", `$ ${datosCierre.desglose.tarjeta.toFixed(2)}`],
        ["Transferencia", `$ ${datosCierre.desglose.transferencia.toFixed(2)}`]
    ]

    autoTable(doc, {
        startY: 45,
        head: [["Metodo de Pago", "Monto"]],
        body: desgloseRows,
        theme: "striped",
        headStyles: { fillColor: [51, 88, 156] },
        styles: { fontSize: 9 }
    })

    // Tabla con el detalle de cada venta individual
    const ventasRows = datosCierre.ventas_realizadas?.map((venta) => [
        `#${venta.id}`,
        new Date(venta.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        venta.medioPago.toUpperCase(),
        `$ ${venta.total.toFixed(2)}`
    ]) || []

    const finalY = (doc as any).lastAutoTable.finalY || 90

    doc.setFontSize(12)
    doc.text("Detalle Individual de Ventas", 14, finalY + 12)

    autoTable(doc, {
        startY: finalY + 16,
        head: [["ID Venta", "Hora", "Medio de Pago", "Total"]],
        body: ventasRows,
        theme: "grid",
        headStyles: { fillColor: [40, 70, 123] },
        styles: { fontSize: 9 }
    })

    // Disparamos la descarga del PDF
    doc.save(`Caja_${idCaja}_Detalle_Ventas.pdf`)
}