'use client'

import { useState } from "react";
import { Material, OWNER_OPTIONS } from "@/utils/inventarioUtils";
import { useInventario } from "@/hooks/useInventario";
import BaseButton from "@/components/inventario/BaseButton";
import ProductCard from "@/components/inventario/ProductCard";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from "@mui/icons-material/Refresh";


/* Pagina do inventário */
export default function InventarioPage() {
    const {
        filtered,
        threshold,
        lowCount,
        loading,
        err,
        search,
        setSearch,
        setErr,
        reload,
        createMaterial,
        updateMaterial,
        removeMaterial,
    } = useInventario();

    // Estados de criação ou edição
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);

    const [newIdProduto, setNewIdProduto] = useState("");
    const [newName, setNewName] = useState("");
    const [newQty, setNewQty] = useState<number | "">(0);
    const [newOwner, setNewOwner] = useState("");

    // Submissão da edição ou criação
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!newOwner) {
            setErr("Seleciona um Responsável.");
            return;
        }

        const qty = Number(newQty);

        if (Number.isNaN(qty) || qty < 0) {
            setErr("Quantidade inválida.");
            return;
        }

        try {
            // edição
            if (editing) {
                await updateMaterial({
                    id: editing,
                    idProduto: newIdProduto,
                    name: newName,
                    quantity: qty,
                    owner: newOwner,
                });
            } else {
                // criação
                await createMaterial({
                    idProduto: newIdProduto.trim(),
                    name: newName.trim(),
                    quantity: Number(newQty),
                    owner: newOwner.trim(),
                });
            }

            // o formulário é esvaziado e escondido
            resetForm();
            setShowCreate(false);
        } catch (e: any) {
            setErr(e?.message || "Erro ao guardar");
        }
    }

    function startEdit(m: Material) {
        setEditing(m.id);
        setNewIdProduto(m.idProduto);
        setNewName(m.name);
        setNewQty(m.quantity);
        setNewOwner(m.owner);
        setShowCreate(true);
    }

    // esvazia o formulário de criação/edição
    function resetForm() {
        setEditing(null);
        setNewIdProduto("");
        setNewName("");
        setNewQty(0);
        setNewOwner("");
    }

    // Remoção de um material
    async function handleRemove(id: string) {
        try {
            await removeMaterial(id);
        } catch (e: any) {
            setErr(e?.message || "Erro ao eliminar");
        }
    }

    // Formato dos elementos de input e labels
    const inputBase =
        "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm " +
        "text-gray-500 placeholder-gray-400 " +
        "focus:border-gray-500 focus:ring-2 focus:ring-gray-200 " +
        "disabled:bg-gray-100 disabled:text-gray-700";

    const inputLabel =
        "mb-1 block text-xs font-semibold text-gray-700";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">

                {/* Título e informações de stock baixo */}
                <div className="flex flex-col gap-2">
                    <div>
                        <div className="flex flex-row items-center relative">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                                Inventário
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
                            Limiar de stock baixo:{" "}
                            <span className="font-semibold text-gray-900">{threshold}</span>
                            {" · "}
                            {lowCount > 0 ? (
                                <span className="font-semibold text-gray-900">{lowCount} item(ns) em stock baixo</span>
                            ) : (
                                <span>Sem alertas</span>
                            )}
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
                                    value={newIdProduto}
                                    onChange={(e) => setNewIdProduto(e.target.value)}
                                    placeholder="ex: Battery_Pack"
                                />
                            </div>

                            {/* Nome */}
                            <div>
                                <label className={inputLabel}> Nome </label>
                                <input
                                    className={inputBase}
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="ex: Caixa parafusos 64"
                                />
                            </div>

                            {/* Responsável */}
                            <div>
                                <label className={inputLabel}> Responsável </label>
                                <select
                                    className={inputBase + " min-w-0"}
                                    value={newOwner}
                                    onChange={(e) => setNewOwner(e.target.value)}
                                >
                                    <option value=""> Selecionar… </option>
                                    {OWNER_OPTIONS.map((o) => (
                                        <option key={o} value={o}>
                                            {o}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Quantidade */}
                            <div>
                                <label className={inputLabel}> Quantidade </label>
                                <input
                                    type="number"
                                    min={0}
                                    className={inputBase}
                                    value={newQty}
                                    onChange={(e) => setNewQty(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>

                            {/* Botões de cancelar e editar */}
                            <div className="sm:col-span-2 flex justify-end gap-2">
                                <BaseButton
                                    onClick={() => {
                                        resetForm();
                                        setShowCreate(false);
                                    }}
                                    variant={"btnDanger"}
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
                            <span className="font-semibold"> Erro: </span> {err}
                        </div>
                        <BaseButton
                            onClick={() => setErr(null)} variant={"btnDanger"}
                            className="!rounded-lg !bg-white !px-2 !py-1 !text-xs"
                        >
                            Fechar
                        </BaseButton>
                    </div>
                )}

                {/* Barra de pesquisa e de botão para adicionar novo material */}
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
                            placeholder="ID, Nome ou Responsável…"
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

                {/* Lista de materiais */}
                <div className="mt-6">
                    {loading ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
                            A carregar…
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                            {filtered.map((m) => (
                                <ProductCard
                                    material={m}
                                    onEdit={startEdit}
                                    onRemove={handleRemove}
                                />
                            ))}

                            {filtered.length === 0 && (
                                <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
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
