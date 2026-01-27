import { Material } from "@/utils/inventarioUtils";
import BaseButton from "@/components/inventario/BaseButton";
import Tag from "@/components/inventario/Tag";

type Props = {
    material: Material;
    onEdit: (material: Material) => void;
    onRemove: (id: string) => void;
};

/* Display de cada um dos materiais existentes */
export default function ProductCard({ material: m, onEdit, onRemove }: Props) {
    return (
        <div
            className={["rounded-2xl border p-4 shadow-sm",
                m.low ? "border-yellow-300 bg-yellow-50" : "border-gray-200 bg-white",].join(" ")}
        >
            <div className="flex flex-col gap-3">

                {/* Informação do produto */}
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-extrabold text-gray-900">{m.name}</h3>
                        {m.low && (
                            <Tag variant="warning">Stock baixo</Tag>
                        )}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-700">
                        <Tag>ID: {m.idProduto || "—"}</Tag>
                        <Tag>Quantidade: {m.quantity}</Tag>
                        {m.owner && <Tag>{m.owner}</Tag>}

                    </div>
                </div>

                {/* Botões de editar e eliminar produto */}
                <div className="flex flex-row justify-end gap-2">
                    <BaseButton onClick={() => onEdit(m)} variant={"btnBase"}>
                        Editar
                    </BaseButton>
                    <BaseButton onClick={() => onRemove(m.id)} variant={"btnDanger"}>
                        Eliminar
                    </BaseButton>
                </div>
            </div>
        </div>
    );
}