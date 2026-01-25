import Image from "next/image";
import TextType from "../components/homepage/TextType";
import HomeButton from "../components/homepage/Button";
import { Bungee } from "next/font/google";


const bungee = Bungee({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Home() {
    return (
        <div className="h-screen flex flex-col lg:flex-row relative bg-black">

            {/* Logo no canto superior direito; sobrepõem-se aos restantes elementos */}
            <div className="absolute top-4 right-4 z-20">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={200}
                    height={200}
                    className="w-16 sm:w-20 md:w-22 lg:w-24 xl:w-26 h-auto object-contain"
                />
            </div>

            {/* Imagem - background em mobile, coluna esquerda em desktop */}
            <div className="fixed inset-0 z-0 lg:block lg:w-[40%] lg:h-screen lg:relative">
                <Image
                    src="/homescreencut.jpg"
                    alt="background"
                    fill
                    priority
                    className="object-cover blur-none brightness-20 lg:brightness-90"
                />
            </div>

            {/* Conteúdo - coluna direita em desktop */}
            <div className="flex flex-col items-center justify-center min-h-screen z-10 text-center gap-20 p-6 sm:p-8 md:p-10 lg:p-12 lg:w-[60%]">


                {/* Título animado */}
                <div className="w-full h-[5.5rem] sm:h-[6.5rem] md:h-[7.5rem] lg:h-[8.5rem] flex items-center justify-center text-center ">
                    <TextType
                        text={["Recrutamento Software"]}
                        typingSpeed={75}
                        pauseDuration={5000}
                        showCursor={true}
                        cursorCharacter="|"
                        className={`${bungee.className} text-4xl sm:text-4xl md:text-6xl lg:text-6xl 2xl:text-7xl text-white`}
                    />
                </div>

                {/* Botões para navegação */}
                <div className="flex flex-col items-center gap-5 sm:gap-6 md:gap-8 lg:gap-10">
                    <HomeButton href="/inventario">
                        Entrar no inventário
                    </HomeButton>

                    <HomeButton href="/about_us">
                        Conhecer as recrutas
                    </HomeButton>
                </div>

            </div>

        </div>
    );
}
