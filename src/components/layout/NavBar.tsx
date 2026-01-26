import Link from 'next/link';
import { useRouter } from 'next/router';
import HomeIcon from '@mui/icons-material/Home';

export default function Navbar() {
    const router = useRouter();
    const path = router.pathname;

    return (
        <nav className="flex flex-row justify-between items-center p-4 bg-neutral-900">

            {/* Lado esquerdo */}
            <div>
                <Link href="/">
                    <HomeIcon color="primary" />
                </Link>
            </div>

            {/* Lado direito */}
            <div>
                <Link
                    href="/about_us"
                    className={path === '/about_us' ? 'font-bold underline' : ''}
                >
                    ABOUT US
                </Link>
            </div>

        </nav>
    );
}
