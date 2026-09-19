"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import DownloadButton from "@/components/DownloadButton";
import { X } from "lucide-react";
import { buildInvoicePdf, CURRENCIES, type InvoiceData, type InvoiceItem } from "@/lib/invoiceGenerator";
import { useLocalDraft } from "@/lib/useLocalDraft";
import { todayInputValue } from "@/lib/dateInput";

const emptyItem: InvoiceItem = { description: "", quantity: 1, price: 0 };

const emptyInvoice: InvoiceData = {
  businessName: "",
  businessAddress: "",
  customerName: "",
  invoiceNumber: "001",
  date: "",
  items: [{ ...emptyItem }],
  taxPercent: 0,
  discount: 0,
  currency: "$",
  notes: "",
};

export default function InvoiceGeneratorPage() {
  const { value: data, setValue: setData, clearDraft, restored } = useLocalDraft("genrise:invoice-draft", emptyInvoice);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  function updateItem(index: number, patch: Partial<InvoiceItem>) {
    update("items", data.items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const output = await buildInvoicePdf({ ...data, date: data.date || todayInputValue() });
      setResult(output);
    } catch {
      setError("Couldn't build the invoice PDF. Check the item values and try again.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass = "rounded-lg border border-border px-3 py-2";
  const currency = data.currency ?? "";
  const subtotal = data.items.reduce((sum, it) => sum + it.quantity * it.price, 0);
  const discountAmount = (subtotal * data.discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * data.taxPercent) / 100;
  const total = subtotal - discountAmount + taxAmount;
  const money = (value: number) => `${currency}${value.toFixed(2)}`;

  return (
    <ToolLayout title="Invoice Generator" description="Create a simple, professional invoice PDF for a client.">
      {restored && (
        <p className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-accent/30 px-3 py-2 text-sm text-muted-foreground">
          Restored your last draft from this device.
          <button onClick={clearDraft} className="font-medium text-primary hover:underline">
            Start fresh
          </button>
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input placeholder="Your business name" value={data.businessName} onChange={(e) => update("businessName", e.target.value)} className={inputClass} />
        <input placeholder="Business address" value={data.businessAddress} onChange={(e) => update("businessAddress", e.target.value)} className={inputClass} />
        <input placeholder="Customer name" value={data.customerName} onChange={(e) => update("customerName", e.target.value)} className={inputClass} />
        <input placeholder="Invoice number" value={data.invoiceNumber} onChange={(e) => update("invoiceNumber", e.target.value)} className={inputClass} />
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Invoice date</span>
          <input type="date" value={data.date || todayInputValue()} onChange={(e) => update("date", e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Currency</span>
          <select value={currency} onChange={(e) => update("currency", e.target.value)} className={inputClass}>
            {CURRENCIES.map((c) => (
              <option key={c.code || "none"} value={c.symbol}>
                {c.code ? `${c.code} (${c.symbol.trim()})` : "No symbol"}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-medium">Items</h2>
        {data.items.map((item, i) => (
          <div key={i} className="grid grid-cols-[1fr_70px_90px_auto] gap-2">
            <input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, { description: e.target.value })} className={inputClass} />
            <input type="number" min={0} placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) || 0 })} className={inputClass} />
            <input type="number" min={0} step="0.01" placeholder="Price" value={item.price} onChange={(e) => updateItem(i, { price: Number(e.target.value) || 0 })} className={inputClass} />
            <button
              aria-label={`Remove item ${i + 1}`}
              onClick={() => update("items", data.items.filter((_, j) => j !== i))}
              disabled={data.items.length === 1}
              className="text-muted-foreground hover:text-destructive disabled:opacity-30"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        <button onClick={() => update("items", [...data.items, { ...emptyItem }])} className="w-fit rounded-full border border-border px-4 py-2 text-sm">
          + Add item
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tax %</span>
          <input type="number" min={0} value={data.taxPercent} onChange={(e) => update("taxPercent", Number(e.target.value) || 0)} className={`w-24 ${inputClass}`} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Discount %</span>
          <input type="number" min={0} max={100} value={data.discount} onChange={(e) => update("discount", Number(e.target.value) || 0)} className={`w-24 ${inputClass}`} />
        </label>
      </div>

      <textarea
        placeholder="Notes (payment terms, bank details…)"
        value={data.notes ?? ""}
        onChange={(e) => update("notes", e.target.value)}
        rows={2}
        className={inputClass}
      />

      <dl className="grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1 rounded-2xl border border-border p-5 text-sm">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="text-right">{money(subtotal)}</dd>
        {data.discount > 0 && (
          <>
            <dt className="text-muted-foreground">Discount ({data.discount}%)</dt>
            <dd className="text-right">-{money(discountAmount)}</dd>
          </>
        )}
        {data.taxPercent > 0 && (
          <>
            <dt className="text-muted-foreground">Tax ({data.taxPercent}%)</dt>
            <dd className="text-right">{money(taxAmount)}</dd>
          </>
        )}
        <dt className="font-medium">Total</dt>
        <dd className="text-right font-medium">{money(total)}</dd>
      </dl>

      <div className="flex flex-wrap gap-3">
        <button onClick={run} disabled={!data.businessName || busy} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50">
          {busy ? "Building…" : "Generate Invoice PDF"}
        </button>
        <button onClick={clearDraft} className="w-fit rounded-full border border-border px-6 py-3 font-medium">
          Clear form
        </button>
      </div>

      {!data.businessName && <p className="text-sm text-muted-foreground">Add your business name to enable the PDF export.</p>}
      {error && <p className="text-destructive">{error}</p>}

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
