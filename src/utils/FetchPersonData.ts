import people from '@/data/people.json';

/**
 * Tipo que representa uma pessoa
 * Tem a mesma estrutura dos objetos existentes no ficheiro people.json
 */
export type Person = {
    slug: string;   //  Identificador único usado no URL
    titleName: string;
    name: string;
    course: string;
    hobbies: string;
    funFact?: string;
    projects: string;
    learn: string;
    contribute: string;
};

/**
 * Retorna um array com todos os slugs disponíveis -> ["maria", "leonor"]
 * Usado em getStaticPaths
 */
export function getAvailablePeople() {
    return people.map((person: Person) => person.slug);
}

/**
 * Dado um slug, retorna os dados completos da pessoa
 */
export function fetchPersonData(slug: string): Person | null {
    return people.find((person: Person) => person.slug === slug) || null;
}


