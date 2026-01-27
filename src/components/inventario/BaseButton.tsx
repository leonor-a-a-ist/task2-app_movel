'use client';

import { ButtonHTMLAttributes } from "react";

// herda as props de um <button>, mais a prop variant para controlar o estilo
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "btnBase" | "btnPrimary" | "btnDanger";
};

/* Define os botões usados nas páginas de inventário e de equipa, e as suas variações */
export default function BaseButton({ variant = "btnBase", className = "", type = "button", ...props }: ButtonProps) {
    const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold " +
        "focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        // botao default 
        btnBase: "border border-gray-300 bg-white text-gray-900 active:bg-gray-100 focus:ring-gray-200 ",

        // botao principal para adicional 
        btnPrimary: "bg-gray-900 text-white active:bg-gray-900 focus:ring-gray-300",

        // botao de perigo eliminar
        btnDanger: "border border-red-200 bg-red-50 text-red-800 focus:ring-red-200",
    };

    return (
        <button
            type={type}
            {...props}
            className={`${base} ${variants[variant]} ${className}`}
        />
    );
}
