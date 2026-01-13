import { Bungee } from "next/font/google";
import TextType from "./TextType"; // opcional

const bungee = Bungee({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-md text-center">
        {
        <TextType
          text={["Recrutamento Software"]}
          typingSpeed={75}
          pauseDuration={5000}
          showCursor={true}
          cursorCharacter="|"
          className={`${bungee.className} text-white text-4xl sm:text-5xl font-semibold tracking-wide`}
        />
        }


        {/* Botão opcional para avançar */}
        <div className="mt-8">
          <a
            href="/inventario"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-black font-medium active:scale-[0.98]"
          >
            Entrar no inventário
          </a>
        </div>
      </div>
    </main>
  );
}
