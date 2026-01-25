import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Material = {
  id: string;
  idProduto: string;
  name: string;
  quantity: number;
  owner: string;
  low: boolean;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error || r.statusText);
  return data;
}

const OWNER_OPTIONS = ["Propulsão", "Estruturas", "Aerodinâmica e Arrefecimento"]; //opcoes para Responsavel

export default function InventarioPage() {
    //criar novo produto 
  const [materials, setMaterials] = useState<Material[]>([]);
  const [threshold, setThreshold] = useState<number>(2);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [newIdProduto, setNewIdProduto] = useState("");
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState<number>(0);
  const [newOwner, setNewOwner] = useState("");

  const lowCount = useMemo(() => materials.filter((m) => m.low).length, [materials]);

  //pesquisa 
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return materials;//se nao houver pesquisa retorna a lista toda 
    return materials.filter(//se houver filtra
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.idProduto.toLowerCase().includes(q) ||
        m.owner.toLowerCase().includes(q)
    );
  }, [materials, search]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await api<{ materials: Material[]; lowThreshold: number }>("/api/materials");
      setMaterials(data.materials);
      if (Number.isFinite(data.lowThreshold)) setThreshold(data.lowThreshold);
    } catch (e: any) {
      setErr(e?.message || "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  //criar material
  async function createMaterial(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!newOwner) {
      setErr("Seleciona um Responsável.");
      return;
    }

    try {
      await api("/api/materials", {
        method: "POST",
        body: JSON.stringify({
          idProduto: newIdProduto.trim(),
          name: newName.trim(),
          quantity: Number(newQty),
          owner: newOwner.trim(),
        }),
      });
      setNewIdProduto("");
      setNewName("");
      setNewQty(0);
      setNewOwner("");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Erro ao criar");
    }
  }

  //atualizar material
  async function patch(
    id: string,
    fields: Partial<Pick<Material, "idProduto" | "name" | "quantity" | "owner">>
  ) {
    setErr(null);
    try {
      await api("/api/materials", { method: "PATCH", body: JSON.stringify({ id, ...fields }) });
      await load();
    } catch (e: any) {
      setErr(e?.message || "Erro ao atualizar");
    }
  }

  //eliminar material
  async function remove(id: string) {
    setErr(null);
    if (!confirm("Eliminar este material?")) return;
    try {
      await api(`/api/materials?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      await load();
    } catch (e: any) {
      setErr(e?.message || "Erro ao eliminar");
    }
  }

  //inputs e dropdowns 
  const inputBase =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm " +
    "text-gray-500 placeholder-gray-400 " +
    "focus:border-gray-500 focus:ring-2 focus:ring-gray-200 " +
    "disabled:bg-gray-100 disabled:text-gray-700";

    //botoes normais 
  const btnBase =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold " +
    "border border-gray-300 bg-white text-gray-900 " +
    "hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

    //botao principal criar 
  const btnPrimary =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold " +
    "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-900 " +
    "focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed";

    //etiquetas (por baixo do nome de cada)
  const pill =
    "inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 " +
    "text-xs font-semibold text-gray-700";

  return (
    //cabecalho 
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Inventário</h1>
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

          <div className="flex flex-wrap gap-2">
            <Link href="/" className={btnBase}>
              Página principal
            </Link>

            <button onClick={load} className={btnBase}>
              Recarregar
            </button>
          </div>
        </div>

        <div className="mt-4">
          <input
            className={inputBase}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por ID_Produto, Nome ou Responsável…"
          />
        </div>

        {err && (
          <div className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
            <div>
              <span className="font-semibold">Erro:</span> {err}
            </div>
            <button
              onClick={() => setErr(null)}
              className="rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-100"
            >
              Fechar
            </button>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <form onSubmit={createMaterial} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-3">
              <label className="mb-1 block text-xs font-semibold text-gray-700">ID_Produto</label>
              <input
                className={inputBase}
                value={newIdProduto}
                onChange={(e) => setNewIdProduto(e.target.value)}
                placeholder="ex: Battery_Pack"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="mb-1 block text-xs font-semibold text-gray-700">Nome</label>
              <input
                required
                className={inputBase}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="ex: Caixa parafusos 64"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-gray-700">Quantidade</label>
              <input
                type="number"
                className={inputBase}
                value={newQty}
                onChange={(e) => setNewQty(Number(e.target.value))}
              />
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1 block text-xs font-semibold text-gray-700">Responsável</label>
              <select className={inputBase} value={newOwner} onChange={(e) => setNewOwner(e.target.value)}>
                <option value="">Selecionar…</option>
                {OWNER_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-12 flex justify-end">
              <button type="submit" className={btnPrimary}>
                Criar
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
              A carregar…
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((m) => (
                <div
                  key={m.id}
                  className={[
                    "rounded-2xl border p-4 shadow-sm",
                    m.low ? "border-yellow-300 bg-yellow-50" : "border-gray-200 bg-white",
                  ].join(" ")}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-extrabold text-gray-900">{m.name}</h3>
                        {m.low && (
                          <span className="rounded-full bg-yellow-200 px-2.5 py-1 text-xs font-bold text-yellow-900">
                            Stock baixo
                          </span>
                        )}
                        {m.owner && <span className={pill}>{m.owner}</span>}
                      </div>

                      <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-700">
                        <span className={pill}>ID_Produto: {m.idProduto || "—"}</span>
                        <span className={pill}>Quantidade: {m.quantity}</span>
                      </div>
                    </div>

                    <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">ID_Produto</label>
                        <input
                          className={inputBase}
                          defaultValue={m.idProduto}
                          onBlur={(e) => patch(m.id, { idProduto: e.target.value })}
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="mb-1 block text-xs font-semibold text-gray-700">Nome</label>
                        <input
                          className={inputBase}
                          defaultValue={m.name}
                          onBlur={(e) => patch(m.id, { name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">Qtd</label>
                        <input
                          type="number"
                          className={inputBase}
                          defaultValue={m.quantity}
                          onBlur={(e) => patch(m.id, { quantity: Number(e.target.value) })}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">Responsável</label>
                        <input
                          className={inputBase}
                          defaultValue={m.owner}
                          onBlur={(e) => patch(m.id, { owner: e.target.value })}
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                        <button
                          onClick={() => remove(m.id)}
                          className="rounded-xl px-4 py-2 text-sm font-semibold border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
