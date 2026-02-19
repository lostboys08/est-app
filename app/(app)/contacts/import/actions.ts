"use server";

import * as XLSX from "xlsx";
import prisma from "@/lib/prisma";
import { getDefaultUser } from "@/lib/user";

// Normalise a raw header string to a known field key
function mapHeader(raw: string): string | null {
  const h = raw.trim().toLowerCase().replace(/[\s_-]+/g, "");
  if (["name", "contactname", "fullname"].includes(h)) return "name";
  if (["company", "organization", "organisation", "firm"].includes(h)) return "company";
  if (["email", "emailaddress", "e-mail"].includes(h)) return "email";
  if (["phone", "phonenumber", "cell", "mobile", "telephone"].includes(h)) return "phone";
  if (["type", "contacttype", "category"].includes(h)) return "type";
  if (["subcategory", "sub-category", "subcat"].includes(h)) return "subCategory";
  if (["location", "city", "region", "area"].includes(h)) return "location";
  if (["notes", "note", "comments", "comment"].includes(h)) return "notes";
  return null;
}

// Map a raw type string to a canonical enum value
function mapType(raw: string | undefined): string {
  if (!raw) return "OTHER";
  const t = raw.trim().toLowerCase().replace(/[\s_-]+/g, "");
  if (["subcontractor", "sub", "subcon"].includes(t)) return "SUBCONTRACTOR";
  if (["supplier", "supply", "vendor"].includes(t)) return "SUPPLIER";
  if (["generalcontractor", "gc"].includes(t)) return "GENERAL_CONTRACTOR";
  if (["owner"].includes(t)) return "OWNER";
  if (["architect"].includes(t)) return "ARCHITECT";
  return "OTHER";
}

function matchKey(name: string, email: string | null) {
  return `${name.toLowerCase()}::${(email ?? "").toLowerCase()}`;
}

export type ImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
};

type ContactData = {
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  type: string;
  subCategory: string | null;
  location: string | null;
  notes: string | null;
};

export async function importContacts(formData: FormData): Promise<ImportResult> {
  const user = await getDefaultUser();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return { created: 0, updated: 0, skipped: 0, errors: ["No file provided."] };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: "",
    raw: false,
  });

  if (rows.length === 0) {
    return { created: 0, updated: 0, skipped: 0, errors: ["The spreadsheet appears to be empty."] };
  }

  // Build header mapping from the first row's keys
  const rawHeaders = Object.keys(rows[0]);
  const headerMap: Record<string, string> = {};
  for (const h of rawHeaders) {
    const mapped = mapHeader(h);
    if (mapped) headerMap[h] = mapped;
  }

  // Fetch existing contacts once and build a lookup map keyed by name::email
  const existing = await prisma.contact.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, email: true },
  });
  const existingMap = new Map(
    existing.map((c) => [matchKey(c.name, c.email), c.id])
  );

  const errors: string[] = [];
  const toCreate: (ContactData & { userId: string })[] = [];
  const toUpdate: { id: string; data: ContactData }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // 1-indexed + header row

    const rec: Record<string, string> = {};
    for (const [rawKey, fieldKey] of Object.entries(headerMap)) {
      rec[fieldKey] = (row[rawKey] ?? "").toString().trim();
    }

    const name = rec.name;
    if (!name) {
      errors.push(`Row ${rowNum}: skipped — no name.`);
      continue;
    }

    const data: ContactData = {
      name,
      company: rec.company || null,
      email: rec.email || null,
      phone: rec.phone || null,
      type: mapType(rec.type),
      subCategory: rec.subCategory || null,
      location: rec.location || null,
      notes: rec.notes || null,
    };

    const existingId = existingMap.get(matchKey(name, data.email));
    if (existingId) {
      toUpdate.push({ id: existingId, data });
    } else {
      toCreate.push({ ...data, userId: user.id });
    }
  }

  // Bulk create new contacts
  const createResult = await prisma.contact.createMany({ data: toCreate });

  // Update existing contacts individually
  await Promise.all(
    toUpdate.map(({ id, data }) =>
      prisma.contact.update({ where: { id }, data })
    )
  );

  return {
    created: createResult.count,
    updated: toUpdate.length,
    skipped: errors.length,
    errors,
  };
}
