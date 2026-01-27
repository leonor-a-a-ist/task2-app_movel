import { useEffect, useMemo, useState } from "react";
import { api, User } from "@/utils/userUtils";

/* Hook para gerir a lista de users */
export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);         //lista de utilizadores
    const [search, setSearch] = useState("");               //pesquisa feita pelo utilizador
    const [loading, setLoading] = useState(true);           //estado
    const [err, setErr] = useState<string | null>(null);    //mensagem de erro

    /* Devolve a lista os materiais que correspondem à pesquisa */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;   //se nao houver pesquisa retorna tudo 

        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.ID_User.toLowerCase().includes(q) ||
                u.area.toLowerCase().includes(q)
        );
    }, [users, search]);

    /* Carrega users da API */
    async function load() {
        setLoading(true);
        setErr(null);
        try {
            const data = await api<{
                users: User[];
            }>("/api/users");

            setUsers(data.users);
        } catch (e: any) {
            setErr(e?.message || "Erro ao carregar");
        } finally {
            setLoading(false);
        }
    }

    /* Cria um novo utilizador */
    async function createUser(payload: {
        ID_User: string;
        name: string;
        mail: string;
        area: string;
    }) {
        await api("/api/users", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        await load();
    }

    /* Atualiza um user já existente */
    async function updateUser(payload: {
        id: string;
        ID_User: string;
        name: string;
        mail: string;
        area: string;
    }) {
        await api("/api/users", {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
        await load();
    }

    /* Remove um user, após pedir confirmação */
    async function removeUser(id: string) {
        if (!confirm("Eliminar este membro?")) return;

        await api(`/api/users?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
        });
        await load();
    }

    useEffect(() => {
        load();
    }, []);

    return {
        users,
        filtered,
        loading,
        err,
        search,
        setSearch,
        setErr,
        reload: load,
        createUser,
        updateUser,
        removeUser,
    };
}
