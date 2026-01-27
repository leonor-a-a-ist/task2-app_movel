// Tipo que corresponde a um user no inventário
export type User = {
    id: string;
    ID_User: string;
    name: string;
    mail: string;
    area: string;
};

// Departamentos possíveis
export const AREA_OPTIONS = [
    "Propulsão",
    "Estruturas",
    "Aerodinâmica e Arrefecimento",
    "Software",
];

// Helper genérico para API
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const r = await fetch(path, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.error || r.statusText);
    return data;
}
