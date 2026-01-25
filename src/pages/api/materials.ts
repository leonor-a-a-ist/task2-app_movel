import type { NextApiRequest, NextApiResponse } from "next";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TABLE_ID = process.env.AIRTABLE_TABLE_NAME!;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${AIRTABLE_TOKEN}`,
            },
        });

        if (!response.ok) {
            return res
                .status(response.status)
                .json({ error: "Erro ao ir buscar dados" });
        }

        const data = await response.json();

        const records = data.records.map((r: any) => ({
            id: r.id,
            code: r.fields["ID_Produto"],
            name: r.fields["Nome"],
            quantity: r.fields["Quantidade"],
            responsavel: r.fields["Responsável"],
        }));

        return res.status(200).json({ records });
    } catch {
        return res.status(500).json({ error: "Erro interno" });
    }
}
