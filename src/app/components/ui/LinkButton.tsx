import { Link } from "@radix-ui/themes";
import React from "react";

interface LinkButtonProps {
    href: string;
    children: React.ReactNode;
    colorTheme?: "blue" | "green" | "red";
    size?: "4" | "6";
    weight?: "medium" | "bold";
    className?: string;
};

export function LinkButton({
    href,
    children,
    colorTheme = "blue",
    size = "4",
    weight = "medium",
    className = "",
}: LinkButtonProps) {
    
    // Mapeamos los colores hexadecimales a sus respectivas clases completas de Tailwind
    const colorStyles = {
        blue: "border-[#33589c] text-[#33589c] hover:bg-[#33589c] dark:hover:bg-[#33589c]",
        green: "border-[#589c33] text-[#589c33] hover:bg-[#589c33] dark:hover:bg-[#589c33]",
        red: "border-[#9d3358] text-[#9d3358] hover:bg-[#9d3358] dark:hover:bg-[#9d3358]",
    };

    // Ajustamos bordes y paddings según el tamaño (size="6" es el del Logo)
    const borderSize = size === "6" ? "border-[3px]" : "border-2";
    const padding = size === "6" ? "py-4 px-8 shadow-lg" : "py-2 px-6 shadow-sm";

    return (
        <Link 
            href={href} 
            size={size} 
            weight={weight}
            className={`flex justify-center text-pretty rounded transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800 dark:text-white hover:text-white ${borderSize} ${padding} ${colorStyles[colorTheme]} ${className}`}
        >
            {children}
        </Link>
    );
}