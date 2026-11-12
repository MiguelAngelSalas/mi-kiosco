import { PanelReporteVentas } from "../features/Ventas/componentes/PanelReporteDeVentas"

export const metadata = {
    title: "Reporte de Ventas | miKiosco",
}

export default function ReportesPage() {
    return (
        <main className="p-4 md:p-8 bg-gray-50 min-h-screen dark:bg-gray-950">
            <PanelReporteVentas />
        </main>
    )
}