// src/pages/api/materials.ts
import type { NextApiRequest, NextApiResponse } from "next";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Inventario";

const IDPROD_FIELD = process.env.AIRTABLE_IDPROD_FIELD || "ID_Produto";
const NAME_FIELD = process.env.AIRTABLE_NAME_FIELD || "Nome";
const QTY_FIELD = process.env.AIRTABLE_QTY_FIELD || "Quantidade";
const OWNER_FIELD = process.env.AIRTABLE_OWNER_FIELD || "Responsável";
const MINIMUM = process.env.AIRTABLE_MINIMUM || "Minimo";

const LOW_STOCK_THRESHOLD = Number(process.env.LOW_STOCK_THRESHOLD ?? 2); //Minimo de stock

function airtableUrl(path = "") {
  return `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}${path}`; //Constrói a URL base para fazer pedidos
}

async function airtableFetch(url: string, init?: RequestInit) {
  const r = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const text = await r.text();
  const data = text ? JSON.parse(text) : null;

  if (!r.ok) {
    const msg = data?.error?.message || data?.error || r.statusText;
    throw new Error(msg);
  }
  return data;
}

type Material = {
  id: string;          // Airtable record id
  idProduto: string;   // ID_Produto 
  name: string;        // Nome
  quantity: number;    // Quantidade
  owner: string;       // Responsável
  low: boolean;        // quantity <= threshold
};

function mapRecord(rec: any): Material {
  const f = rec.fields || {};
  const quantity = Number(f[QTY_FIELD] ?? 0);
  return {
    id: rec.id,
    idProduto: String(f[IDPROD_FIELD] ?? ""),
    name: String(f[NAME_FIELD] ?? ""),
    quantity,
    owner: String(f[OWNER_FIELD] ?? ""),
    low: Number.isFinite(quantity) ? quantity <= LOW_STOCK_THRESHOLD : false,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!AIRTABLE_API_KEY || !BASE_ID) {
      res.status(500).json({ error: "Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID" });
      return;
    }

    if (req.method === "GET") {
      let offset: string | undefined;
      const all: any[] = [];

      do {
        const url = new URL(airtableUrl(), "https://api.airtable.com");
        url.searchParams.set("pageSize", "100");
        url.searchParams.set("sort[0][field]", NAME_FIELD);
        url.searchParams.set("sort[0][direction]", "asc");
        if (offset) url.searchParams.set("offset", offset);

        const data = await airtableFetch(url.toString());
        all.push(...(data.records || []));
        offset = data.offset;
      } while (offset);

      res.status(200).json({ materials: all.map(mapRecord), lowThreshold: LOW_STOCK_THRESHOLD });
      return;
    }

    if (req.method === "POST") {
      const { idProduto, name, quantity, owner } = req.body || {};
      if (!name || typeof name !== "string") {
        res.status(400).json({ error: "Field 'name' is required" });
        return;
      }

      const payload = {
        fields: {
          [IDPROD_FIELD]: idProduto ?? "",
          [NAME_FIELD]: name,
          [QTY_FIELD]: Number(quantity ?? 0),
          [OWNER_FIELD]: owner ?? "",
          [MINIMUM] : 2,

        },
      };

      const created = await airtableFetch(airtableUrl(), {
        method: "POST",
        body: JSON.stringify(payload),
      });

      res.status(201).json({ material: mapRecord(created) });
      return;
    }

    if (req.method === "PATCH") {
      const { id, idProduto, name, quantity, owner } = req.body || {};
      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "Field 'id' (record id) is required" });
        return;
      }

      const fields: Record<string, any> = {};
      if (idProduto !== undefined) fields[IDPROD_FIELD] = idProduto;
      if (name !== undefined) fields[NAME_FIELD] = name;
      if (quantity !== undefined) fields[QTY_FIELD] = Number(quantity);
      if (owner !== undefined) fields[OWNER_FIELD] = owner;

      const updated = await airtableFetch(airtableUrl(`/${id}`), {
        method: "PATCH",
        body: JSON.stringify({ fields }),
      });

      res.status(200).json({ material: mapRecord(updated) });
      return;
    }

    if (req.method === "DELETE") {
      const id = String(req.query.id || "");
      if (!id) {
        res.status(400).json({ error: "Query param 'id' is required" });
        return;
      }

      const deleted = await airtableFetch(airtableUrl(`/${id}`), { method: "DELETE" });
      res.status(200).json({ deletedId: deleted?.id ?? id });
      return;
    }

    res.setHeader("Allow", "GET,POST,PATCH,DELETE");
    res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
}
