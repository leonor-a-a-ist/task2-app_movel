import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TABLE = process.env.AIRTABLE_USERS_TABLE!;

/* Campos da tabela */
const ID_FIELD = process.env.AIRTABLE_USER_ID_FIELD!;
const NAME_FIELD = process.env.AIRTABLE_USER_NAME_FIELD!;
const EMAIL_FIELD = process.env.AIRTABLE_USER_EMAIL_FIELD!;
const AREA_FIELD = process.env.AIRTABLE_USER_AREA_FIELD!;

/* URL da tabela */
function airtableUrl(path = "") {
    return `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}${path}`;
}

async function airtableFetch(url: string, init?: RequestInit) {
    const r = await fetch(url, {
        ...init,
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
    });

    const text = await r.text();
    const data = text ? JSON.parse(text) : null;
    if (!r.ok) {
        throw new Error(data?.error?.message || data?.error || r.statusText);
    }
    return data;
}

type User = {
    id: string;         // Airtable record id
    ID_User: string;    // ID_Users
    name: string;       // Nome
    mail: string;       // Email
    area: string;       // Departamento
};

/* Mapeia um registro da Airtable para um objeto do tipo User */
function mapUser(rec: any): User {
    const f = rec.fields || {};
    return {
        id: rec.id,
        ID_User: String(f[ID_FIELD] ?? ""),
        name: String(f[NAME_FIELD] ?? ""),
        mail: String(f[EMAIL_FIELD] ?? ""),
        area: String(f[AREA_FIELD] ?? ""),
    };
}

/**
 * Lida com pedidos para /api/materials
 * suporta os métodos: GET, POST, PATCH, DELETE
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!API_KEY || !BASE_ID) {
            // Falha cedo se não houver API_KEY ou BASE_ID
            res.status(500).json({ error: "Missing API_KEY or BASE_ID" });
            return;
        }

        /* GET - buscar materiais */
        if (req.method === "GET") {

            let offset: string | undefined;
            const all: any[] = [];

            // executa pelo menos uma vez, e depois apenas enquanto houver offset
            do {
                const url = new URL(airtableUrl(), "https://api.airtable.com");
                url.searchParams.set("pageSize", "100");    // 100 registos por pedido
                url.searchParams.set("sort[0][field]", NAME_FIELD);
                url.searchParams.set("sort[0][direction]", "asc");

                if (offset) url.searchParams.set("offset", offset);

                const data = await airtableFetch(url.toString());

                //guarda registos e atualiza o offset
                all.push(...(data.records || []));
                offset = data.offset;

            } while (offset);
            res.status(200).json({ users: all.map(mapUser) });
            return;
        }

        if (req.method === "POST") {
            const { ID_User, name, mail, area } = req.body || {};

            if (!name || typeof name !== "string") {
                res.status(400).json({ error: "Campo 'Nome' por preencher." });
                return;
            }
            if (!ID_User || typeof ID_User !== "string") {
                res.status(400).json({ error: "Campo 'ID' por preencher." });
                return;
            }
            if (!mail || typeof mail !== "string") {
                res.status(400).json({ error: "Campo 'Email' por preencher." });
                return;
            }
            if (!area || typeof area !== "string") {
                res.status(400).json({ error: "Campo 'Departamento' por preencher." });
                return;
            }

            // dados enviados num request para Airtable (apenas os campos necessários)
            const created = await airtableFetch(airtableUrl(), {
                method: "POST",
                body: JSON.stringify({
                    fields: {
                        [ID_FIELD]: ID_User,
                        [NAME_FIELD]: name,
                        [EMAIL_FIELD]: mail,
                        [AREA_FIELD]: area,
                    },
                }),
            });

            res.status(201).json({ users: mapUser(created) });
            return;
        }

        /* PATCH - atualizar material */
        if (req.method === "PATCH") {
            const { id, ID_User, name, mail, area } = req.body || {};

            if (!id || typeof id !== "string") {
                res.status(400).json({ error: "Field 'id' is required" });
                return;
            }

            // construir o payload só com os campos que foram alterados
            const fields: Record<string, any> = {};
            if (ID_User !== undefined) fields[ID_FIELD] = ID_User;
            if (name !== undefined) fields[NAME_FIELD] = name;
            if (mail !== undefined) fields[EMAIL_FIELD] = mail;
            if (area !== undefined) fields[AREA_FIELD] = area;

            const updated = await airtableFetch(airtableUrl(`/${id}`), {
                method: "PATCH",
                body: JSON.stringify({ fields }),
            });

            res.status(200).json({ users: mapUser(updated) });
            return;
        }

        /* DELETE - eliminar material */
        if (req.method === "DELETE") {
            const id = String(req.query.id || "");

            if (!id) {
                res.status(400).json({ error: "Query param 'id' is required" });
                return;
            }

            const deleted = await airtableFetch(airtableUrl(`/${id}`), {
                method: "DELETE"
            });

            res.status(200).json({ deletedId: deleted?.id ?? id });
            return;
        }

        res.setHeader("Allow", "GET,POST,PATCH,DELETE");
        res.status(405).json({ error: "Method not allowed" });

    } catch (e: any) {
        // Garantir resposta consistente de erro
        res.status(500).json({ error: e.message });
    }
}
