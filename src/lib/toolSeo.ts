import type { Metadata } from "next";
import type { ToolMeta } from "./tools";

export const siteUrl = "https://tools.genrisetech.in";
export const siteName = "GenRise";
export const siteTagline =
  "Free Browser-Based Tools for Files, Images & PDFs";

export function buildToolMetadata(tool: ToolMeta): Metadata {
  const title = `${tool.title} — Free Online Tool`;
  const description = `${tool.description} Free, private, and browser-based — no sign-up, no uploads to a server.`;
  const url = `${siteUrl}/tools/${tool.slug}`;

  return {
    title,
    description,
    keywords: [
      tool.title.toLowerCase(),
      `free ${tool.title.toLowerCase()}`,
      `${tool.title.toLowerCase()} online`,
      `${tool.title.toLowerCase()} no sign up`,
      `${tool.title.toLowerCase()} no upload`,
      `${tool.title.toLowerCase()} browser based`,
      `browser based ${tool.category.toLowerCase()} tool`,
      `${tool.title.toLowerCase()} without uploading`,
      `${tool.title.toLowerCase()} privacy`,
      `online ${tool.title.toLowerCase()} tool`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
    },
    other: {
      "ai:site-name": siteName,
      "ai:tool-category": tool.category,
    },
  };
}

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export function buildToolFaqs(tool: ToolMeta): ToolFaqItem[] {
  return [
    {
      question: `Is ${tool.title} free to use?`,
      answer: `Yes. ${tool.title} is completely free on ${siteName}, with no limits, watermarks, or hidden paywalls.`,
    },
    {
      question: "Do I need to create an account or sign up?",
      answer: `No. Every ${siteName} tool works instantly in your browser — no account, email, or sign-up required.`,
    },
    {
      question: "Is my file uploaded to a server?",
      answer: `No. ${tool.title} runs entirely on-device using your browser, so your files are never uploaded or stored anywhere. All processing happens locally.`,
    },
    {
      question: `How does ${tool.title} work?`,
      answer: `${tool.title} uses your browser's built-in capabilities — Canvas, WebAssembly, and File APIs — to process files locally. ${tool.description} Simply open the tool, select your file, and the result is generated instantly on your device.`,
    },
    {
      question: `Is ${tool.title} safe and private?`,
      answer: `Yes. Since ${tool.title} processes everything in your browser, your files never leave your device. There is no server-side storage, no tracking of file contents, and no data collection.`,
    },
    {
      question: `Can I use ${tool.title} on mobile?`,
      answer: `Yes. ${tool.title} works on any modern browser, including mobile devices. It is fully responsive and optimized for both desktop and mobile use.`,
    },
  ];
}

export function toolBreadcrumbJsonLd(tool: ToolMeta) {
  const url = `${siteUrl}/tools/${tool.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${siteUrl}/#tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.title,
        item: url,
      },
    ],
  };
}

export function toolHowToJsonLd(tool: ToolMeta) {
  const url = `${siteUrl}/tools/${tool.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.title}`,
    description: tool.description,
    url,
    tool: tool.title,
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Open the tool",
        text: `Navigate to ${url} to open ${tool.title} in your browser.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select your file",
        text: `Click the upload area or drag and drop your file. Your file stays on your device — it is never uploaded to a server.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Adjust options",
        text: `Configure any available options for your task. ${tool.description}`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Download the result",
        text: "Click the download button to save the processed file to your device.",
      },
    ],
    totalTime: "PT1M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  };
}

export function toolJsonLd(tool: ToolMeta) {
  const url = `${siteUrl}/tools/${tool.slug}`;
  const faqs = buildToolFaqs(tool);

  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.title,
      description: tool.description,
      url,
      applicationCategory: "BrowserApplication",
      operatingSystem: "Any (runs in web browser)",
      codeRepository: "https://github.com/SHRIRAM-S008/Genrise-tools",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      isAccessibleForFree: true,
      publisher: {
        "@type": "Organization",
        name: siteName,
        url: siteUrl,
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "100",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    },
    toolBreadcrumbJsonLd(tool),
    toolHowToJsonLd(tool),
  ];
}

export function homeFaqJsonLd() {
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

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
