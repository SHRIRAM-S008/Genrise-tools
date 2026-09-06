"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import DownloadButton from "@/components/DownloadButton";
import { buildResumePdf, type ResumeData } from "@/lib/resumeBuilder";

const emptyExperience = { role: "", company: "", period: "", details: "" };
const emptyEducation = { school: "", degree: "", period: "" };

export default function ResumeBuilderPage() {
  const [data, setData] = useState<ResumeData>({
    name: "",
    title: "",
    email: "",
    phone: "",
    summary: "",
    experience: [{ ...emptyExperience }],
    education: [{ ...emptyEducation }],
    skills: "",
  });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  function update<K extends keyof ResumeData>(key: K, value: ResumeData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  async function run() {
    setBusy(true);
    try {
      const output = await buildResumePdf(data);
      setResult(output);
    } finally {
      setBusy(false);
    }
  }

  const inputClass = "rounded-lg border border-border px-3 py-2";

  return (
    <ToolLayout title="Resume Builder" description="Fill in your details and export a clean PDF resume — no account needed.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input placeholder="Full name" value={data.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
        <input placeholder="Title (e.g. Software Engineer)" value={data.title} onChange={(e) => update("title", e.target.value)} className={inputClass} />
        <input placeholder="Email" value={data.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
        <input placeholder="Phone" value={data.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
      </div>

      <textarea placeholder="Summary" value={data.summary} onChange={(e) => update("summary", e.target.value)} rows={3} className={inputClass} />

      <div className="flex flex-col gap-3">
        <h2 className="font-medium">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-border p-3 sm:grid-cols-2">
            <input placeholder="Role" value={exp.role} onChange={(e) => update("experience", data.experience.map((x, j) => j === i ? { ...x, role: e.target.value } : x))} className={inputClass} />
            <input placeholder="Company" value={exp.company} onChange={(e) => update("experience", data.experience.map((x, j) => j === i ? { ...x, company: e.target.value } : x))} className={inputClass} />
            <input placeholder="Period (e.g. 2022–Present)" value={exp.period} onChange={(e) => update("experience", data.experience.map((x, j) => j === i ? { ...x, period: e.target.value } : x))} className={inputClass} />
            <textarea placeholder="Details" value={exp.details} onChange={(e) => update("experience", data.experience.map((x, j) => j === i ? { ...x, details: e.target.value } : x))} rows={2} className={`${inputClass} sm:col-span-2`} />
          </div>
        ))}
        <button onClick={() => update("experience", [...data.experience, { ...emptyExperience }])} className="w-fit rounded-full border border-border px-4 py-2 text-sm">+ Add experience</button>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-medium">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-border p-3 sm:grid-cols-3">
            <input placeholder="School" value={edu.school} onChange={(e) => update("education", data.education.map((x, j) => j === i ? { ...x, school: e.target.value } : x))} className={inputClass} />
            <input placeholder="Degree" value={edu.degree} onChange={(e) => update("education", data.education.map((x, j) => j === i ? { ...x, degree: e.target.value } : x))} className={inputClass} />
            <input placeholder="Period" value={edu.period} onChange={(e) => update("education", data.education.map((x, j) => j === i ? { ...x, period: e.target.value } : x))} className={inputClass} />
          </div>
        ))}
        <button onClick={() => update("education", [...data.education, { ...emptyEducation }])} className="w-fit rounded-full border border-border px-4 py-2 text-sm">+ Add education</button>
      </div>

      <textarea placeholder="Skills (comma-separated)" value={data.skills} onChange={(e) => update("skills", e.target.value)} rows={2} className={inputClass} />

      <button onClick={run} disabled={!data.name || busy} className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50">
        {busy ? "Building…" : "Generate Resume PDF"}
      </button>

      {result && (
        <div className="rounded-2xl border border-border p-5">
          <DownloadButton blob={result.blob} filename={result.filename} />
        </div>
      )}
    </ToolLayout>
  );
}
