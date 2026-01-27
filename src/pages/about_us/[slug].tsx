import { fetchPersonData, getAvailablePeople } from '@/utils/FetchPersonData';
import type { Person } from '@/utils/FetchPersonData';
import Menu from '@/components/about_us/Menu';
import Image from 'next/image';


// Define o tipo dos argumentos
interface Params {
    slug: string;
}

/**
 * Executado em build time
 * Define todas as páginas dinâmicas que devem ser geradas
 * Cada slug vai corresponder a uma página pessoal
 */
export async function getStaticPaths() {
    const paths = getAvailablePeople().map(slug => ({ params: { slug } }));

    // fallback false: qualquer URL que não corresponda a um slug existente resulte num 404
    return { paths, fallback: false };
}

/**
 * Executado em build time para cada slug
 * Vai buscar os dados da pessoa correspondente e passa-os como props para a página
 */
export async function getStaticProps({ params }: { params: Params }) {
    const person = await fetchPersonData(params.slug);

    if (!person) {
        return { notFound: true };
    }

    return { props: { person } };
}

/**
 * Recebe os dados da pessoa como props (vindos de getStaticProps)
 * Gera a página pessoal com esses dados
 */
export default function PersonalPage({ person }: { person: Person }) {

    const content = (
        <div>
            <p><strong>Nome:</strong> {person.name}</p>
            <p><strong>Curso:</strong> {person.course}</p>
            <p><strong>Hobbies/ interesses:</strong> {person.hobbies}</p>
            {person.funFact && <p><strong>Fun fact:</strong> {person.funFact}</p>}
            <p><strong>Projetos:</strong> {person.projects}</p>
            <p><strong>O que espero aprender:</strong> {person.learn}</p>
            <p><strong>Como espero contribuir:</strong> {person.contribute}</p>
        </div>
    );

    return (
        <div className="flex flex-col items-center min-h-screen bg-neutral-900 text-white gap-10">

            {/* Navegação entre páginas */}
            <Menu />

            {/* Conteúdo principal */}
            <div className="personal-page_content flex flex-col justify-center items-center gap-4 w-full mb-10">

                {/* Nome */}
                <h1 className="text-4xl font-bold">
                    {person.titleName}
                </h1>

                <div className="flex flex-col justify-center w-[95%] max-w-[900px] items-center gap-8 bg-[#222] rounded-2xl shadow-2xl p-5">

                    {/* Imagem */}
                    <div className="shrink-0">
                        <Image
                            src={`/${person.slug}.jpg`}
                            alt={person.name}
                            width={192}
                            height={256}
                            className="rounded-2xl shadow-2xl w-60 h-auto object-contain"
                        />
                    </div>

                    {/* Informação pessoal */}
                    <div className="w-full">
                        {content}
                    </div>

                </div>
            </div>

        </div>
    );
}