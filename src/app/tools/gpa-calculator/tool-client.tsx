"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { X } from "lucide-react";

interface Course {
  name: string;
  credits: number;
  grade: number; // 0-4 scale
}

const emptyCourse: Course = { name: "", credits: 3, grade: 4 };

export default function GpaCalculatorPage() {
  const [courses, setCourses] = useState<Course[]>([{ ...emptyCourse }]);

  const gpa = useMemo(() => {
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const totalPoints = courses.reduce((sum, c) => sum + c.credits * c.grade, 0);
    return totalCredits ? totalPoints / totalCredits : 0;
  }, [courses]);

  function update(index: number, patch: Partial<Course>) {
    setCourses((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  const inputClass = "rounded-lg border border-border px-3 py-2";

  return (
    <ToolLayout title="GPA Calculator" description="Calculate your GPA on a standard 4.0 scale.">
      <div className="flex flex-col gap-3">
        {courses.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_100px_auto] gap-2">
            <input placeholder="Course name" value={c.name} onChange={(e) => update(i, { name: e.target.value })} className={inputClass} />
            <input type="number" placeholder="Credits" value={c.credits} onChange={(e) => update(i, { credits: Number(e.target.value) })} className={inputClass} />
            <input type="number" step={0.1} min={0} max={4} placeholder="Grade" value={c.grade} onChange={(e) => update(i, { grade: Number(e.target.value) })} className={inputClass} />
            <button onClick={() => setCourses(courses.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="size-4" /></button>
          </div>
        ))}
        <button onClick={() => setCourses([...courses, { ...emptyCourse }])} className="w-fit rounded-full border border-border px-4 py-2 text-sm">+ Add course</button>
      </div>

      <div className="rounded-2xl border border-border p-5">
        <p className="text-lg font-medium">GPA: {gpa.toFixed(2)}</p>
      </div>
    </ToolLayout>
  );
}
