import PersonCard from '@/components/about_us/PersonCard';

export default function AboutUs() {
    return (
        <div className="flex flex-col items-center min-h-screen p-8 bg-neutral-900 gap-12 md:gap-14 ">

            {/* Título */}
            <h1 className="font-bold text-4xl">
                Recrutas
            </h1>

            {/* Conjunto das imagens */}
            <div className=" gap-20 grid grid-cols-1 md:grid-cols-2">

                <PersonCard
                    href="/about_us/maria"
                    image="/maria.jpg"
                    name="Maria Cordeiro"
                />

                <PersonCard
                    href="/about_us/leonor"
                    image="/leonor.jpg"
                    name="Leonor Azevedo"
                />

            </div>
        </div>
    );
}
