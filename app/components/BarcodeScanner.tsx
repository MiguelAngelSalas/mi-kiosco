"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Loader2, Camera, AlertCircle } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (codigo: string) => void;
}

export default function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const [inicializando, setInicializando] = useState(true);
  const [errorAcceso, setErrorAcceso] = useState(false);

  useEffect(() => {
    // Inicializa la cámara
    const scanner = new Html5QrcodeScanner(
      "lector-codigo",
      {
        fps: 20, // Más FPS para una detección súper veloz
        qrbox: { width: 280, height: 160 }, // Dimensiones óptimas para códigos de barra
        aspectRatio: 1.777778, // Forzamos 16:9 para mejor encuadre
      },
      false
    );

    scanner.render(
      (codigoDecodificado) => {
        scanner.clear(); // Detiene la cámara al capturar
        onScan(codigoDecodificado); // Pasa el resultado al buscador
      },
      (error) => {
        // Ignorar errores continuos de escaneo frame-a-frame
      }
    );

    // Pequeño timeout para dar feedback visual de inicialización de la cámara
    const timeout = setTimeout(() => {
      setInicializando(false);
      // Chequeamos si el elemento de video o cámara se cargó
      const videoElement = document.querySelector("#lector-codigo video");
      if (!videoElement) {
        // Si después de unos segundos no levantó el video, puede que no haya permisos
        setErrorAcceso(true);
      }
    }, 2200);

    // Limpieza al desmontar el modal
    return () => {
      clearTimeout(timeout);
      scanner.clear().catch(console.error);
    };
  }, [onScan]);

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-slate-950 border border-gray-800 p-2 shadow-2xl">
      {/* Contenedor del video con superposiciones estilizadas */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
        
        {/* LECTOR HTML5 (La cámara de fondo) */}
        {/* Las clases de abajo ocultan botones e inputs nativos horribles que genera la librería por defecto */}
        <div 
          id="lector-codigo" 
          className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full [&_a]:hidden [&_button]:hidden [&_span]:hidden [&_select]:hidden"
        ></div>

        {/* 1. Capa de Inicialización / Cargando */}
        {inicializando && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-3 z-20 text-blue-400">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <span className="text-sm font-semibold tracking-wide animate-pulse">
              Encendiendo cámara...
            </span>
          </div>
        )}

        {/* 2. Feedback de error (Cámara bloqueada o sin permisos) */}
        {errorAcceso && !inicializando && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center gap-3 z-30 text-red-400">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h4 className="font-bold text-white">Error de acceso</h4>
            <p className="text-xs text-slate-400 max-w-[280px]">
              No pudimos acceder a tu cámara. Asegurate de dar los permisos necesarios en tu navegador para continuar.
            </p>
          </div>
        )}

        {/* 3. CAPA DE DISEÑO DEL ESCÁNER (Inmutable sobre la cámara) */}
        {!inicializando && !errorAcceso && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
            {/* Indicador de estado */}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-green-400 border border-green-500/30">
                <span className="h-2.0 w-2.0 rounded-full bg-green-500 animate-ping"></span>
                ESCANEO ACTIVO
              </span>
              <Camera className="text-slate-400 opacity-60" size={18} />
            </div>

            {/* MARCO GUÍA CENTRAL (El recuadro de escaneo) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[150px]">
              {/* Esquinas superiores e inferiores estilizadas */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>

              {/* LÁSER DE ESCANEO (Animación de línea roja/verde que sube y baja) */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite] absolute"></div>
            </div>

            {/* Ayuda visual inferior */}
            <div className="self-center">
              <p className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-medium text-slate-300 border border-slate-700/30 tracking-wide">
                Alineá el código de barras dentro del marco
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Estilos CSS inline específicos para animar el láser de escaneo */}
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
      `}</style>
    </div>
  );
}