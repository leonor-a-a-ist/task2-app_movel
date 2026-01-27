'use client';

import BaseButton from "@/components/inventario/BaseButton";
import Tag from "@/components/inventario/Tag";
import { User } from "@/utils/userUtils";
import { useState } from "react";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
    user: User;
    onEdit: (user: User) => void;
    onRemove: (id: string) => void;
};

/* Display de cada um dos utilizadores registados */
export default function UserCard({ user: u, onEdit, onRemove }: Props) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3">

                {/* Nome, departamento e icon de expandir */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-extrabold text-gray-900">
                            {u.name}
                        </h3>

                        <div className="mt-1 text-sm text-gray-700">
                            <Tag>{u.area}</Tag>
                        </div>
                    </div>
                    <IconButton
                        onClick={() => setExpanded((v) => !v)}
                        size="small"
                        className="border border-gray-300 text-gray-600"
                    >
                        {expanded ? <CloseIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                    </IconButton>
                </div>

                {/* card expandido - detalhes da pessoa */}
                {expanded && (
                    <div className="flex flex-col gap-3 border-t ">

                        <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                            <Tag>ID: {u.ID_User}</Tag>
                            <Tag>Email: {u.mail}</Tag>
                        </div>

                        <div className="flex justify-end gap-2">
                            <BaseButton
                                onClick={() => onEdit(u)}
                                variant="btnBase"
                            >
                                Editar
                            </BaseButton>

                            <BaseButton
                                onClick={() => onRemove(u.id)}
                                variant="btnDanger"
                            >
                                Eliminar
                            </BaseButton>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}