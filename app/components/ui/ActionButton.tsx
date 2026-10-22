import React, { forwardRef } from "react";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    colorTheme?: "blue" | "green" | "red";
    size?: "4" | "6";
    className?: string;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(({
    children,
    colorTheme = "blue",
    size = "4",
    className = "",
    ...props
}, ref) => {
    
    const colorStyles = {
        blue: "border-[#33589c] text-[#33589c] hover:bg-[#33589c] dark:hover:bg-[#33589c]",
        green: "border-[#589c33] text-[#589c33] hover:bg-[#589c33] dark:hover:bg-[#589c33]",
        red: "border-[#9d3358] text-[#9d3358] hover:bg-[#9d3358] dark:hover:bg-[#9d3358]",
    };

    const borderSize = size === "6" ? "border-[3px]" : "border-2";
    const padding = size === "6" ? "py-4 px-8 shadow-lg" : "py-2 px-6 shadow-sm";

    return (
        <button
            ref={ref}
            type="button"
            className={`flex items-center justify-center font-medium text-pretty rounded transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800 dark:text-white hover:text-white ${borderSize} ${padding} ${colorStyles[colorTheme]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
});

ActionButton.displayName = "ActionButton";