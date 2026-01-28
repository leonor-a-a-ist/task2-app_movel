'use client';

import Link from "next/link";
import { useRouter } from "next/router";

/* Permite navegar entre as páginas pessoais */
export default function Menu() {
    const router = useRouter();

    // Slug atual vindo da rota (/about_us/[slug])
    const current = router.query.slug as "maria" | "leonor" | undefined;

    return (
        <nav className="relative flex h-[59px] w-[350px] max-w-[90%] items-center justify-around overflow-hidden rounded-lg bg-[#222] text-white">

            {/* Highlight azul sobre o correspondente à página atual */}
            <span
                className={`absolute top-0 h-full w-1/2 rounded-lg bg-gradient-to-tr from-[#317094] to-[#2a54a3]
                            transition-all duration-300 
                            ${current === "leonor" ? "left-1/2" : "left-0"}`}
            />

            <Link
                href="/about_us/maria"
                className="relative z-10 flex-1 text-center font-medium"
            >
                Maria Cordeiro
            </Link>

            <Link
                href="/about_us/leonor"
                className="relative z-10 flex-1 text-center font-medium"
            >
                Leonor Azevedo
            </Link>
        </nav>
    );
};