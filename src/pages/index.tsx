import Image from "next/image";
import { Bungee } from "next/font/google";
import TextType from "./TextType";

const bungee = Bungee({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Home() {
    return (
        <div className="h-screen flex flex-col lg:flex-row relative">

            {/* Logo no canto superior direito */}
            <div className="absolute top-0 right-4 z-20">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                />
            </div>

            {/* Imagem de fundo escurecida - Apenas para mobile */}
            <div className="fixed inset-0 lg:hidden z-0">
                <Image
                    src="/homescreencut.jpg"
                    alt="background"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    className="blur-none brightness-50"
                />
                {/* Overlay escuro para melhor legibilidade */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Coluna esquerda: imagem - Apenas para desktop */}
            <div className="hidden lg:block w-[40%] h-screen relative">
                <Image
                    src="/homescreencut.jpg"
                    alt="home screen image"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    className="brightness-90"
                />
            </div>

            {/* Coluna direita: conteúdo - Apenas para desktop */}
            <div className="relative w-full lg:w-[60%] bg-transparent lg:bg-black flex flex-col items-center justify-center px-6 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 min-h-screen z-10">

                <div className="flex flex-col items-center justify-center text-center w-full space-y-6 sm:space-y-8 lg:space-y-10">

                    {/* Título */}
                    <div className="w-full min-h-[5.5rem] sm:min-h-[6.5rem] md:min-h-[7.5rem] lg:min-h-[8rem]">
                        <TextType
                            text={["Recrutamento Software"]}
                            typingSpeed={75}
                            pauseDuration={5000}
                            showCursor={true}
                            cursorCharacter="|"
                            className={`${bungee.className} text-4xl sm:text-4xl md:text-6xl lg:text-6xl 2xl:text-7xl text-white`}
                        />
                    </div>

                    {/* Botões */}
                    <div className="mt-8 flex flex-col items-center gap-5 sm:gap-6 md:gap-8 lg:gap-10">
                        <div>
                            <a
                                href="/inventario"
                                className="inline-flex items-center border-2 border-dashed justify-center rounded-xl bg-black px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-3.5 lg:px-7 lg:py-4 text-sm sm:text-base md:text-lg lg:text-xl text-white font-medium active:scale-[0.98]"
                            >
                                Entrar no inventário
                            </a>
                        </div>

                        <div>
                            <a
                                href="/about_us"
                                className="inline-flex items-center border-2 border-dashed justify-center rounded-xl bg-black px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-3.5 lg:px-7 lg:py-4 text-sm sm:text-base md:text-lg lg:text-xl text-white font-medium active:scale-[0.98]"
                            >
                                Conhecer as recrutas
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
