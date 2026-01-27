'use client';

import { useState } from "react";
import { User, AREA_OPTIONS } from "@/utils/userUtils";
import { useUsers } from "@/hooks/useUsers";
import BaseButton from "@/components/inventario/BaseButton";
import UserCard from "@/components/team/UserCard";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";


/* Pagina de utilizadores */
export default function TeamPage() {
    const {
        filtered,
        loading,
        err,
        search,
        setSearch,
        setErr,
        reload,
        createUser,
        updateUser,
        removeUser,
    } = useUsers();

    // Estados de criação ou edição
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);

    const [newIdUser, setNewIdUser] = useState("");
    const [newName, setNewName] = useState("");
    const [newMail, setNewMail] = useState("");
    const [newArea, setNewArea] = useState("");

    // esvazia o formulário de criação/edição
    function resetForm() {
        setEditing(null);
        setNewIdUser("");
        setNewName("");
        setNewMail("");
        setNewArea("");
    }

    // Submissão da edição ou criação
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!newArea) {
            setErr("Seleciona uma área.");
            return;
        }

        try {
            // edição
            if (editing) {
                await updateUser({
                    id: editing,
                    ID_User: newIdUser,
                    name: newName,
                    mail: newMail,
                    area: newArea,
                });
            } else {
                // criação
                await createUser({
                    ID_User: newIdUser.trim(),
                    name: newName.trim(),
                    mail: newMail.trim(),
                    area: newArea.trim(),
                });
            }

            // o formulário é esvaziado e escondido
            resetForm();
            setShowCreate(false);
        } catch (e: any) {
            setErr(e?.message || "Erro ao guardar utilizador");
        }
    }

    function startEdit(u: User) {
        setEditing(u.id);
        setNewIdUser(u.ID_User);
        setNewName(u.name);
        setNewMail(u.mail);
        setNewArea(u.area);
        setShowCreate(true);
    }

    // Remoção de um user
    async function handleRemove(id: string) {
        try {
            await removeUser(id);
        } catch (e: any) {
            setErr(e?.message || "Erro ao eliminar");
        }
    }

    // Formato dos elementos de input e labels
    const inputBase =
        "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm " +
        "text-gray-700 placeholder-gray-400 " +
        "focus:border-gray-500 focus:ring-2 focus:ring-gray-200";

    const inputLabel =
        "mb-1 block text-xs font-semibold text-gray-700";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">

                {/* Título */}
                <div className="flex flex-col gap-2">
                    <div>
                        <div className="flex flex-row items-center relative">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                                Equipa
                            </h1>

                            <button
                                onClick={reload}
                                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-600"
                                title="Recarregar"
                                aria-label="Recarregar"
                            >
                                <RefreshIcon fontSize="small" />
                            </button>
                        </div>

                        <p className="mt-1 text-sm text-gray-600">
                            Gestão de membros
                        </p>

                    </div>
                </div>

                {/* Formulário de criação/ edição */}
                {showCreate && (
                    <div className="mt-6 mb-12 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
                        >
                            {/* ID */}
                            <div>
                                <label className={inputLabel}> ID </label>
                                <input
                                    className={inputBase}
                                    value={newIdUser}
                                    onChange={(e) => setNewIdUser(e.target.value)}
                                    placeholder="ex: joao1"
                                />
                            </div>

                            {/* Nome */}
                            <div>
                                <label className={inputLabel}> Nome </label>
                                <input
                                    className={inputBase}
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="João Dinis"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className={inputLabel}> Email </label>
                                <input
                                    className={inputBase}
                                    value={newMail}
                                    onChange={(e) => setNewMail(e.target.value)}
                                    placeholder="joao@gmail.com"
                                />
                            </div>

                            {/* Departamento */}
                            <div>
                                <label className={inputLabel}> Departamento </label>
                                <select
                                    className={inputBase + "min-w-0"}
                                    value={newArea}
                                    onChange={(e) => setNewArea(e.target.value)}
                                >
                                    <option value=""> Selecionar… </option>
                                    {AREA_OPTIONS.map((a) => (
                                        <option key={a} value={a}>
                                            {a}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botões de cancelar e editar */}
                            <div className="sm:col-span-2 flex justify-end gap-2">
                                <BaseButton
                                    type="button"
                                    variant={"btnDanger"}
                                    onClick={() => {
                                        resetForm();
                                        setShowCreate(false);
                                    }}
                                >
                                    Cancelar
                                </BaseButton>
                                <BaseButton type="submit" variant={"btnPrimary"}>
                                    {editing ? "Guardar" : "Criar"}
                                </BaseButton>
                            </div>
                        </form>
                    </div>
                )}

                {/* Mensagem de erro */}
                {err && (
                    <div className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900 mb-15">
                        <div>
                            <span className="font-semibold">Erro:</span> {err}
                        </div>
                        <BaseButton
                            onClick={() => setErr(null)} variant={"btnDanger"}
                            className="!rounded-lg !bg-white !px-2 !py-1 !text-xs"
                        >
                            Fechar
                        </BaseButton>
                    </div>
                )}

                {/* Barra de pesquisa e de botão para adicionar novo user */}
                <div className="mt-4 flex items-center gap-3">
                    <div className="relative flex-1">
                        <SearchIcon
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            fontSize="small"
                        />
                        <input
                            className={inputBase + " pl-10 !border-black"}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="ID, Nome ou Departamento"
                        />
                    </div>
                    {!showCreate && (
                        <BaseButton
                            onClick={() => {
                                setEditing(null);
                                setShowCreate(true);
                            }}
                            variant={"btnPrimary"}
                        >
                            Adicionar
                        </BaseButton>
                    )}
                </div>

                {/* Lista de users */}
                <div className="mt-6">
                    {loading ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm">
                            A carregar…
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                            {filtered.map((u) => (
                                <UserCard
                                    key={u.id}
                                    user={u}
                                    onEdit={startEdit}
                                    onRemove={handleRemove}
                                />
                            ))}

                            {filtered.length === 0 && (
                                <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm">
                                    Sem resultados.
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
