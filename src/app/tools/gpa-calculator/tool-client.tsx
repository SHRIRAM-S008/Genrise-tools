"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { X } from "lucide-react";
import {
  calculateGpa,
  COURSE_WEIGHTS,
  SCALES,
  type Course,
  type CourseWeightId,
  type ScaleId,
} from "@/lib/gpa";

const emptyCourse: Course = { name: "", credits: 3, letter: "A", weight: "regular" };

export default function GpaCalculatorPage() {
  const [scaleId, setScaleId] = useState<ScaleId>("4.0");
  const [weighted, setWeighted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([{ ...emptyCourse }]);

  const result = useMemo(() => calculateGpa(courses, scaleId), [courses, scaleId]);
  const scale = SCALES[scaleId];

  function update(index: number, patch: Partial<Course>) {
    setCourses((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  const inputClass = "rounded-lg border border-border px-3 py-2";

  return (
    <ToolLayout title="GPA Calculator" description="Calculate your GPA from letter grades, with credit hours and weighted courses.">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Scale</span>
          <select value={scaleId} onChange={(e) => setScaleId(e.target.value as ScaleId)} className={inputClass}>
            <option value="4.0">4.0 (A+ = 4.0)</option>
            <option value="4.3">4.3 (A+ = 4.3)</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" checked={weighted} onChange={(e) => setWeighted(e.target.checked)} />
          Weighted courses (Honors / AP)
        </label>
      </div>

      <div className="flex flex-col gap-3">
        {courses.map((course, i) => (
          <div
            key={i}
            className={`grid gap-2 ${weighted ? "grid-cols-[1fr_72px_84px_120px_auto]" : "grid-cols-[1fr_72px_84px_auto]"}`}
          >
            <input
              placeholder={`Course ${i + 1}`}
              value={course.name}
              onChange={(e) => update(i, { name: e.target.value })}
              className={inputClass}
            />
            <input
              type="number"
              min={0}
              step={0.5}
              aria-label={`Credits for course ${i + 1}`}
              value={course.credits}
              onChange={(e) => update(i, { credits: Number(e.target.value) })}
              className={inputClass}
            />
            <select
              aria-label={`Grade for course ${i + 1}`}
              value={course.letter}
              onChange={(e) => update(i, { letter: e.target.value })}
              className={inputClass}
            >
              {scale.map((g) => (
                <option key={g.letter} value={g.letter}>
                  {g.letter} ({g.points.toFixed(1)})
                </option>
              ))}
            </select>
            {weighted && (
              <select
                aria-label={`Course type for course ${i + 1}`}
                value={course.weight}
                onChange={(e) => update(i, { weight: e.target.value as CourseWeightId })}
                className={inputClass}
              >
                {COURSE_WEIGHTS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label}
                  </option>
                ))}
              </select>
            )}
            <button
              aria-label={`Remove course ${i + 1}`}
              onClick={() => setCourses(courses.filter((_, j) => j !== i))}
              disabled={courses.length === 1}
              className="text-muted-foreground hover:text-destructive disabled:opacity-30"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        <button onClick={() => setCourses([...courses, { ...emptyCourse }])} className="w-fit rounded-full border border-border px-4 py-2 text-sm">
          + Add course
        </button>
      </div>

      <dl className="grid w-fit grid-cols-[auto_auto] gap-x-8 gap-y-1 rounded-2xl border border-border p-5">
        <dt className="text-lg font-medium">GPA</dt>
        <dd className="text-right text-lg font-semibold">{result.gpa.toFixed(2)}</dd>
        {weighted && (
          <>
            <dt className="text-sm text-muted-foreground">Weighted GPA</dt>
            <dd className="text-right text-sm">{result.weightedGpa.toFixed(2)}</dd>
          </>
        )}
        <dt className="text-sm text-muted-foreground">Total credits</dt>
        <dd className="text-right text-sm">{result.totalCredits}</dd>
        <dt className="text-sm text-muted-foreground">Quality points</dt>
        <dd className="text-right text-sm">{result.qualityPoints.toFixed(1)}</dd>
      </dl>

      {result.totalCredits === 0 && (
        <p className="text-sm text-muted-foreground">Add credit hours to each course to get a GPA.</p>
      )}
    </ToolLayout>
  );
}
