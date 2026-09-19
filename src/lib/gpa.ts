export interface GradePoint {
  letter: string;
  points: number;
}

/** Common US 4.0 scale; A+ is capped at 4.0 unless the 4.3 scale is picked. */
export const GRADE_SCALE_4_0: GradePoint[] = [
  { letter: "A+", points: 4.0 },
  { letter: "A", points: 4.0 },
  { letter: "A-", points: 3.7 },
  { letter: "B+", points: 3.3 },
  { letter: "B", points: 3.0 },
  { letter: "B-", points: 2.7 },
  { letter: "C+", points: 2.3 },
  { letter: "C", points: 2.0 },
  { letter: "C-", points: 1.7 },
  { letter: "D+", points: 1.3 },
  { letter: "D", points: 1.0 },
  { letter: "D-", points: 0.7 },
  { letter: "F", points: 0 },
];

export const GRADE_SCALE_4_3: GradePoint[] = GRADE_SCALE_4_0.map((g) =>
  g.letter === "A+" ? { ...g, points: 4.3 } : g
);

export type ScaleId = "4.0" | "4.3";

export const SCALES: Record<ScaleId, GradePoint[]> = {
  "4.0": GRADE_SCALE_4_0,
  "4.3": GRADE_SCALE_4_3,
};

/** Extra quality points that weighted (honours/AP/IB) courses add. */
export const COURSE_WEIGHTS = [
  { id: "regular", label: "Regular", bonus: 0 },
  { id: "honors", label: "Honors (+0.5)", bonus: 0.5 },
  { id: "ap", label: "AP / IB (+1.0)", bonus: 1 },
] as const;

export type CourseWeightId = (typeof COURSE_WEIGHTS)[number]["id"];

export interface Course {
  name: string;
  credits: number;
  letter: string;
  weight: CourseWeightId;
}

export interface GpaResult {
  gpa: number;
  weightedGpa: number;
  totalCredits: number;
  qualityPoints: number;
}

export function calculateGpa(courses: Course[], scaleId: ScaleId): GpaResult {
  const scale = SCALES[scaleId];
  let totalCredits = 0;
  let points = 0;
  let weightedPoints = 0;

  for (const course of courses) {
    const credits = Number.isFinite(course.credits) && course.credits > 0 ? course.credits : 0;
    const grade = scale.find((g) => g.letter === course.letter);
    if (!credits || !grade) continue;
    const bonus = COURSE_WEIGHTS.find((w) => w.id === course.weight)?.bonus ?? 0;
    totalCredits += credits;
    points += grade.points * credits;
    weightedPoints += (grade.points + bonus) * credits;
  }

  return {
    gpa: totalCredits ? points / totalCredits : 0,
    weightedGpa: totalCredits ? weightedPoints / totalCredits : 0,
    totalCredits,
    qualityPoints: points,
  };
}
