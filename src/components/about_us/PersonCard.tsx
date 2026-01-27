import Link from 'next/link';
import Image from "next/image";

interface PersonCardProps {
    href: string;
    image: string;
    name: string;
}

/* Acesso às páginas pessoais partindo da página about_us */
export default function PersonCard({ href, image, name }: PersonCardProps) {
    return (
        <Link href={href} className="block text-center">
            <div className="relative w-48 h-64 mx-auto">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="rounded-2xl object-cover"
                />
            </div>
            <span>{name}</span>
        </Link>
    );
}