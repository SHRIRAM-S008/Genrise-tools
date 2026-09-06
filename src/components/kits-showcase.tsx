import Link from "next/link";
import { ArrowRight, GraduationCap, Briefcase } from "lucide-react";

const kits = [
  {
    href: "/studentkit",
    icon: GraduationCap,
    title: "StudentKit",
    description: "Application photos, signatures, certificates, and GPA tools — bundled for college and scholarship applications.",
    accent: "from-violet-500/20 via-violet-500/5 to-transparent",
    iconClass: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  {
    href: "/careerkit",
    icon: Briefcase,
    title: "CareerKit",
    description: "Build your resume, optimize your photo, and pack every document your next job application needs.",
    accent: "from-orange-500/20 via-orange-500/5 to-transparent",
    iconClass: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  },
];

export function KitsShowcase() {
  return (
    <section className="py-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {kits.map((kit) => (
          <Link
            key={kit.href}
            href={kit.href}
            className={`group relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-br p-7 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl ${kit.accent}`}
          >
            <div className={`flex size-12 items-center justify-center rounded-2xl ${kit.iconClass}`}>
              <kit.icon className="size-6" strokeWidth={2} />
            </div>
            <h3 className="mt-5 font-heading text-xl font-bold">{kit.title}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{kit.description}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Explore {kit.title}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
