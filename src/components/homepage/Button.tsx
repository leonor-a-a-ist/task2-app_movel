import Link from 'next/link';

/* Botões da página inicial */
export default function HomeButton({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center border-2 border-dashed justify-center rounded-xl bg-black 
                        px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-3.5 text-md sm:text-lg 
                        md:text-xl text-white font-medium active:scale-[0.98]"
        >
            {children}
        </Link>
    );
}
