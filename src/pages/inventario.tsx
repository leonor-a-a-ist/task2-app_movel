import Link from 'next/link';

export default function Inventario() {
    // só para o botão funcionar
    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-5 bg-black px-6">
            <div className="w-full max-w-2xl text-center">
                <h1 className="text-3xl font-bold mb-4">Inventário</h1>
                <p className="text-lg text-white">
                    Bem-vindo ao inventário!
                </p>
            </div>

            <div className="mt-8 flex flex-col items-center sm:gap-6 md:gap-8 lg:gap-10">
                <div>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-3.5 lg:px-7 lg:py-4 text-sm sm:text-base md:text-lg lg:text-xl text-black font-medium active:scale-[0.98]"
                    >
                        homepage
                    </Link>
                </div>
            </div>
        </main>
    );
}