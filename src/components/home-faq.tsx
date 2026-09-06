import { homeFaqJsonLd } from "@/lib/toolSeo";

const faqs = [
  {
    question: "What is GenRise?",
    answer:
      "GenRise is a collection of free, browser-based tools for working with files, images, and PDFs. Every tool runs entirely in your browser — no sign-up, no server uploads, no waiting.",
  },
  {
    question: "Are GenRise tools really free?",
    answer:
      "Yes. Every tool on GenRise is completely free with no limits, watermarks, or hidden paywalls. There is no premium tier or subscription.",
  },
  {
    question: "Do I need to upload my files to a server?",
    answer:
      "No. All GenRise tools process files locally in your browser using Canvas, WebAssembly, and File APIs. Your files never leave your device.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. Every tool works instantly — no account, email, or sign-up required. Just open the tool and start using it.",
  },
  {
    question: "Can I use GenRise tools on my phone?",
    answer:
      "Yes. All tools are fully responsive and work on any modern browser, including mobile devices.",
  },
  {
    question: "Is GenRise private and secure?",
    answer:
      "Yes. Since all processing happens in your browser, your files are never uploaded, stored, or tracked. GenRise is privacy-first by design.",
  },
  {
    question: "What types of tools does GenRise offer?",
    answer:
      "GenRise offers tools for image compression, resizing, and conversion; PDF merging, compression, and organization; document creation like resumes and invoices; data tools like CSV/JSON conversion and QR codes; and privacy tools like metadata removal.",
  },
];

export function HomeFaq() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd()) }}
      />
      <section className="py-16">
        <h2 className="text-center font-heading text-2xl font-bold sm:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-muted-foreground">
          Everything you need to know about GenRise and how it works.
        </p>
        <div className="mx-auto mt-8 flex max-w-2xl flex-col divide-y divide-border rounded-2xl border border-border">
          {faqs.map((faq) => (
            <div key={faq.question} className="p-5">
              <h3 className="font-medium">{faq.question}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
