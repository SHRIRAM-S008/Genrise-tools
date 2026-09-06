import Link from "next/link";
import type { ToolMeta } from "@/lib/tools";
import { tools } from "@/lib/tools";
import { categoryTileClass } from "@/lib/categoryStyles";
import { siteUrl } from "@/lib/toolSeo";

interface ToolSeoContentProps {
  tool: ToolMeta;
}

export function ToolSeoContent({ tool }: ToolSeoContentProps) {
  const related = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4);

  const useCases = getUseCases(tool);
  const features = getFeatures(tool);

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-16">
      <div className="flex flex-col gap-8">
        {/* About */}
        <div>
          <h2 className="text-lg font-semibold">About {tool.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {getAboutText(tool)}
          </p>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-lg font-semibold">Key features</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* How to use */}
        <div>
          <h2 className="text-lg font-semibold">How to use {tool.title}</h2>
          <ol className="mt-3 flex flex-col gap-3">
            <li className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">1</span>
              <span>Open the tool — no sign-up or installation needed. {tool.title} works directly in your browser.</span>
            </li>
            <li className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">2</span>
              <span>Upload or select your file. Your file stays on your device — it is never uploaded to a server.</span>
            </li>
            <li className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">3</span>
              <span>Adjust any options if needed. {tool.description}</span>
            </li>
            <li className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">4</span>
              <span>Download your result instantly. The processed file is generated locally and saved directly to your device.</span>
            </li>
          </ol>
        </div>

        {/* Use cases */}
        <div>
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {useCases.map((u) => (
              <li key={u} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {u}
              </li>
            ))}
          </ul>
        </div>

        {/* Privacy */}
        <div className="rounded-2xl border border-border bg-muted/30 p-5">
          <h2 className="text-sm font-semibold">100% Private — No uploads, ever</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {tool.title} runs entirely in your browser using Canvas, WebAssembly, and File APIs.
            Your files are processed locally and never sent to any server. There is no account
            required, no tracking of file contents, and no data collection.
          </p>
        </div>

        {/* Related tools */}
        {related.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Related {tool.category} tools</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  <div className={`flex size-9 items-center justify-center rounded-lg ${categoryTileClass[t.category]}`}>
                    <t.icon className="size-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{t.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function getAboutText(tool: ToolMeta): string {
  const base = `${tool.title} is a free online tool on GenRise that lets you ${tool.description.toLowerCase()} `;
  const privacy = `Unlike other online tools, ${tool.title} processes everything directly in your browser — your files are never uploaded to a server, ensuring complete privacy and security. `;
  const speed = `This means it's not only more private but also faster, since there's no upload or download wait time. `;
  const free = `It's completely free with no sign-up, no watermarks, and no limits. `;
  return base + privacy + speed + free;
}

function getFeatures(tool: ToolMeta): string[] {
  return [
    `Free with no sign-up or account required`,
    `100% browser-based — your files never leave your device`,
    `No watermarks, no limits, no hidden paywalls`,
    `Works on desktop, mobile, and tablet`,
    `Instant processing — no upload or download wait`,
    `${tool.category} tool built for everyday use`,
  ];
}

function getUseCases(tool: ToolMeta): string[] {
  const common: Record<string, string[]> = {
    Images: [
      "Preparing photos for online forms and applications",
      "Reducing file size for email attachments",
      "Converting between image formats for web compatibility",
      "Creating ID and passport photos at exact dimensions",
    ],
    PDFs: [
      "Combining multiple documents into one PDF",
      "Reducing PDF file size for email or upload",
      "Reorganizing or removing pages from a PDF",
      "Converting images to PDF for document submission",
    ],
    Documents: [
      "Creating professional resumes for job applications",
      "Generating invoices for freelance work",
      "Bundling application documents into one package",
      "Calculating academic GPA scores",
    ],
    "Data & Text": [
      "Generating QR codes for links and contact info",
      "Converting between CSV and JSON formats",
      "Checking file properties and metadata",
      "Word counting and text formatting tasks",
    ],
    Privacy: [
      "Removing GPS and camera data from photos before sharing",
      "Protecting personal information in shared images",
      "Stripping metadata before uploading to social media",
    ],
  };
  return common[tool.category] ?? [];
}
