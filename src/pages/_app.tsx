import "@/styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import OurLayout from '@/components/layout/Layout';
import Head from "next/head";


export default function App({ Component, pageProps }: AppProps) {
    const isHome = Component.name === "Home"

    useEffect(() => {
        // Guardar o título original para restaurar depois
        const originalTitle = document.title;

        // Altera o título da página quando o utilizador muda de tab
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Quando o utilizador muda de tab
                document.title = "🏍️ I am lonely tab :(";
            } else {
                // Quando o utilizador volta ao tab
                document.title = originalTitle;
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup: remover o listener quando o componente for desmontado
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);


    return (
        <>
            <Head>
                <title>OUR WEBSITE</title>
            </Head>

            {/* Se for a Home não tem navbar, logo, não utiliza o layout padrão */}
            {isHome ? (
                <Component {...pageProps} />
            ) : (
                <OurLayout>
                    <Component {...pageProps} />
                </OurLayout>
            )}
        </>
    );
}
