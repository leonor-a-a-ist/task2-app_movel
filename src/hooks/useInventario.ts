import { useEffect, useMemo, useState } from "react";
import { api, Material } from "@/utils/inventarioUtils";

/* Hook para gerir o inventário */
export function useInventario() {
    const [materials, setMaterials] = useState<Material[]>([]); // lista completa de materiais
    const [threshold, setThreshold] = useState<number>(2);      // limite de stock baixo
    const [loading, setLoading] = useState(true);               // estado
    const [err, setErr] = useState<string | null>(null);        // mensagem de erro
    const [search, setSearch] = useState("");                   // pesquisa feita pelo utilizador

    /* faz a contagem de materiais com stock baixo
    useMemo só recalcula quando materials muda */
    const lowCount = useMemo(
        () => materials.filter((m) => m.low).length,
        [materials]
    );

    /* Devolve a lista os materiais que correspondem à pesquisa */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return materials;   //se nao houver pesquisa retorna tudo 

        return materials.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.idProduto.toLowerCase().includes(q) ||
                m.owner.toLowerCase().includes(q)
        );
    }, [materials, search]);

    /* Carrega materiais da API */
    async function load() {
        setLoading(true);
        setErr(null);
        try {
            const data = await api<{
                materials: Material[];
                lowThreshold: number;
            }>("/api/materials");

            setMaterials(data.materials);
            if (Number.isFinite(data.lowThreshold)) {
                setThreshold(data.lowThreshold);
            }
        } catch (e: any) {
            setErr(e?.message || "Erro ao carregar");
        } finally {
            setLoading(false);
        }
    }

    /* Cria um novo material */
    async function createMaterial(payload: {
        idProduto: string;
        name: string;
        quantity: number;
        owner: string;
    }) {
        await api("/api/materials", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        await load();
    }

    /* Atualiza um material já existente */
    async function updateMaterial(payload: {
        id: string;
        idProduto: string;
        name: string;
        quantity: number;
        owner: string;
    }) {
        await api("/api/materials", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
        await load();
    }

    /* Remove um material, após pedir confirmação */
    async function removeMaterial(id: string) {
        if (!confirm("Eliminar este material?")) return;

        await api(`/api/materials?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
        });
        await load();
    }

    useEffect(() => {
        load();
    }, []);

    return {
        materials,
        filtered,
        threshold,
        lowCount,
        loading,
        err,
        search,
        setSearch,
        setErr,
        reload: load,
        createMaterial,
        updateMaterial,
        removeMaterial,
    };
}
