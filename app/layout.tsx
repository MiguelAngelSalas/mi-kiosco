import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./globals.css";

// Importamos tu nuevo administrador
import { ThemeProvider } from "@/app/components/ThemeProviders"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Kiosco", // Aproveché y le puse el título real de tu app
  description: "Punto de venta y administración",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Envolvemos la app entera con el ThemeProvider que acabás de crear */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}