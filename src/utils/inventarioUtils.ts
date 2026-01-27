// Tipo que corresponde a um material no inventário
export type Material = {
    id: string;
    idProduto: string;
    name: string;
    quantity: number;
    owner: string;
    low: boolean;
};

// Responsáveis possíveis
export const OWNER_OPTIONS = [
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
