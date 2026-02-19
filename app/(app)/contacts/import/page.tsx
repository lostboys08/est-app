"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { importContacts, ImportResult } from "./actions";

export default function ImportContactsPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await importContacts(formData);
      setResult(res);
    });
  }

  function handleReset() {
    setResult(null);
    setFileName(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-4">
        <Link href="/contacts">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Import Contacts</h1>
          <p className="text-[var(--muted-foreground)]">
            Upload an Excel spreadsheet to bulk-import contacts.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Spreadsheet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Accepted column headers (case-insensitive):
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {[
                    ["Name", "required"],
                    ["Company", "optional"],
                    ["Email", "optional"],
                    ["Phone", "optional"],
                    ["Type", "Subcontractor / Supplier / GC / Owner / Architect"],
                    ["SubCategory", "optional"],
                    ["Location", "optional"],
                    ["Notes", "optional"],
                  ].map(([col, hint]) => (
                    <div key={col} className="contents">
                      <span className="font-mono font-medium">{col}</span>
                      <span className="text-[var(--muted-foreground)]">{hint}</span>
                    </div>
                  ))}
                </div>
              </div>

              <label
                htmlFor="file-input"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--border)] px-6 py-10 cursor-pointer hover:border-[var(--ring)] transition-colors"
              >
                <Upload className="h-8 w-8 text-[var(--muted-foreground)]" />
                <span className="text-sm font-medium">
                  {fileName ?? "Click to choose an .xlsx file"}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  .xlsx or .xls
                </span>
                <input
                  ref={fileRef}
                  id="file-input"
                  name="file"
                  type="file"
                  accept=".xlsx,.xls"
                  className="sr-only"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  required
                />
              </label>

              <Button type="submit" disabled={isPending || !fileName} className="w-full">
                {isPending ? "Importing…" : "Import Contacts"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  {result.created > 0 && (
                    <p className="font-medium">
                      {result.created} contact{result.created !== 1 ? "s" : ""} created
                    </p>
                  )}
                  {result.updated > 0 && (
                    <p className="font-medium">
                      {result.updated} contact{result.updated !== 1 ? "s" : ""} updated
                    </p>
                  )}
                  {result.created === 0 && result.updated === 0 && (
                    <p className="font-medium">No changes — all rows already matched existing contacts.</p>
                  )}
                  {result.skipped > 0 && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {result.skipped} row{result.skipped !== 1 ? "s" : ""} skipped
                    </p>
                  )}
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="rounded-lg bg-[var(--muted)] p-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
                    <AlertCircle className="h-4 w-4" />
                    Skipped rows
                  </div>
                  <ul className="text-sm text-[var(--muted-foreground)] list-disc list-inside space-y-0.5">
                    {result.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <Link href="/contacts">
                  <Button>View Contacts</Button>
                </Link>
                <Button variant="secondary" onClick={handleReset}>
                  Import Another File
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
