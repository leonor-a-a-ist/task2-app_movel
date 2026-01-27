import Link from 'next/link';
import { useRouter } from 'next/router';
import HomeIcon from '@mui/icons-material/Home';

export default function Navbar() {
    const router = useRouter();
    const path = router.pathname;

    const isInventario = path === '/inventario';
    const isTeam = path === "/users";
    const isLightNavbar = isInventario || isTeam;

    const navButton = "rounded-lg border border-blue-500 px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 active:bg-blue-200 transition-colors"

    return (
        <div
            className={[
                'flex flex-row justify-between items-center p-4',
                isLightNavbar ? 'bg-gray-50 border-b border-gray-200' : 'border-b border-zinc-800 mb-12',
            ].join(' ')}
        >

            {/* Lado esquerdo */}
            <div>
                <Link href="/">
                    <HomeIcon color="primary" />
                </Link>
            </div>

            {/* Lado direito */}
            {!isLightNavbar && (
                <div>
                    <Link
                        href="/about_us"
                        className={[
                            path === '/about_us' ? 'text-white font-bold underline' : 'text-white opacity-80'
                        ].join(' ')}
                    >
                        ABOUT US
                    </Link>
                </div>
            )}

            {isInventario && (
                <Link href="/users">
                    <button className={navButton}>
                        EQUIPA
                    </button>
                </Link>
            )}

            {isTeam && (
                <Link href="/inventario">
                    <button className={navButton}>
                        INVENTÁRIO
                    </button>
                </Link>
            )}
        </div>
    );
}
