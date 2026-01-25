'use client';

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Menu = () => {
    const router = useRouter();

    // Estado para saber qual item está em hover
    const [hovered, setHovered] = useState<"maria" | "leonor" | null>(null);

    // Slug atual vindo da rota (/about_us/[slug])
    const current = router.query.slug as "maria" | "leonor" | undefined;

    // o highlight segue sempre o hover; apenas se não houver hover é que segue o slug atual
    const highlight = hovered || current;

    return (
        <nav className="relative flex h-[59px] w-[350px] max-w-[95%] items-center justify-around overflow-hidden rounded-lg bg-[#222] text-white">

            {/* Highlight */}
            <span
                className={`absolute top-0 h-full w-1/2 rounded-lg bg-gradient-to-tr from-[#317094] to-[#2a54a3]
                            transition-all duration-300 ${highlight === "leonor" ? "left-1/2" : "left-0"}`}
            />

            <Link
                href="/about_us/maria"
                className="relative z-10 flex-1 text-center font-medium"
                onMouseEnter={() => setHovered("maria")}
                onMouseLeave={() => setHovered(null)}
            >
                Maria Cordeiro
            </Link>

            <Link
                href="/about_us/leonor"
                className="relative z-10 flex-1 text-center font-medium"
                onMouseEnter={() => setHovered("leonor")}
                onMouseLeave={() => setHovered(null)}
            >
                Leonor Azevedo
            </Link>
        </nav>
    );
};

export default Menu;
