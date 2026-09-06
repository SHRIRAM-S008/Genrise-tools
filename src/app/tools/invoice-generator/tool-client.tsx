"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import DownloadButton from "@/components/DownloadButton";
import { X } from "lucide-react";
import { buildInvoicePdf, type InvoiceData, type InvoiceItem } from "@/lib/invoiceGenerator";

const emptyItem: InvoiceItem = { description: "", quantity: 1, price: 0 };

export default function InvoiceGeneratorPage() {
  const [data, setData] = useState<InvoiceData>({
    businessName: "",
    businessAddress: "",
    customerName: "",
    invoiceNumber: "001",
    date: new Date().toISOString().slice(0, 10),
    items: [{ ...emptyItem }],
    taxPercent: 0,
    discount: 0,
  });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  function update<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  function updateItem(index: number, patch: Partial<InvoiceItem>) {
    update("items", data.items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  async function run() {
    setBusy(true);
    try {
      const output = await buildInvoicePdf(data);
      setResult(output);
    } finally {
      setBusy(false);
    }
  }

  const inputClass = "rounded-lg border border-border px-3 py-2";
  const subtotal = data.items.reduce((sum, it) => sum + it.quantity * it.price, 0);

  return (
    <ToolLayout title="Invoice Generator" description="Create a simple, professional invoice PDF for a client.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input placeholder="Your business name" value={data.businessName} onChange={(e) => update("businessName", e.target.value)} className={inputClass} />
        <input placeholder="Business address" value={data.businessAddress} onChange={(e) => update("businessAddress", e.target.value)} className={inputClass} />
        <input placeholder="Customer name" value={data.customerName} onChange={(e) => update("customerName", e.target.value)} className={inputClass} />
        <input placeholder="Invoice number" value={data.invoiceNumber} onChange={(e) => update("invoiceNumber", e.target.value)} className={inputClass} />
        <input type="date" value={data.date} onChange={(e) => update("date", e.target.value)} className={inputClass} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-medium">Items</h2>
        {data.items.map((item, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_100px_auto] gap-2">
            <input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, { description: e.target.value })} className={inputClass} />
            <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} className={inputClass} />
            <input type="number" placeholder="Price" value={item.price} onChange={(e) => updateItem(i, { price: Number(e.target.value) })} className={inputClass} />
            <button onClick={() => update("items", data.items.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="size-4" /></button>
          </div>
        ))}
        <button onClick={() => update("items", [...data.items, { ...emptyItem }])} className="w-fit rounded-full border border-border px-4 py-2 text-sm">+ Add item</button>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tax %</span>
          <input type="number" value={data.taxPercent} onChange={(e) => update("taxPercent", Number(e.target.value))} className={`w-24 ${inputClass}`} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Discount %</span>
          <input type="number" value={data.discount} onChange={(e) => update("discount", Number(e.target.value))} className={`w-24 ${inputClass}`} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">Subtotal: {subtotal.toFixed(2)}</p>

      <button onClick={run} disabled={!data.businessName || busy} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50">
        {busy ? "Building…" : "Generate Invoice PDF"}
      </button>

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
