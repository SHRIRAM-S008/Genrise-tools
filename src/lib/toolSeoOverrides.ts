import type { ToolFaqItem } from "./toolSeo";

export interface ToolSeoOverride {
  /** Replaces the generated <title>; keep the primary keyword first. */
  title?: string;
  description?: string;
  /** Merged ahead of the generated keyword list. */
  keywords?: string[];
  /** Prepended to the generated FAQ list (and to FAQPage structured data). */
  faqs?: ToolFaqItem[];
  about?: string;
  features?: string[];
  useCases?: string[];
}

/**
 * Per-tool SEO copy. The generated defaults in toolSeo.ts stay the baseline;
 * these overrides exist for tools with a distinct search intent that the
 * generic "free, private, browser-based" framing doesn't capture.
 *
 * Every claim here has to be true of the shipped tool — see the QR entry,
 * which is written around what actually makes this generator different:
 * the codes are static, they never expire, and generation works offline.
 */
export const toolSeoOverrides: Record<string, ToolSeoOverride> = {
  "qr-code": {
    title: "QR Code Generator — Free Static QR Codes That Never Expire",
    description:
      "Free QR code generator for links, text, Wi-Fi and contact cards. Creates static QR codes with no expiry, no sign-up and no tracking — generated offline in your browser, downloadable as PNG or SVG.",
    keywords: [
      "qr code generator",
      "free qr code generator",
      "static qr code generator",
      "free static qr code generator",
      "static qr code generator free no expiration",
      "qr code generator free no expiry",
      "best free qr code generator",
      "offline qr code generator",
      "text to qr code",
      "url to qr code",
      "wifi qr code generator",
      "vcard qr code generator",
      "qr code generator no sign up",
      "qr code generator no watermark",
      "qr code svg download",
      "qr code generator for print",
    ],
    about:
      "The GenRise QR Code Generator creates free static QR codes for a website link, plain text, a Wi-Fi network, a contact card (vCard), an email, an SMS or a phone number. Static means the data is encoded directly into the pattern, so the code keeps working forever — there is no short link in the middle that can expire, break, or start redirecting somewhere else, and no account that has to stay active. Generation happens entirely in your browser using the Canvas API, so it also works with no internet connection once the page has loaded, and nothing you type is ever sent to a server. Download the result as a PNG for screens or as an SVG that stays sharp at any print size.",
    features: [
      "Static QR codes with no expiry date and no redirect service in the middle",
      "Works offline — the generator runs in your browser, not on a server",
      "Seven content types: URL, text, Wi-Fi, contact card, email, SMS and phone",
      "PNG and SVG download — SVG scales cleanly for posters, packaging and signage",
      "Adjustable size, colours and error-correction level (L, M, Q, H)",
      "No sign-up, no watermark, no scan limits and no tracking of scans",
    ],
    useCases: [
      "Putting a website or menu link on a poster, flyer, or table tent",
      "Sharing your Wi-Fi password with guests without reading it out",
      "Adding a scannable contact card to a business card or email signature",
      "Turning any text, serial number, or code into a scannable label",
      "Printing product, asset, or inventory labels that must keep working for years",
      "Generating codes offline where uploading customer data isn't allowed",
    ],
    faqs: [
      {
        question: "Are these static or dynamic QR codes?",
        answer:
          "Static. The link or text is encoded directly into the QR pattern, so scanning goes straight to your content with no redirect in between. That is why the code cannot expire and needs no account — but it also means the destination cannot be edited after printing. If you need to change the target later, point the QR code at a URL you control (such as your own short link or a page you can update).",
      },
      {
        question: "Do the QR codes expire or stop working?",
        answer:
          "No. There is no expiry date, no trial period, and no scan limit. Because the code is static, it does not depend on GenRise staying online — a printed code keeps working even if this site disappears.",
      },
      {
        question: "Does it work offline?",
        answer:
          "Yes. The generator runs entirely in your browser, so once the page has loaded you can create QR codes with no internet connection. GenRise is also installable as an app, which keeps the tool available offline.",
      },
      {
        question: "Is it really free, with no sign-up or watermark?",
        answer:
          "Yes. There is no account, no email capture, no watermark on the code, and no paid tier. You can use the codes commercially — on packaging, signage, menus or business cards — at no cost.",
      },
      {
        question: "Can I make a Wi-Fi or contact-card QR code?",
        answer:
          "Yes. Pick the Wi-Fi tab to encode a network name, password and security type — scanning it joins the network on iOS and Android without typing the password. The Contact tab produces a standard vCard that phones offer to save straight into the address book.",
      },
      {
        question: "What size and format should I use for printing?",
        answer:
          "Download the SVG for anything printed: it is vector, so it stays sharp at any size. As a rule of thumb, keep the printed code at least 2 cm (about 0.8 in) wide for close-range scanning, and roughly one tenth of the scanning distance for posters. Use error-correction level H if the code will sit on a textured surface or behind a logo.",
      },
      {
        question: "What does the error-correction level change?",
        answer:
          "It controls how much of the code can be damaged or covered while still scanning: L recovers about 7%, M 15%, Q 25% and H 30%. Higher levels make the pattern denser but far more tolerant of smudges, curved surfaces, or a logo placed in the centre.",
      },
      {
        question: "Does this generator use AI, and can it make artistic QR codes?",
        answer:
          "No. This is a standard, spec-compliant QR encoder, not an AI image generator — it produces plain black-and-white (or recoloured) codes that scan reliably. AI-generated artistic QR codes can look striking, but they frequently fail to scan, so this tool focuses on codes that work every time.",
      },
      {
        question: "How is this different from Google's QR code feature?",
        answer:
          "Chrome can create a QR code for the page you are currently viewing, which is handy but limited to that one URL. This tool works for any content — arbitrary text, Wi-Fi credentials, contact cards, email, SMS and phone numbers — and adds colour, size, error-correction and SVG export.",
      },
      {
        question: "Can I scan a QR code with this tool?",
        answer:
          "Not yet — this tool creates QR codes rather than reading them. Most phone cameras scan QR codes natively: open the camera app and point it at the code.",
      },
    ],
  },
  "qr-scanner": {
    title: "QR Code Scanner — Read Any QR Code in Your Browser",
    description:
      "Free online QR code scanner. Scan with your camera or upload a screenshot to decode links, Wi-Fi passwords, contact cards and text. Runs entirely in your browser — no app, no sign-up, no uploads.",
    keywords: [
      "qr code scanner",
      "qr code reader",
      "scan qr code online",
      "qr scanner from image",
      "read qr code from screenshot",
      "qr code scanner no app",
      "decode qr code",
      "wifi qr code reader",
      "qr scanner for pc",
      "qr code scanner online free",
      "scan qr code with camera",
      "qr code checker",
    ],
    about:
      "The GenRise QR Code Scanner reads QR codes two ways: live through your device camera, or from an image you already have — a screenshot, a saved photo, or a picture of a poster. It decodes the payload and, where it recognises the format, breaks it into readable fields: the SSID and password behind a Wi-Fi code, the name and phone number in a contact card, the recipient and subject of an email code. Scanning happens entirely on your device using the browser's BarcodeDetector where available and a bundled WebAssembly-free decoder everywhere else, so images and camera frames are never uploaded. It is also a quick safety check: you can read the destination of a QR code before deciding whether to open it.",
    features: [
      "Scan live with your camera, or decode a screenshot or saved photo",
      "Works on desktop too — no phone app or extension to install",
      "Readable breakdown of Wi-Fi, contact card, email, SMS and phone codes",
      "Shows the full destination URL before you open it, to catch QR phishing",
      "Nothing is uploaded — camera frames and images are decoded on your device",
      "Free with no sign-up, no scan limits and no ads in the result",
    ],
    useCases: [
      "Checking where a QR code on a poster, parking meter, or invoice really leads",
      "Reading a QR code from a screenshot on the same phone that would scan it",
      "Recovering a Wi-Fi password from a printed or emailed QR code",
      "Scanning codes on a laptop or desktop with a webcam",
      "Verifying that a QR code you generated encodes the right content",
    ],
    faqs: [
      {
        question: "Can I scan a QR code from a screenshot or saved image?",
        answer:
          "Yes. Switch to \"Scan an image\" and drop in a screenshot, a downloaded picture, or a photo of a printed code. This is the usual way to read a QR code that is already on the same screen you would otherwise point a camera at.",
      },
      {
        question: "Does this work on a desktop or laptop?",
        answer:
          "Yes. Use any connected webcam for live scanning, or decode an image file — no phone, app, or browser extension needed.",
      },
      {
        question: "Are my camera frames or images uploaded anywhere?",
        answer:
          "No. Decoding happens entirely in your browser, using the built-in BarcodeDetector API where the browser supports it and a bundled JavaScript decoder otherwise. Nothing you scan is sent to a server or stored.",
      },
      {
        question: "Why won't my camera start?",
        answer:
          "Camera access needs your permission and a secure (HTTPS) connection. If you dismissed the prompt, re-enable camera access for this site in your browser settings. You can always fall back to scanning a saved image instead.",
      },
      {
        question: "Is it safe to open a link from a QR code?",
        answer:
          "Check it first. QR phishing (\"quishing\") hides malicious links behind a pattern you cannot read. This scanner shows the full decoded URL before you open anything, so you can confirm the domain is what you expect — especially on codes stuck to parking meters, invoices, or public posters.",
      },
      {
        question: "The code isn't being recognised — what can I do?",
        answer:
          "Fill more of the frame with the code, hold steady so the camera can focus, and avoid glare or steep angles. For image scans, crop close to the code and use the sharpest version you have; very low-resolution or partially covered codes may not carry enough data to decode.",
      },
      {
        question: "Can I create QR codes here too?",
        answer:
          "Yes — the GenRise QR Code Generator makes free static QR codes for links, text, Wi-Fi and contact cards, with PNG and SVG download and no expiry.",
      },
    ],
  },

  // ── Images ────────────────────────────────────────────────────────────────

  "compress-image": {
    title: "Compress Image — Reduce JPG, PNG & WebP File Size Online",
    description:
      "Compress JPG, PNG or WebP images to a target file size — one photo or a whole batch — right in your browser. No uploads, no sign-up, no watermarks.",
    keywords: [
      "compress image",
      "image compressor",
      "compress jpeg online",
      "compress png",
      "compress webp",
      "reduce image file size",
      "image size reducer",
      "batch image compressor",
      "compress image to 1mb",
      "compress image without losing quality",
      "photo compressor online free",
      "compress image no upload",
    ],
    about:
      "GenRise Compress Image shrinks JPG, PNG and WebP files to a target size you set in megabytes. Drop in a single photo or a whole folder's worth — every image is compressed on your device with the browser's Canvas encoder, then downloaded individually or bundled into a ZIP. Because nothing is uploaded, compression is fast even on big batches and your photos never touch a server. Set a target size, see the before-and-after savings for each file, and re-run with a tighter target in one click if you need to go smaller.",
    features: [
      "Set a target maximum size in MB — the encoder compresses each image to fit",
      "Batch mode: drop many images at once and download them all as a ZIP",
      "Supports JPG, PNG and WebP input",
      "Per-file before/after sizes so you can see exactly how much was saved",
      "Re-compress the whole batch with a new target in one click",
      "100% browser-based — photos never leave your device",
    ],
    useCases: [
      "Getting photos under attachment limits for email or upload forms",
      "Shrinking product and listing photos before publishing online",
      "Compressing a whole shoot or event folder in one batch",
      "Reducing image weight for faster-loading websites",
      "Freeing up phone storage by shrinking saved images",
    ],
    faqs: [
      {
        question: "Does compressing an image reduce its quality?",
        answer:
          "Compression re-encodes the image to meet your target size, which involves some quality loss — that's what makes the file smaller. For typical targets the result still looks sharp on screen. If you need maximum quality, set a generous target size or keep the original.",
      },
      {
        question: "Can I compress multiple images at once?",
        answer:
          "Yes. Drop in as many JPG, PNG or WebP files as you like — each is compressed to your target and you can download them individually or as a single ZIP archive.",
      },
      {
        question: "Which formats can I compress?",
        answer:
          "JPG, PNG and WebP. If your image is in another format like HEIC or BMP, convert it first with the GenRise Convert Image tool, then compress the result.",
      },
      {
        question: "I need an exact file size like 200KB — can this tool do that?",
        answer:
          "For precise targets in kilobytes — common for job application and exam forms — use GenRise UploadReady, which compresses a photo to an exact KB limit and optional pixel dimensions.",
      },
      {
        question: "Is there a limit on file size or number of images?",
        answer:
          "No account limits and no paywall — the practical limit is your device's memory, since everything is processed locally. Very large batches are handled a few files at a time to stay responsive.",
      },
    ],
  },

  "resize-image": {
    title: "Resize Image — Change Photo Dimensions or Scale by Percentage",
    description:
      "Resize JPG, PNG or WebP images to exact pixel dimensions or a percentage, with an aspect-ratio lock. Batch resize supported — all in your browser, no uploads.",
    keywords: [
      "resize image",
      "image resizer",
      "resize photo online",
      "resize image in pixels",
      "reduce image dimensions",
      "resize image by percentage",
      "batch image resizer",
      "resize photo for upload",
      "image resizer no upload",
      "change image size online free",
      "resize jpg png webp",
    ],
    about:
      "GenRise Resize Image scales JPG, PNG and WebP files two ways: to exact pixel dimensions, or by a percentage of the original. An aspect-ratio lock keeps proportions intact so photos never stretch. Resize one image with custom width and height, or drop a batch and scale every file by the same percentage — quick presets at 75%, 50% and 25% cover the common cases. Everything runs in your browser, and batch results download together as a ZIP.",
    features: [
      "Resize to exact pixel dimensions or scale by percentage",
      "Aspect-ratio lock prevents stretched or squashed images",
      "Batch mode scales many images by the same percentage",
      "Quick presets: 75%, 50% and 25% of original size",
      "JPG, PNG and WebP supported; batch output downloads as ZIP",
      "Fully client-side — images are never uploaded",
    ],
    useCases: [
      "Resizing photos to a form's required pixel dimensions",
      "Scaling down camera photos for faster web pages",
      "Preparing images at half or quarter size for email",
      "Resizing screenshots or graphics to fit a layout",
      "Batch-resizing an album before sharing it",
    ],
    faqs: [
      {
        question: "Will resizing distort my image?",
        answer:
          "Not if you keep the aspect-ratio lock on — the height adjusts automatically when you change the width, so proportions stay intact. Turn it off only when you need specific dimensions on both axes.",
      },
      {
        question: "Can I resize more than one image at a time?",
        answer:
          "Yes. In batch mode every image you drop is scaled by the same percentage, so each keeps its own aspect ratio. Results download together as a ZIP.",
      },
      {
        question: "Can I make an image larger?",
        answer:
          "You can enter dimensions bigger than the original, but enlarging stretches the available pixels and softens the result. For best quality, resize down rather than up.",
      },
      {
        question: "What's the difference between resizing and compressing?",
        answer:
          "Resizing changes the pixel dimensions (e.g. 4000×3000 → 1200×900). Compressing keeps the dimensions but reduces file size by re-encoding. Doing both gives the smallest files — resize first, then compress.",
      },
    ],
  },

  "convert-image": {
    title: "Convert Image — JPG, PNG, WebP, GIF, BMP & AVIF Converter",
    description:
      "Convert images between JPG, PNG and WebP — including GIF, BMP and AVIF input — with quality control and batch conversion. Free, private, browser-based.",
    keywords: [
      "convert image",
      "image converter",
      "png to jpg",
      "jpg to png",
      "webp converter",
      "convert to webp",
      "avif to jpg",
      "gif to png",
      "bmp to jpg",
      "image format converter",
      "batch image converter",
      "heic alternative converter",
    ],
    about:
      "GenRise Convert Image turns JPG, PNG, WebP, GIF, BMP and AVIF files into JPG, PNG or WebP — the formats that work everywhere. Convert one file or a whole batch, tune the quality slider for lossy formats to trade size for sharpness, and download results individually or as a ZIP. Conversion happens in the browser's Canvas pipeline, so there's no upload queue and no file-size cap from a server.",
    features: [
      "Converts JPG, PNG, WebP, GIF, BMP and AVIF input",
      "Output to JPG, PNG or WebP",
      "Quality slider for JPG and WebP output",
      "Batch convert many files and download as ZIP",
      "Transparent backgrounds preserved with PNG and WebP",
      "Runs entirely in your browser — files stay on your device",
    ],
    useCases: [
      "Converting WebP or AVIF images to JPG for apps that don't support them",
      "Turning PNG screenshots into smaller JPGs for sharing",
      "Converting images to WebP for faster websites",
      "Saving a GIF frame or BMP graphic as a standard format",
      "Batch-converting a folder of mixed formats to one output type",
    ],
    faqs: [
      {
        question: "How do I convert PNG to JPG?",
        answer:
          "Drop your PNG in, choose JPG as the output format, and convert. JPG doesn't support transparency, so any transparent areas become a solid background — pick PNG or WebP output if you need to keep transparency.",
      },
      {
        question: "Which output format should I choose?",
        answer:
          "JPG for photos where small size matters, PNG when you need transparency or pixel-exact graphics, and WebP for the best size-to-quality ratio on the modern web.",
      },
      {
        question: "Does converting lose quality?",
        answer:
          "PNG output is lossless. JPG and WebP are lossy, but the quality slider lets you choose the balance — 90% is a good default that's visually close to the original at a much smaller size.",
      },
      {
        question: "Can I convert an animated GIF?",
        answer:
          "The converter outputs a still image, so an animated GIF converts as its first frame. To turn video clips into GIFs, use the GenRise Video to GIF converter instead.",
      },
    ],
  },

  "target-kb": {
    title: "Compress Photo to Exact KB Size — UploadReady",
    description:
      "Compress a photo to an exact file size like 50KB or 100KB for online forms and applications. Set the KB limit and optional dimensions — done in your browser.",
    keywords: [
      "compress image to 50kb",
      "compress photo to 100kb",
      "image to 20kb",
      "compress image to 200kb",
      "photo compressor for online form",
      "reduce image size in kb",
      "compress image to exact size",
      "photo under 100kb for application",
      "jpg compress to specific size",
      "photo size reducer for govt form",
      "compress image below 50kb online",
    ],
    about:
      "UploadReady solves the most common form-upload problem: a portal that rejects your photo for being over a strict limit like 20KB, 50KB or 100KB. Type the maximum size in kilobytes — optionally with exact width and height in pixels — and the tool compresses your JPG, PNG or WebP photo until it fits, reporting the final size so you can verify before uploading. If a target is unreachable for that image it tells you the closest it could get instead of silently failing. Everything runs locally, so even sensitive ID photos are never uploaded.",
    features: [
      "Enter an exact target in KB — no guessing with quality sliders",
      "Optional exact width and height in pixels for strict form specs",
      "Works with JPG, PNG and WebP photos",
      "Reports the final file size so you can confirm before uploading",
      "Tells you honestly when a target can't be reached, with the closest result",
      "Completely private — ideal for ID photos and application documents",
    ],
    useCases: [
      "Photos under 50KB or 100KB for government and exam application forms",
      "Job portal uploads with strict file-size limits",
      "College and scholarship application photo requirements",
      "Visa and passport application photo uploads",
      "Any upload field that rejects files over a fixed KB limit",
    ],
    faqs: [
      {
        question: "How do I compress a photo to exactly 50KB?",
        answer:
          "Upload your photo, type 50 in the maximum size field, and hit \"Make it ready\". The tool compresses iteratively until the file is at or under 50KB and shows you the exact final size.",
      },
      {
        question: "What if my photo can't reach the target size?",
        answer:
          "If the KB target is too tight for that image's dimensions, the tool gets as close as possible and tells you the size it achieved. Lowering the pixel dimensions — or starting from a smaller crop — usually closes the gap.",
      },
      {
        question: "My form needs exact dimensions too — can I set those?",
        answer:
          "Yes. Enter width and height in pixels along with the KB target and the photo is resized and compressed to meet both requirements at once.",
      },
      {
        question: "Will the compressed photo still look OK?",
        answer:
          "For typical form targets (50–200KB) results look clean. Very low targets like 10KB on a detailed photo will be visibly compressed — that's a property of the size limit, not the tool.",
      },
      {
        question: "Is it safe to upload an ID or passport-style photo?",
        answer:
          "Yes — safer than typical compressors. Processing happens entirely in your browser, so your photo is never sent to or stored on any server.",
      },
    ],
  },

  "passport-photo": {
    title: "Passport Photo Maker — 2x2, 35x45mm & Custom ID Photos",
    description:
      "Make passport, visa and ID photos at exact official sizes — US 2x2 in, India/UK/Schengen 35x45mm, ID card 25x35mm or custom. Set background color, crop, and download.",
    keywords: [
      "passport photo maker",
      "passport size photo online",
      "35x45mm photo",
      "2x2 photo maker",
      "visa photo online",
      "id photo maker",
      "india passport photo size",
      "us passport photo 2x2",
      "schengen visa photo",
      "passport photo white background",
      "passport photo online free",
    ],
    about:
      "GenRise Passport Photo Maker crops and sizes a portrait to official photo standards: US passport at 2×2 inches, India, UK and Schengen visa photos at 35×45mm, ID cards at 25×35mm, or any custom millimetre size you need. Choose the background colour (white is the safe default for most applications), zoom to position your face correctly, and download a print-ready file. Everything is processed on your device — important when the photo is a government ID image.",
    features: [
      "Official presets: US passport 2×2 in, India/UK/Schengen 35×45mm, ID card 25×35mm",
      "Custom millimetre dimensions for any other requirement",
      "Adjustable background colour — white, off-white, or any colour your application needs",
      "Zoom control to frame the face correctly",
      "Exact-size output ready for printing or digital upload",
      "On-device processing — ID photos are never uploaded",
    ],
    useCases: [
      "Passport renewal and visa application photos",
      "ID card and driving licence photos at exact spec",
      "College, exam and job application portrait requirements",
      "Custom-size photos for any portal's mm or inch dimensions",
      "Printing several copies cheaply — combine with the Print Sheet Maker",
    ],
    faqs: [
      {
        question: "Which passport photo sizes are supported?",
        answer:
          "Presets cover US passport (2×2 in), India and UK passport (35×45mm), Schengen visa (35×45mm), and ID cards (25×35mm) — plus a custom option where you enter any width and height in millimetres.",
      },
      {
        question: "Can I change the background colour?",
        answer:
          "Yes — pick any background colour. Plain white or off-white satisfies most passport and visa rules. Note this replaces the background colour on output; for actually removing a busy backdrop, run the photo through the Background Remover first.",
      },
      {
        question: "How do I print multiple copies on one page?",
        answer:
          "Download your sized photo here, then open the GenRise Print Sheet Maker — it tiles repeated copies on an A4 or Letter page at the exact mm size, ready for a home printer or photo lab.",
      },
      {
        question: "Will the photo be accepted by my application?",
        answer:
          "The tool produces the exact dimensions your application specifies — that part is guaranteed. Acceptance also depends on the photo itself: neutral expression, even lighting, no shadows, face at the right scale. Follow your issuing authority's photo guidelines when shooting.",
      },
      {
        question: "Is my photo uploaded anywhere?",
        answer:
          "No. Cropping, resizing and background fill all happen in your browser, so the photo never leaves your device — a real advantage for ID documents.",
      },
    ],
  },

  "print-sheet": {
    title: "Print Sheet Maker — Tile Photos on A4 or Letter Paper",
    description:
      "Arrange repeated copies of a photo on one printable A4 or Letter sheet — set photo size in mm, margins and gaps. Ideal for passport photos and ID copies.",
    keywords: [
      "print sheet maker",
      "passport photo print sheet",
      "print multiple photos on one page",
      "photo print layout a4",
      "id photo sheet",
      "duplicate photo printing",
      "passport photos on one page",
      "photo grid print",
      "wallet size photo sheet",
    ],
    about:
      "GenRise Print Sheet Maker tiles as many copies of a photo as fit on one A4 or Letter page — the cheapest way to print passport photos, ID shots, labels or small stickers at home or at a photo lab. Set the photo size in millimetres, the page margins, and the gap between copies; the tool computes the layout and produces a print-ready image. Pair it with the Passport Photo Maker to go from a phone selfie to a full sheet of regulation photos for pennies.",
    features: [
      "A4 and Letter paper sizes",
      "Exact photo dimensions in millimetres",
      "Adjustable page margin and gap between copies",
      "Automatically packs the maximum copies per sheet",
      "Print-ready output image you can print from any viewer",
      "Runs in your browser — photos stay private",
    ],
    useCases: [
      "Printing a sheet of passport or visa photos at home",
      "Wallet-size photo copies for family",
      "Small repeated images for labels or stickers",
      "ID photos for multiple applications on one print",
      "Saving money vs. per-print photo booth prices",
    ],
    faqs: [
      {
        question: "How many passport photos fit on one A4 sheet?",
        answer:
          "At the standard 35×45mm size with small margins and gaps, a single A4 sheet fits around 35 copies — far more than the four or six a photo booth gives you.",
      },
      {
        question: "What paper size can I use?",
        answer:
          "A4 and US Letter are both supported. Pick whichever your printer or photo lab uses.",
      },
      {
        question: "How do I get exact-size passport photos on the sheet?",
        answer:
          "Set the photo width and height to the required millimetre size — 35×45mm for most passports — and each copy on the sheet prints at exactly that size. Print at 100% scale (no \"fit to page\") so the dimensions stay accurate.",
      },
      {
        question: "Why do margins and gaps matter?",
        answer:
          "Margins keep photos clear of the printer's unprintable edge; gaps give you room to cut between copies cleanly. Small values pack more copies per sheet; larger ones are easier to trim.",
      },
    ],
  },

  "signature-optimizer": {
    title: "Signature Optimizer — Resize Signature to Exact px and KB",
    description:
      "Resize a scanned or photographed signature to exact pixel dimensions and a maximum file size in KB — keeps PNG transparency. For exam and application forms.",
    keywords: [
      "signature resize",
      "resize signature online",
      "signature 140x60",
      "signature image compressor",
      "signature under 20kb",
      "digital signature resize for form",
      "signature photo size reducer",
      "compress signature image",
      "signature 300x80 pixels",
      "scan signature for online application",
    ],
    about:
      "Application forms — especially government, exam and job portals — demand signature images at exact pixel dimensions and tiny file sizes like 10KB or 20KB. GenRise Signature Optimizer takes a photo or scan of your signature and outputs it at the precise width, height and maximum KB you specify, saving as PNG so a transparent background stays transparent. It runs entirely in your browser, which matters for something as personal as your signature.",
    features: [
      "Exact pixel width and height — e.g. 300×80, 140×60 or any spec",
      "Maximum file size in KB, hit automatically",
      "PNG output keeps transparent backgrounds transparent",
      "Reports the final size and dimensions for verification",
      "Warns honestly if a target can't be reached",
      "Private by design — your signature never leaves your device",
    ],
    useCases: [
      "Signatures under 20KB for government and competitive exam forms",
      "Exact-dimension signatures like 300×80px for application portals",
      "Preparing a scanned signature for online document signing",
      "Transparent-background signatures for PDFs and certificates",
      "Scholarship, visa and job application signature uploads",
    ],
    faqs: [
      {
        question: "How do I get a signature under 20KB?",
        answer:
          "Upload a photo or scan of your signature, enter the required dimensions (e.g. 300×80) and set max size to 20KB. The optimizer resizes and compresses until it fits — PNG output keeps it crisp at small sizes.",
      },
      {
        question: "Does it keep a transparent background?",
        answer:
          "Yes. Output is PNG, so a signature with a transparent background stays transparent — essential for placing it over documents without a white box. If your source is a photo on paper, remove the background first with the Background Remover.",
      },
      {
        question: "My signature photo is on white paper — will it work?",
        answer:
          "It will be resized and compressed correctly, but the white paper stays white. For a clean transparent signature, shoot the signature on plain white paper in good light, run it through the Background Remover, then optimize the result here.",
      },
      {
        question: "What dimensions do most forms require?",
        answer:
          "Common specs are 140×60px or 300×80px with a 10–30KB limit, but it varies by portal — check your form's instructions and enter exactly what it asks for.",
      },
      {
        question: "Is it safe to upload my signature here?",
        answer:
          "Yes. Processing is 100% on-device in your browser — your signature image is never transmitted or stored anywhere else.",
      },
    ],
  },

  "image-cropper": {
    title: "Image Cropper — Crop Photos to Any Size or Aspect Ratio",
    description:
      "Crop JPG, PNG and WebP images freehand or to fixed aspect ratios — 1:1, 4:3, 16:9, 9:16 and more. Instant in-browser cropping, no uploads, no sign-up.",
    keywords: [
      "crop image online",
      "image cropper",
      "crop photo",
      "crop image to 1:1",
      "crop image 16:9",
      "photo cropper online free",
      "crop jpg online",
      "free crop tool no upload",
      "crop picture online",
      "square crop image",
    ],
    about:
      "GenRise Image Cropper cuts any image down to exactly the part you want — drag the crop box freehand, or lock it to a fixed aspect ratio like 1:1 for profile pictures, 16:9 for banners, or 9:16 for stories. Resize and reposition the selection with handles, preview instantly, and download the cropped result. Cropping happens on the Canvas API in your browser, so there's no upload wait and the original never leaves your device.",
    features: [
      "Freeform cropping or locked aspect ratios: 1:1, 4:3, 3:4, 16:9, 9:16",
      "Drag handles to resize, drag inside to reposition",
      "Works with JPG, PNG, WebP and other common image types",
      "Instant preview and one-click download",
      "No upload — cropping runs entirely in the browser",
      "Free with no watermark and no account",
    ],
    useCases: [
      "Square crops for profile pictures and avatars",
      "16:9 crops for thumbnails and banners",
      "Trimming screenshots to just the relevant area",
      "Removing unwanted edges or people from photos",
      "Cutting images to exact proportions for listings or posts",
    ],
    faqs: [
      {
        question: "How do I crop an image to a perfect square?",
        answer:
          "Choose the 1:1 aspect ratio, then drag the crop box where you want it — the selection stays square at any size. This is the standard crop for profile photos.",
      },
      {
        question: "Does cropping reduce image quality?",
        answer:
          "Cropping keeps full quality inside the selection — it simply discards the pixels outside it. The cropped area is saved at its original resolution.",
      },
      {
        question: "Can I crop to exact pixel dimensions?",
        answer:
          "The cropper works by aspect ratio and freeform selection. For exact pixel dimensions, crop first, then use the Resize Image tool to set precise width and height.",
      },
      {
        question: "Which aspect ratio should I use for social media?",
        answer:
          "1:1 for Instagram feed posts and profile photos, 16:9 for YouTube thumbnails and Twitter/X headers, 9:16 for Stories and Reels, and 4:3 for standard photo framing.",
      },
    ],
  },

  "image-rotator": {
    title: "Rotate Image — Rotate or Flip Photos by 90°, 180°, 270°",
    description:
      "Rotate images left or right in 90-degree steps, or flip horizontally and vertically. Fix sideways photos instantly in your browser — free, no uploads.",
    keywords: [
      "rotate image online",
      "flip image",
      "rotate photo 90 degrees",
      "flip image horizontally",
      "mirror image online",
      "fix sideways photo",
      "rotate picture online free",
      "image rotator",
      "flip photo vertically",
      "rotate jpg png online",
    ],
    about:
      "GenRise Image Rotator fixes orientation problems in one click: rotate an image in 90-degree steps — 90°, 180°, 270° — or flip it horizontally or vertically for a mirror effect. Every change previews instantly, so you can combine a rotation and a flip and see the result before downloading. It handles JPG, PNG, WebP and other common formats entirely in the browser — no upload, no wait, no watermark.",
    features: [
      "Rotate 90°, 180° or 270° in one-click steps",
      "Flip horizontally for a mirror image, or vertically",
      "Instant live preview of every change",
      "Supports JPG, PNG, WebP and other browser-readable formats",
      "Lossless output at the image's original resolution",
      "Completely in-browser — no file ever leaves your device",
    ],
    useCases: [
      "Fixing photos that landed sideways from a phone camera",
      "Rotating scanned documents that came out upside down",
      "Mirroring an image for design or print layouts",
      "Correcting orientation before uploading to a form or listing",
      "Flipping images for social posts and graphics",
    ],
    faqs: [
      {
        question: "How do I fix a photo that's sideways?",
        answer:
          "Drop it in and click \"Rotate 90°\" until it's upright — the preview updates after every click so you can see exactly when it's right, then download.",
      },
      {
        question: "What's the difference between rotating and flipping?",
        answer:
          "Rotating turns the image like a spinning wheel; flipping creates a mirror reflection. To correct sideways photos you want rotate; to reverse text or get a selfie mirrored, use flip.",
      },
      {
        question: "Does rotating lose image quality?",
        answer:
          "No. The image is redrawn at its original resolution in the new orientation — 90° rotations and flips don't degrade the picture.",
      },
      {
        question: "Can I rotate by a custom angle like 45°?",
        answer:
          "This tool does 90° increments, which covers orientation fixes. Arbitrary angles need a different kind of edit — for most uploads the right-angle rotations are what the spec expects.",
      },
    ],
  },

  "color-picker": {
    title: "Color Picker from Image — Get HEX & RGB Codes from Any Photo",
    description:
      "Upload an image and click any pixel to get its exact HEX and RGB color code. Keeps a history of picks, one-click copy — free, private, browser-based.",
    keywords: [
      "color picker from image",
      "eyedropper tool online",
      "get hex code from image",
      "pick color from picture",
      "image color picker",
      "rgb from image",
      "hex color from photo",
      "extract color from image",
      "color code finder",
      "pixel color picker",
    ],
    about:
      "GenRise Color Picker lets you click any pixel of an uploaded image and read its exact colour as a HEX code and RGB value — tap either to copy it straight to the clipboard. Every pick is added to a history of up to twelve swatches so you can collect a palette from different spots before copying. It's the fastest way to match a colour from a logo, screenshot, design mockup or photo — and since the image is decoded on a local canvas, it never leaves your device.",
    features: [
      "Click any pixel to get its exact HEX and RGB values",
      "One-click copy for both formats",
      "Pick history keeps your last 12 colours as clickable swatches",
      "Works with any image format your browser can display",
      "Instant — no upload, the image renders on a local canvas",
      "Free with no sign-up",
    ],
    useCases: [
      "Matching a brand colour from a logo or screenshot",
      "Pulling HEX codes from a design mockup for CSS",
      "Identifying the colour of a product or object in a photo",
      "Sampling several spots to build a palette",
      "Checking exact colours in a UI bug report screenshot",
    ],
    faqs: [
      {
        question: "How do I get the HEX code of a colour in a picture?",
        answer:
          "Upload the image, then click directly on the colour you want. The HEX code appears instantly — click it to copy. The RGB value is shown alongside it.",
      },
      {
        question: "Does it show RGB as well as HEX?",
        answer:
          "Yes. Each pick displays both formats — the HEX code like #10b981 and the RGB value like rgb(16, 185, 129) — and each copies with one click.",
      },
      {
        question: "Can I pick colours from more than one spot?",
        answer:
          "Yes. Every pick is saved as a swatch in the history row (up to 12), so you can sample several areas and copy any of them afterwards.",
      },
      {
        question: "How is this different from the Color Palette Generator?",
        answer:
          "The Color Picker samples the exact pixel you click. The Palette Generator instead analyses the whole image and extracts its dominant colours automatically. Use the picker for precision, the palette for overall colour themes.",
      },
    ],
  },

  "image-collage": {
    title: "Image Collage Maker — Combine Photos into a Grid Collage",
    description:
      "Combine multiple images into a custom grid collage — control columns, spacing, corner rounding and background. Free collage maker, no uploads or watermark.",
    keywords: [
      "photo collage maker",
      "image collage online",
      "collage maker free",
      "combine photos into one",
      "grid photo collage",
      "photo grid maker",
      "collage maker no watermark",
      "merge images online",
      "picture collage online free",
    ],
    about:
      "GenRise Image Collage Maker combines multiple photos into one clean grid. Choose the column count (or let it pick automatically), dial in the gap between cells, round the corners, set a background colour, and decide whether images fill each cell or fit inside it whole. Reorder pictures with arrow controls before you build. The finished collage downloads as a single image — created entirely on your device, with no watermark and no account.",
    features: [
      "Automatic grid layout or 1–6 fixed columns",
      "Adjustable gap between photos and rounded corners",
      "Custom background colour behind the grid",
      "Fill-cell or fit-whole-image modes per collage",
      "Reorder and remove images before building",
      "No watermark, no upload, no sign-up",
    ],
    useCases: [
      "Combining product shots into one listing image",
      "Before-and-after or progress collages for social posts",
      "Event photo grids for sharing in one image",
      "Comparison layouts for reviews and tutorials",
      "Family photo collages for printing",
    ],
    faqs: [
      {
        question: "How many photos can I put in a collage?",
        answer:
          "There's no hard cap — add two or more. With Auto columns the tool picks a near-square layout; or choose 1–6 columns to control the grid yourself.",
      },
      {
        question: "Can I control the spacing between photos?",
        answer:
          "Yes — a gap slider sets the pixel space between cells, and a separate slider rounds the corners of each image. You can also set the background colour that shows through the gaps.",
      },
      {
        question: "What does \"Fill cell\" vs \"Fit whole image\" mean?",
        answer:
          "Fill cell crops each image to completely fill its grid cell (clean, uniform look). Fit whole image shows every photo uncropped inside its cell, with background colour filling any leftover space.",
      },
      {
        question: "Is there a watermark on the collage?",
        answer:
          "No. Like every GenRise tool, output is clean and free — no watermark, no account, no upload of your photos.",
      },
    ],
  },

  "background-remover": {
    title: "Background Remover — Transparent PNG, Free & On-Device",
    description:
      "Remove image backgrounds automatically with an on-device model — no uploads, no sign-up, no watermarks. Download a transparent PNG free.",
    keywords: [
      "remove background from image",
      "background remover",
      "remove bg online free",
      "transparent background maker",
      "png transparent background",
      "background eraser online",
      "remove image background no upload",
      "cut out image background",
      "free background remover no sign up",
    ],
    about:
      "GenRise Background Remover cuts the subject out of a photo and gives it a transparent background — the job most tools charge for or put behind an account wall. It runs a machine-learning model entirely on your device: the first use downloads the small model, then every removal happens locally in the browser. Your image is never uploaded — a genuine privacy difference from services that process photos on their servers. The result previews on a transparency checkerboard and downloads as a PNG.",
    features: [
      "Automatic subject detection and background removal",
      "On-device model — images are never uploaded to a server",
      "Transparent PNG output, previewed on a checkerboard",
      "Model caches after first use; faster on every run after",
      "No sign-up, no watermark, no per-image credits",
      "Works on any image your browser can read",
    ],
    useCases: [
      "Product photos with clean transparent backgrounds for listings",
      "Profile pictures and headshots without distracting backdrops",
      "Cutouts for thumbnails, stickers, memes and designs",
      "Transparent signatures for documents (pair with Signature Optimizer)",
      "ID-style photos needing a clean backdrop before resizing",
    ],
    faqs: [
      {
        question: "Is the background removal really free?",
        answer:
          "Yes — unlimited removals, no credits, no watermark, no account. The model runs on your device, so there's no per-image server cost being passed to you.",
      },
      {
        question: "Are my photos uploaded for processing?",
        answer:
          "No — this is the key difference from most background removers. A small model downloads once, then segmentation runs locally in your browser. The photo itself never leaves your device.",
      },
      {
        question: "Why does the first run take longer?",
        answer:
          "The first use downloads the on-device model, shown as a loading step. It's cached afterwards, so subsequent removals start much faster.",
      },
      {
        question: "What format is the result?",
        answer:
          "A PNG with a transparent background — the only common format that preserves transparency. Drop it straight into designs, listings or documents.",
      },
      {
        question: "What kinds of images work best?",
        answer:
          "Clear subjects against a distinguishable background — people, products, pets, objects. Very low-contrast or heavily cluttered scenes can leave rough edges; a cleaner source photo gives a cleaner cutout.",
      },
    ],
  },

  "color-palette-generator": {
    title: "Color Palette Generator — Extract Colors from Any Image",
    description:
      "Extract a color palette from any image — click swatches to copy HEX codes, or export the whole palette as CSS variables. Free and browser-based.",
    keywords: [
      "color palette generator",
      "extract colors from image",
      "color palette from image",
      "image color palette",
      "get colors from photo",
      "hex palette generator",
      "css color palette",
      "dominant color extractor",
      "color scheme from image",
      "palette extractor",
    ],
    about:
      "GenRise Color Palette Generator analyses an image and extracts its dominant colours as a ready-to-use palette. Click any swatch to copy its HEX code, copy the whole list at once, or export the palette as CSS custom properties you can paste straight into a stylesheet. It's the quickest route from \"I love the colours in this photo\" to usable codes — and the image is analysed locally in your browser, never uploaded.",
    features: [
      "Automatic extraction of an image's dominant colours",
      "Click any swatch to copy its HEX code",
      "Copy all HEX codes at once, or export as CSS variables",
      "Works with any browser-readable image",
      "Instant results — analysis happens on-device",
      "Free, no sign-up, no upload",
    ],
    useCases: [
      "Building a website or brand palette from inspiration photos",
      "Pulling CSS custom properties from a design mockup",
      "Matching a design's colours to a photo or logo",
      "Creating cohesive social graphics from one image's palette",
      "Extracting colour schemes from artwork or nature photography",
    ],
    faqs: [
      {
        question: "How do I get a colour palette from an image?",
        answer:
          "Drop the image in — the tool analyses it automatically and shows the dominant colours as swatches. Click any swatch to copy its HEX code.",
      },
      {
        question: "Can I use the palette in CSS?",
        answer:
          "Yes — \"Copy as CSS variables\" outputs a ready-to-paste :root block with each colour as a custom property like --color-1, --color-2, and so on.",
      },
      {
        question: "How is this different from the Color Picker?",
        answer:
          "The Palette Generator finds the image's dominant colours automatically across the whole picture. The Color Picker lets you click a specific pixel for its exact colour. Use both: palette for the theme, picker for precision.",
      },
      {
        question: "Is the image uploaded anywhere?",
        answer:
          "No. The palette is computed by analysing the image on a local canvas in your browser — the file stays on your device.",
      },
    ],
  },

  // ── PDFs ──────────────────────────────────────────────────────────────────

  "image-to-pdf": {
    title: "Image to PDF — Convert JPG & PNG Photos into One PDF",
    description:
      "Combine one or more images into a single PDF, in the order you choose, on A4, Letter or fit-to-image pages. Free, private, and runs in your browser.",
    keywords: [
      "image to pdf",
      "jpg to pdf",
      "png to pdf",
      "convert photo to pdf",
      "images to pdf converter",
      "combine images into pdf",
      "jpg to pdf online free",
      "photo to pdf no upload",
      "multiple images to one pdf",
      "picture to pdf converter",
    ],
    about:
      "GenRise Image to PDF combines one or many images into a single PDF document, in the order you arrange them. Pick a page size — A4 or Letter for standard documents, or fit-to-image so each page matches the photo exactly. It's built for the everyday jobs: turning scanned pages into a document, packaging photos for an application, or making a shareable PDF out of phone pictures. Conversion runs locally with pdf-lib, so documents never leave your device.",
    features: [
      "Combine multiple images into one PDF, in your chosen order",
      "A4, Letter, or fit-to-image page sizes",
      "Accepts JPG, PNG and other browser-readable image formats",
      "Reorder images before generating the document",
      "Instant download — PDF is generated on-device with pdf-lib",
      "No upload, no sign-up, no watermark on the output",
    ],
    useCases: [
      "Turning scanned pages or phone photos of documents into a PDF",
      "Packaging certificate and ID photos for an application",
      "Converting receipts and invoices to a single shareable PDF",
      "Making a PDF portfolio or photo document",
      "Preparing images for portals that only accept PDF uploads",
    ],
    faqs: [
      {
        question: "How do I convert multiple JPGs into one PDF?",
        answer:
          "Drop all your images in, arrange them in the order you want, choose a page size, and generate — you get one PDF with one image per page.",
      },
      {
        question: "What does \"fit to image\" page size do?",
        answer:
          "It makes each PDF page exactly the dimensions of the image on it — no borders or scaling to paper size. Best for on-screen documents; choose A4 or Letter when the PDF will be printed.",
      },
      {
        question: "Will my photos lose quality in the PDF?",
        answer:
          "Images are embedded at their original resolution — the PDF wrapper doesn't degrade them. File size roughly reflects the source images.",
      },
      {
        question: "Are my documents uploaded to convert them?",
        answer:
          "No. The PDF is assembled locally in your browser using pdf-lib — nothing is sent to a server, which makes it safe for sensitive scans like IDs and certificates.",
      },
      {
        question: "Can I control the page order?",
        answer:
          "Yes — reorder the images in the list before generating, and the PDF pages follow that order.",
      },
    ],
  },

  "merge-pdf": {
    title: "Merge PDF — Combine Multiple PDFs into One File",
    description:
      "Merge PDF files into a single document in the order you choose — free, unlimited, and entirely in your browser. No uploads, no sign-up, no watermarks.",
    keywords: [
      "merge pdf",
      "combine pdf files",
      "merge pdf online free",
      "join pdf files",
      "pdf merger",
      "combine pdfs into one",
      "merge pdf no upload",
      "pdf combiner",
      "merge pdf without uploading",
      "concatenate pdf",
    ],
    about:
      "GenRise Merge PDF combines multiple PDF files into one document, in the exact order you arrange them. It's built with pdf-lib running in your browser — pages are copied directly into a new document, so there's no re-rendered quality loss and, more importantly, your documents are never uploaded to a server. That makes it safe for the merges that matter most: application packets, contracts, bank statements and anything confidential.",
    features: [
      "Merge any number of PDFs into a single document",
      "Arrange files in the exact order you need before merging",
      "Pages are copied losslessly — no recompression of content",
      "Works on large documents without server file-size caps",
      "100% private — files are processed on your device",
      "Free with no watermarks, page limits, or sign-up",
    ],
    useCases: [
      "Combining a resume, cover letter and certificates into one application PDF",
      "Merging monthly statements or invoices into a single archive",
      "Joining scanned document pages saved as separate PDFs",
      "Assembling chapters or reports into one file for submission",
      "Bundling receipts for an expense report",
    ],
    faqs: [
      {
        question: "How do I merge PDF files in a specific order?",
        answer:
          "Add all your PDFs, then arrange them in the order you want using the controls — the merged document's pages follow that sequence exactly.",
      },
      {
        question: "Does merging reduce PDF quality?",
        answer:
          "No. Pages are copied directly into the new document rather than re-rendered, so text stays selectable and images keep their original quality.",
      },
      {
        question: "Is there a file size or page limit?",
        answer:
          "No server-imposed limits — the practical ceiling is your device's memory, since merging happens locally. Everyday documents merge instantly.",
      },
      {
        question: "Are my documents uploaded anywhere?",
        answer:
          "No — that's the point of this tool. Most online mergers upload your files to a server; this one assembles the PDF entirely in your browser, so confidential documents never leave your device.",
      },
      {
        question: "Can I merge password-protected PDFs?",
        answer:
          "Encrypted PDFs generally can't be merged without the password — the tool will flag an unreadable file. Remove the password in the source app first, then merge.",
      },
    ],
  },

  "compress-pdf": {
    title: "Compress PDF — Reduce PDF File Size for Email & Uploads",
    description:
      "Shrink PDF file size by recompressing embedded images at a chosen quality level. Great for scanned documents — free, private, and fully in-browser.",
    keywords: [
      "compress pdf",
      "reduce pdf size",
      "pdf compressor",
      "shrink pdf file",
      "compress pdf online free",
      "reduce pdf file size for email",
      "pdf size reducer",
      "compress scanned pdf",
      "compress pdf no upload",
      "make pdf smaller",
    ],
    about:
      "GenRise Compress PDF shrinks PDF files where their size actually lives: embedded images. It recompresses JPEG images inside the document at your chosen quality and downscales oversized pictures, then re-serializes the file efficiently — so scanned and photo-heavy PDFs can drop dramatically in size while text stays sharp and selectable. Pick Smallest size, Balanced or Best quality depending on how much you need to save. Everything runs in a browser worker, so even confidential documents are never uploaded.",
    features: [
      "Three quality levels: Smallest size, Balanced, Best quality",
      "Recompresses and downscales embedded JPEG images — the real source of PDF bulk",
      "Shows original vs. new size so you can see the savings",
      "Text remains text — pages aren't flattened to images",
      "Runs in a background worker so big files don't freeze the page",
      "Fully on-device — no upload, no sign-up, no watermark",
    ],
    useCases: [
      "Getting a scanned document under an email attachment limit",
      "Shrinking a PDF to fit a portal's upload cap",
      "Reducing photo-heavy reports for faster sharing",
      "Compressing application documents before submission",
      "Archiving large PDFs at a smaller size",
    ],
    faqs: [
      {
        question: "Why didn't my PDF get much smaller?",
        answer:
          "Compression targets embedded images. A PDF that's mostly text is already small, and images stored as Flate/CCITT (common in some scans) aren't recompressed. The biggest wins are on photo- and JPEG-heavy documents.",
      },
      {
        question: "Does compression affect text and readability?",
        answer:
          "Text stays selectable and sharp — only embedded images are recompressed. On Balanced or Best quality, pages typically look identical on screen.",
      },
      {
        question: "Which quality level should I choose?",
        answer:
          "Balanced is the right default. Choose Smallest size when you're fighting a hard upload limit, and Best quality when the PDF will be printed or zoomed.",
      },
      {
        question: "Is it safe to compress confidential documents here?",
        answer:
          "Yes. Unlike server-side compressors, the file is processed in your browser — it never leaves your device, so contracts, statements and IDs stay private.",
      },
    ],
  },

  "pdf-organizer": {
    title: "PDF Page Organizer — Reorder, Rotate & Delete PDF Pages",
    description:
      "Rearrange PDF pages visually — drag to reorder, rotate or delete pages, then export a new PDF. Free, in-browser, no uploads or sign-up.",
    keywords: [
      "reorder pdf pages",
      "pdf page organizer",
      "delete pages from pdf",
      "rearrange pdf pages",
      "organize pdf online",
      "remove pages from pdf",
      "rotate pdf pages",
      "pdf page manager",
      "edit pdf page order free",
    ],
    about:
      "GenRise PDF Page Organizer gives you a visual, thumbnail view of every page in your PDF — drag pages to reorder them, rotate the ones that came out sideways, mark pages for deletion, and export a rebuilt PDF with only the pages you kept, in the order you arranged. It's the fix for scanned documents that arrived in the wrong order or with extra pages. Processing is fully in-browser via pdf-lib, so documents never leave your device.",
    features: [
      "Thumbnail grid of every page — see the whole document at once",
      "Drag-and-drop page reordering",
      "Rotate individual pages in 90° steps",
      "Delete pages visually — kept-page count shown live",
      "Export produces a clean, rebuilt PDF",
      "On-device processing — private and instant",
    ],
    useCases: [
      "Fixing the page order of a scanned document",
      "Removing blank or unwanted pages before sharing a PDF",
      "Rotating landscape pages in a portrait document",
      "Pulling together the right pages for a submission",
      "Cleaning up a combined or exported PDF",
    ],
    faqs: [
      {
        question: "How do I reorder pages in a PDF?",
        answer:
          "Upload the PDF — each page appears as a draggable thumbnail. Drag a page onto its new position, and the order updates live. Hit export to download the rearranged document.",
      },
      {
        question: "Can I delete just one page?",
        answer:
          "Yes — mark any page for deletion and it's excluded from the exported PDF. The live counter shows how many pages will be kept.",
      },
      {
        question: "Does it work on large PDFs?",
        answer:
          "Yes. For very long documents, thumbnails render for the first batch of pages to keep things fast — reordering and deleting still work on every page.",
      },
      {
        question: "Are deleted pages gone permanently?",
        answer:
          "Only in the exported copy — your original file is never modified. Download the new PDF and keep or discard the original as you like.",
      },
      {
        question: "Is my document uploaded?",
        answer:
          "No. Page thumbnails render and the new PDF is assembled entirely in your browser — nothing is sent to a server.",
      },
    ],
  },

  "split-pdf": {
    title: "Split PDF — Extract Pages or Split into Separate Files",
    description:
      "Extract a page range like 1-3,5 into a new PDF, or split every page into separate files bundled in a ZIP. Free, private, in-browser.",
    keywords: [
      "split pdf",
      "extract pages from pdf",
      "pdf splitter",
      "separate pdf pages",
      "split pdf into individual pages",
      "extract page from pdf online",
      "pdf page extractor",
      "cut pdf pages",
      "split pdf no upload",
    ],
    about:
      "GenRise Split PDF pulls pages out of a PDF two ways: extract a custom selection — type a range like 1-3,5 — into one new PDF, or split the whole document into separate one-page PDFs bundled in a ZIP. It's the tool for pulling just the pages you need from a long document, or breaking a scan into individual pages. Splitting is done with pdf-lib in your browser — the file never leaves your device.",
    features: [
      "Extract custom page ranges (e.g. 1-3,5,8) into a single new PDF",
      "Or split every page into separate PDFs delivered as a ZIP",
      "Page count detected automatically on upload",
      "Pages are copied losslessly — text and images unchanged",
      "Original file untouched — output is always a new file",
      "No upload, no sign-up, no page limits",
    ],
    useCases: [
      "Extracting just the pages you need from a long report",
      "Splitting a multi-document scan back into separate documents",
      "Pulling a single invoice or chapter out of a bundle",
      "Creating one-page files for portals that accept single pages",
      "Sharing part of a PDF without sending the whole thing",
    ],
    faqs: [
      {
        question: "How do I extract specific pages like 1-3 and 7?",
        answer:
          "Choose the page-range mode and type 1-3,7 — commas separate individual pages and ranges. The extracted pages download as one new PDF in order.",
      },
      {
        question: "Can I turn a PDF into separate single-page files?",
        answer:
          "Yes — use the single-pages mode and every page becomes its own PDF, named and bundled in a ZIP for easy download.",
      },
      {
        question: "Does splitting affect quality?",
        answer:
          "No. Pages are copied directly into new documents — text stays selectable and images keep full quality.",
      },
      {
        question: "Can it split a password-protected PDF?",
        answer:
          "Encrypted PDFs can't be read without the password, so the tool will flag it. Remove the password in the source application first.",
      },
      {
        question: "Is the original file modified?",
        answer:
          "Never — splitting always produces new files and leaves your original exactly as it was.",
      },
    ],
  },

  "pdf-to-image": {
    title: "PDF to Image — Convert PDF Pages to PNG or JPG",
    description:
      "Turn each PDF page into a downloadable PNG or JPG image at screen, balanced or print DPI. Download pages individually or as a ZIP — free and private.",
    keywords: [
      "pdf to image",
      "pdf to png",
      "pdf to jpg",
      "convert pdf to image",
      "pdf page to image",
      "pdf to picture online",
      "extract images from pdf pages",
      "pdf to png 300 dpi",
      "pdf to jpg converter",
      "pdf pages to images free",
    ],
    about:
      "GenRise PDF to Image renders every page of a PDF into a downloadable image — PNG for lossless quality or JPG for smaller files — at your choice of 96 DPI for screens, 150 DPI balanced, or 300 DPI for print-sharp output. Grab pages individually or download them all as a ZIP. Rendering uses the same PDF.js engine browsers ship with, run locally — so the document is never uploaded.",
    features: [
      "Every PDF page rendered to a separate image",
      "PNG (lossless) or JPG (smaller) output",
      "96, 150 or 300 DPI — screen to print quality",
      "Download single pages or everything as a ZIP",
      "Accurate rendering via the PDF.js engine, run locally",
      "Fully private — the PDF never leaves your device",
    ],
    useCases: [
      "Turning PDF pages into images for slides or social posts",
      "Extracting a PDF page to paste into a document or design",
      "Converting scanned PDF pages to JPGs for easy sharing",
      "Generating high-DPI page images for print workflows",
      "Previewing PDF content in apps that only accept images",
    ],
    faqs: [
      {
        question: "Should I choose PNG or JPG?",
        answer:
          "PNG is lossless — best for text and line art that must stay crisp. JPG produces smaller files — good for photo-heavy pages and scans where slight compression is fine.",
      },
      {
        question: "What DPI should I use?",
        answer:
          "96 DPI is fine for screens and messaging. 150 DPI is a good middle ground. Choose 300 DPI when the images will be printed or zoomed into.",
      },
      {
        question: "Can I convert just one page?",
        answer:
          "Yes — all pages render as thumbnails and you can download any single page on its own, or the whole set as a ZIP.",
      },
      {
        question: "Why does converting a big PDF take a moment?",
        answer:
          "Each page is rendered at your chosen DPI on your device — higher DPI means larger images and a bit more work. Nothing is uploaded, so speed depends on your machine, not a server queue.",
      },
    ],
  },

  "rotate-pdf": {
    title: "Rotate PDF Pages — Fix Orientation in 90° Steps",
    description:
      "Rotate all pages or just selected ones by 90, 180 or 270 degrees and save a corrected PDF. Free, instant, and processed entirely in your browser.",
    keywords: [
      "rotate pdf",
      "rotate pdf pages",
      "rotate pdf online free",
      "fix pdf orientation",
      "rotate pdf permanently",
      "turn pdf pages",
      "pdf rotate and save",
      "rotate single page in pdf",
      "rotate scanned pdf",
    ],
    about:
      "GenRise Rotate PDF fixes orientation problems permanently — rotate every page or just the ones you select by 90-degree increments, then save a corrected PDF. Unlike rotating in a viewer, the change is baked into the file, so it opens upright everywhere. It's the quick fix for scans that came out sideways or landscape pages trapped in a portrait document — and the file is processed on-device, never uploaded.",
    features: [
      "Rotate all pages or only selected ones",
      "90°, 180° and 270° rotation in right-angle steps",
      "Rotation is saved into the PDF — not just a view change",
      "Works on scanned and generated PDFs alike",
      "Instant in-browser processing with pdf-lib",
      "Free, private, no sign-up or watermark",
    ],
    useCases: [
      "Fixing scanned documents that saved sideways or upside down",
      "Rotating landscape pages inside a portrait document",
      "Correcting PDFs before uploading to a portal",
      "Preparing a document for printing in the right orientation",
      "Fixing phone-scanned pages that rotated the wrong way",
    ],
    faqs: [
      {
        question: "Does the rotation actually save into the file?",
        answer:
          "Yes. The rotation is written into the PDF itself, so the document opens correctly rotated in any viewer — unlike rotating in a reader, which only changes your view.",
      },
      {
        question: "Can I rotate just one page?",
        answer:
          "Yes — apply rotation to selected pages only, so you can fix a single sideways page in an otherwise fine document.",
      },
      {
        question: "Why did my scanned PDF save sideways?",
        answer:
          "Scanners and phone cameras often write pages in the orientation the sensor captured, ignoring how you held the document. Rotating the affected pages here fixes the file permanently.",
      },
      {
        question: "Is my PDF uploaded to rotate it?",
        answer:
          "No — the rotation is applied by pdf-lib running in your browser, and the corrected file is generated locally.",
      },
    ],
  },

  "pdf-to-word": {
    title: "PDF to Word — Convert PDF Text to an Editable DOCX",
    description:
      "Extract the text from a PDF into an editable Word (.docx) document with page breaks preserved. Free, private, and converted in your browser.",
    keywords: [
      "pdf to word",
      "convert pdf to word",
      "pdf to docx",
      "pdf to editable word",
      "extract text from pdf",
      "pdf to word online free",
      "pdf to word no upload",
      "edit pdf in word",
      "pdf to doc converter",
    ],
    about:
      "GenRise PDF to Word converts a PDF into an editable .docx file by extracting its text — including page breaks — into a clean Word document you can edit, reformat and reuse. It's honest about what it does: text converts, while complex layouts, embedded images and exact styling aren't preserved — which makes it ideal for pulling editable content out of text documents rather than recreating designed layouts. Conversion happens locally, so confidential files are never uploaded.",
    features: [
      "Converts PDF text into an editable .docx file",
      "Page breaks preserved between PDF pages",
      "Editable output for Word, Google Docs and LibreOffice",
      "Instant conversion in the browser — no upload queue",
      "Private: documents are processed on your device",
      "Free with no sign-up, limits, or watermark",
    ],
    useCases: [
      "Editing the text of a PDF you no longer have the source for",
      "Reusing content from a report or contract in a new document",
      "Pulling text out of a PDF for translation or rewriting",
      "Fixing typos in a document that only exists as a PDF",
      "Converting text-based PDFs for accessible editing",
    ],
    faqs: [
      {
        question: "Will my PDF's layout and images be preserved?",
        answer:
          "No — this tool extracts the text with page breaks into an editable document. Complex layouts, columns, images and exact styling aren't recreated. For a faithful visual copy of a page, convert it to an image with PDF to Image instead.",
      },
      {
        question: "Why does the output only contain text?",
        answer:
          "Extracting editable text from a PDF — rather than pixel-perfect layout — produces a document you can actually edit. Tools promising full layout conversion usually rasterize or use heavy server-side AI; this tool favours clean, editable text.",
      },
      {
        question: "Does it work on scanned PDFs?",
        answer:
          "A scanned PDF is a set of images with no extractable text — the .docx would come out empty. Run it through the OCR Text Extractor first to get the text, then use that output.",
      },
      {
        question: "Is my document uploaded for conversion?",
        answer:
          "No. Text extraction and .docx generation happen in your browser — the file never leaves your device.",
      },
    ],
  },

  // ── Documents ─────────────────────────────────────────────────────────────

  "invoice-generator": {
    title: "Invoice Generator — Create a Professional Invoice PDF Free",
    description:
      "Create a clean, professional invoice PDF — items, quantities, tax, discount, notes and your currency. Draft auto-saves on your device. No sign-up.",
    keywords: [
      "invoice generator",
      "free invoice generator",
      "invoice maker",
      "create invoice online",
      "invoice pdf generator",
      "freelance invoice template",
      "invoice generator no sign up",
      "simple invoice maker",
      "bill generator online",
      "invoice template free",
    ],
    about:
      "GenRise Invoice Generator builds a professional invoice PDF from a simple form: your business name and address, the customer's name, an invoice number and date, line items with quantity and price, tax and discount percentages, a currency symbol, and notes for payment terms or bank details. Totals compute live as you type. Your draft auto-saves on the device — come back later and it's still there. The PDF is generated locally, so your client and pricing details are never uploaded to anyone's server.",
    features: [
      "Line items with description, quantity and price — add as many as you need",
      "Automatic subtotal, discount, tax and grand total",
      "Currency selector covering major world currencies",
      "Invoice number, date and notes fields for payment terms",
      "Draft auto-saves locally — refresh or return later without losing work",
      "Clean PDF download generated entirely on your device",
    ],
    useCases: [
      "Freelancers invoicing clients for project work",
      "Small businesses issuing quick professional bills",
      "Contractors billing for jobs without accounting software",
      "Creating one-off invoices without signing up for a platform",
      "Drafting an invoice on mobile and finishing it later",
    ],
    faqs: [
      {
        question: "Is this invoice generator really free?",
        answer:
          "Yes — unlimited invoices, no account, no watermark, no \"premium template\" upsell. The PDF you download is clean and yours.",
      },
      {
        question: "Where is my invoice data stored?",
        answer:
          "In your browser's local storage on this device only — so your draft survives a refresh, but nothing is sent to a server. Clearing site data removes it.",
      },
      {
        question: "Can I add tax and a discount?",
        answer:
          "Yes — set a tax percentage and a discount percentage and both are applied to the subtotal automatically, with each line shown in the totals breakdown.",
      },
      {
        question: "Does it support currencies other than dollars?",
        answer:
          "Yes — pick from a list of major currencies, or no symbol at all. The symbol you choose is used throughout the invoice.",
      },
      {
        question: "Can I add my logo to the invoice?",
        answer:
          "The invoice is a clean text-based layout — business name and address appear at the top. It doesn't place a logo image, which keeps the PDF lightweight and professional.",
      },
    ],
  },

  "application-pack": {
    title: "Application Pack Builder — Bundle Documents into One ZIP",
    description:
      "Gather your resume, photo, signature and certificates into one ordered ZIP ready to submit. Files stay on your device — free and private.",
    keywords: [
      "application pack builder",
      "bundle documents zip",
      "job application documents",
      "resume pack zip",
      "application package builder",
      "combine documents for application",
      "zip files for job application",
      "document bundle maker",
      "college application pack",
    ],
    about:
      "GenRise Application Pack Builder bundles everything an application needs — resume, photo, signature, certificates, cover letter — into one neatly ordered ZIP you can submit or archive. Add files of any type, arrange them in order with up/down controls, remove extras, and build the pack in one click. Because the ZIP is assembled on your device, documents like IDs and certificates are never uploaded — a real privacy win over cloud bundlers for exactly the files that are most sensitive.",
    features: [
      "Bundle any file types — PDFs, images, documents — into one ZIP",
      "Order files exactly as the application requires",
      "Add and remove files freely before building",
      "Produces a ready-to-submit application-pack.zip",
      "On-device ZIP creation — sensitive documents never uploaded",
      "Free, no sign-up, no file-count limits",
    ],
    useCases: [
      "Assembling a complete job application package",
      "Bundling documents for college or scholarship applications",
      "Packaging visa or government form submissions",
      "Sending a client a full document set as one file",
      "Archiving everything related to one application together",
    ],
    faqs: [
      {
        question: "What should go in an application pack?",
        answer:
          "Typically your resume or CV, a cover letter, a passport-style photo, your signature image, and supporting certificates — in whatever order the application specifies. Rename files clearly before adding them; the pack keeps their names.",
      },
      {
        question: "Why ZIP and not a merged PDF?",
        answer:
          "A ZIP preserves each document as its own file at full quality — which many portals and recruiters prefer to a single merged document. If you do need one PDF, merge your PDFs first with the Merge PDF tool.",
      },
      {
        question: "Are my documents uploaded to build the pack?",
        answer:
          "No — the ZIP is assembled in your browser. Resumes, IDs and certificates stay on your device the whole time.",
      },
      {
        question: "Is there a size limit?",
        answer:
          "No server limits — the constraint is just your device memory. Check the destination portal's own upload limit for the final ZIP.",
      },
    ],
  },

  "gpa-calculator": {
    title: "GPA Calculator — College GPA on 4.0 & 4.3 Scales",
    description:
      "Calculate your GPA from letter grades with credit hours and weighted courses — on 4.0 or 4.3 scales. Instant results, no sign-up, nothing stored.",
    keywords: [
      "gpa calculator",
      "college gpa calculator",
      "gpa calculator 4.0 scale",
      "calculate gpa with credit hours",
      "weighted gpa calculator",
      "semester gpa calculator",
      "gpa calculator with credits",
      "4.3 scale gpa",
      "grade point average calculator",
      "cumulative gpa calculator",
    ],
    about:
      "GenRise GPA Calculator computes your grade point average from letter grades and credit hours, on either the standard 4.0 scale or the 4.3 scale that counts A+. Add courses, pick each letter grade, set credit hours, and mark weighted courses where your school awards bonus points. GPA and total quality points update instantly — no account, and nothing you enter leaves your device.",
    features: [
      "Standard 4.0 and extended 4.3 (A+ = 4.3) grading scales",
      "Per-course credit hours for a properly weighted average",
      "Weighted-course support for honours and AP-style grading",
      "Letter-grade dropdowns from A+ down",
      "Live GPA and total quality points as you add courses",
      "Private — grades never leave your browser",
    ],
    useCases: [
      "Checking your semester GPA before grades are official",
      "Planning what grades you need to hit a target GPA",
      "Converting letter grades to a 4.0-scale GPA for applications",
      "Calculating GPA with weighted honours or AP courses",
      "Tracking GPA across a transcript for scholarship applications",
    ],
    faqs: [
      {
        question: "How is GPA calculated?",
        answer:
          "Each letter grade converts to grade points (A = 4.0, B = 3.0, etc.); each course's points are multiplied by its credit hours to get quality points; the GPA is total quality points divided by total credit hours.",
      },
      {
        question: "What's the difference between the 4.0 and 4.3 scales?",
        answer:
          "On a 4.0 scale an A+ is worth 4.0 — the same as an A. On a 4.3 scale an A+ earns 4.3, rewarding the top grade. Use whichever your institution publishes.",
      },
      {
        question: "How do weighted courses work?",
        answer:
          "Weighted courses (like honours or AP classes) add bonus grade points, letting GPA exceed 4.0 on a weighted scale. Mark a course as weighted if your school gives it extra points.",
      },
      {
        question: "Can I calculate my cumulative GPA?",
        answer:
          "Enter all your courses across semesters and the result is your cumulative GPA. For a single term, enter just that term's courses.",
      },
      {
        question: "Is my data saved?",
        answer:
          "Nothing is stored or sent anywhere — the calculation runs in your browser and clears when you leave or refresh.",
      },
    ],
  },

  // ── Data & Text ───────────────────────────────────────────────────────────

  "file-info": {
    title: "File Info Checker — Inspect Type, Size, Dimensions & Pages",
    description:
      "Check any file's type, size, last-modified date, image dimensions and PDF page count — instantly, in your browser, with nothing uploaded.",
    keywords: [
      "file info checker",
      "check file size online",
      "file type identifier",
      "image dimensions checker",
      "pdf page count",
      "inspect file metadata",
      "what type is this file",
      "file details viewer",
      "check image size pixels",
      "file properties online",
    ],
    about:
      "GenRise File Info Checker inspects a file and reports what it actually is: the filename, MIME type, exact size, and last-modified date — plus image width and height in pixels for pictures, and page count for PDFs. It's the quick answer to \"why won't this upload\" — check whether the file is too big, the wrong type, or the wrong dimensions before submitting. Inspection runs locally in your browser, so even private documents are never uploaded.",
    features: [
      "Reports file name, MIME type, exact size and last-modified date",
      "Image files show width × height in pixels",
      "PDFs show their page count",
      "Works on any file type — no format restrictions",
      "Instant results with zero upload",
      "Free, private and works on any device",
    ],
    useCases: [
      "Checking if a file meets an upload size limit before submitting",
      "Verifying a photo's pixel dimensions for a form spec",
      "Confirming a PDF's page count before printing or splitting",
      "Identifying the real type of a file with a missing or wrong extension",
      "Checking when a downloaded file was last modified",
    ],
    faqs: [
      {
        question: "What details does it show for a photo?",
        answer:
          "Along with name, type, size and modified date, image files report their width and height in pixels — handy for forms that demand exact dimensions.",
      },
      {
        question: "Can it tell me how many pages a PDF has?",
        answer:
          "Yes — PDFs report their page count, read locally with pdf-lib. Encrypted or malformed PDFs may not yield a count.",
      },
      {
        question: "Does it show hidden metadata like GPS location?",
        answer:
          "It shows core file properties, not EXIF photo metadata. To see camera, date and GPS data embedded in a photo — and remove it — use the Metadata Remover.",
      },
      {
        question: "Is the file uploaded to inspect it?",
        answer:
          "No. Everything is read locally by your browser — the file's contents never leave your device.",
      },
    ],
  },

  "zip-creator": {
    title: "ZIP Creator — Compress Files into a ZIP Archive Online",
    description:
      "Bundle multiple files into a single ZIP archive with a custom name — created locally in your browser. Free, unlimited, and nothing is uploaded.",
    keywords: [
      "zip creator",
      "create zip file online",
      "zip files together",
      "make a zip archive",
      "compress files to zip",
      "online zip maker",
      "zip multiple files",
      "create zip without winzip",
      "bundle files into zip",
      "zip file creator free",
    ],
    about:
      "GenRise ZIP Creator packages multiple files into a single .zip archive — name it whatever you like and download instantly. It's the browser-native answer to \"how do I zip these files\" on any device, including ones where you can't install software. The archive is built on your device with JSZip, so the files you're bundling are never uploaded — which matters when the ZIP contains documents you wouldn't hand to a random server.",
    features: [
      "Bundle any number and mix of files into one ZIP",
      "Custom archive filename",
      "Standard .zip format that opens everywhere — Windows, macOS, phones",
      "No file-size limits imposed by a server",
      "Files are packaged on-device, never uploaded",
      "Free with no sign-up or watermark",
    ],
    useCases: [
      "Bundling documents to send as one attachment",
      "Zipping a project folder for upload where only archives are accepted",
      "Packaging photos or files on a device without zip software",
      "Creating an application pack of mixed file types",
      "Compressing a set of files for easier sharing",
    ],
    faqs: [
      {
        question: "How do I zip multiple files into one archive?",
        answer:
          "Drop all the files in, give the archive a name, and build — the ZIP downloads immediately and opens on any device.",
      },
      {
        question: "Will a ZIP made here open on Windows and Mac?",
        answer:
          "Yes — it's a standard .zip archive, so it extracts with the built-in tools on Windows, macOS, Linux, iOS and Android.",
      },
      {
        question: "Does zipping reduce file size?",
        answer:
          "ZIP compression shrinks text-heavy and uncompressed files noticeably; already-compressed formats like JPG, MP4 and PDF shrink little. The main benefit is often bundling many files into one.",
      },
      {
        question: "Are my files uploaded to create the ZIP?",
        answer:
          "No — the archive is assembled locally in your browser. Nothing is transmitted, which makes this safe for confidential files.",
      },
    ],
  },

  "csv-json": {
    title: "CSV to JSON Converter — & JSON to CSV, Format & Minify",
    description:
      "Convert CSV to JSON, JSON to CSV, and format or minify JSON — instantly in your browser. Copy or download the output. Free and private.",
    keywords: [
      "csv to json",
      "json to csv",
      "csv json converter",
      "convert csv to json online",
      "json to csv converter",
      "format json",
      "minify json",
      "csv to json online free",
      "json formatter",
      "csv converter",
    ],
    about:
      "GenRise CSV / JSON Tools handles the four everyday data chores in one place: convert CSV to a JSON array, convert JSON back to CSV, pretty-print JSON with proper indentation, or minify it for production use. Paste your data, pick a mode, and the result is ready to copy or download as a .json or .csv file. Conversion happens entirely in your browser — a safer home for data that might contain emails, IDs or other values you shouldn't paste into a server-side converter.",
    features: [
      "CSV → JSON and JSON → CSV conversion",
      "JSON formatting (pretty-print) and minification",
      "Copy the output or download it as a .json / .csv file",
      "Clear errors when the input can't be parsed",
      "Handles pasted data of everyday spreadsheet size",
      "100% client-side — your data is never transmitted",
    ],
    useCases: [
      "Turning a spreadsheet export (CSV) into JSON for an API or app",
      "Converting JSON API responses into CSV for Excel or Sheets",
      "Pretty-printing a minified JSON blob to read it",
      "Minifying JSON before shipping it in a config or payload",
      "Quick conversions without installing CLI tools",
    ],
    faqs: [
      {
        question: "How do I convert a CSV file to JSON?",
        answer:
          "Paste the CSV (headers in the first row) into the input, pick \"CSV → JSON\", and convert — each row becomes a JSON object keyed by the headers. Copy the result or download it as a .json file.",
      },
      {
        question: "How do I turn JSON into a spreadsheet-friendly format?",
        answer:
          "Use \"JSON → CSV\" — an array of objects becomes CSV rows with a header line. The output downloads as a .csv that opens directly in Excel or Google Sheets.",
      },
      {
        question: "What's the difference between format and minify?",
        answer:
          "Format adds indentation and line breaks so JSON is readable; minify strips all whitespace so it's as small as possible. Same data, different packaging.",
      },
      {
        question: "Is my data uploaded to convert it?",
        answer:
          "No — conversion is pure JavaScript in your browser. Nothing you paste is sent anywhere, which matters for data containing personal or business information.",
      },
    ],
  },

  "text-tools": {
    title: "Text Tools — Word Counter, Case Converter & Line Cleanup",
    description:
      "Count words, characters and reading time; convert case; remove duplicate or empty lines; sort and reverse lines — all free, instant and private.",
    keywords: [
      "word counter",
      "character counter",
      "text tools online",
      "case converter",
      "remove duplicate lines",
      "remove empty lines",
      "sort lines alphabetically",
      "uppercase to lowercase converter",
      "reading time calculator",
      "text cleanup tool",
      "line sorter online",
    ],
    about:
      "GenRise Text Tools is a Swiss-army panel for pasted text: live counts for words, characters, sentences, lines and reading time; one-click case conversion (UPPERCASE, lowercase, Title Case, Sentence case); line cleanup that removes duplicates, blank lines and extra spaces; and sorting or reversing line order. Every transform is undoable — up to twenty steps back — so you can chain cleanups without fear. Nothing is sent anywhere: it's all JavaScript on your device.",
    features: [
      "Live word, character, sentence and line counts plus reading time",
      "Case conversion: UPPER, lower, Title and Sentence case",
      "Remove duplicate lines, empty lines and extra spaces",
      "Sort lines A→Z or Z→A and reverse line order",
      "Multi-step undo — every transform is reversible",
      "Paste, transform, copy — no upload, no account",
    ],
    useCases: [
      "Hitting a word or character limit for essays and applications",
      "Cleaning a pasted list: dedupe, strip blanks, sort",
      "Fixing ALL-CAPS pasted text to proper sentence case",
      "Counting characters for meta descriptions and posts",
      "Reversing or sorting lines of data quickly",
    ],
    faqs: [
      {
        question: "How do I count words and characters?",
        answer:
          "Paste or type your text — the counter updates live, showing words, characters, sentences, lines and an estimated reading time.",
      },
      {
        question: "Can it remove duplicate lines from a list?",
        answer:
          "Yes — \"Remove duplicate lines\" keeps the first occurrence of each line and drops the rest, keeping your list's original order.",
      },
      {
        question: "What case conversions are available?",
        answer:
          "UPPERCASE, lowercase, Title Case (each word capitalized) and Sentence case (first letter of each sentence capitalized) — all one click.",
      },
      {
        question: "What if I apply the wrong transform?",
        answer:
          "Hit Undo — the tool keeps a history of up to 20 steps, so you can walk back any chain of edits.",
      },
      {
        question: "Is my text stored or uploaded?",
        answer:
          "No — everything happens in-page with local JavaScript. Sensitive text like drafts and data never leaves your device.",
      },
    ],
  },

  "ocr-text-extractor": {
    title: "OCR Text Extractor — Pull Text from Images & Scanned PDFs",
    description:
      "Extract editable text from images and scanned PDFs with on-device OCR in 13 languages — English, Hindi, Arabic, Chinese, Japanese and more. Copy or download.",
    keywords: [
      "ocr online",
      "extract text from image",
      "image to text",
      "ocr text extractor",
      "copy text from image",
      "scanned pdf to text",
      "picture to text converter",
      "ocr hindi english",
      "free ocr no upload",
      "photo to text online",
    ],
    about:
      "GenRise OCR Text Extractor pulls editable text out of images and scanned PDFs using optical character recognition that runs on your device — not on a server that sees your documents. Pick from 13 languages including English, Hindi, Arabic, Chinese (Simplified), Japanese, Korean, Russian and major European languages; the language pack downloads once and stays cached. Copy the extracted text or download it as a .txt file — ideal for digitizing scans, grabbing text from screenshots, and making image-only PDFs searchable.",
    features: [
      "Extracts text from images (JPG, PNG, screenshots) and scanned PDFs",
      "13 languages: English, Hindi, Arabic, Chinese, Japanese, Korean, Russian, Spanish, French, German, Portuguese, Italian, Dutch",
      "On-device OCR — documents and images are never uploaded",
      "Language packs download once and cache for reuse",
      "Copy extracted text or download it as a .txt file",
      "Free with no page or image limits",
    ],
    useCases: [
      "Digitizing scanned documents into editable text",
      "Copying text out of screenshots and photos",
      "Extracting quotes from a photographed book page",
      "Making text from a scanned PDF copy-pasteable",
      "Pulling data from forms, receipts and printed tables",
    ],
    faqs: [
      {
        question: "How do I copy text from an image?",
        answer:
          "Drop the image in — OCR runs on your device and outputs the recognized text, ready to copy or download as a .txt file.",
      },
      {
        question: "Which languages are supported?",
        answer:
          "Thirteen: English, Spanish, French, German, Portuguese, Italian, Dutch, Hindi, Arabic, Chinese (Simplified), Japanese, Korean and Russian. Pick the language your document is written in for best accuracy.",
      },
      {
        question: "Can it read a scanned PDF?",
        answer:
          "Yes — a scanned PDF is just pages of images, and the extractor runs OCR on them. For born-digital PDFs that already contain text, the PDF to Word converter is the faster route.",
      },
      {
        question: "Why does the first extraction take longer?",
        answer:
          "The OCR engine and your chosen language pack download once, then cache in your browser — later extractions skip that step and start faster.",
      },
      {
        question: "How accurate is it?",
        answer:
          "Very good on clean, well-lit, straight-on images of printed text. Blurry photos, handwriting, and heavy stylization reduce accuracy — a sharper source gives a sharper result.",
      },
      {
        question: "Is my document uploaded for OCR?",
        answer:
          "No. Recognition runs entirely on your device — the image or PDF is never sent to a server, which is the whole point for sensitive documents.",
      },
    ],
  },

  // ── Security & Privacy ────────────────────────────────────────────────────

  "metadata-remover": {
    title: "Metadata Remover — Strip EXIF, GPS & Camera Data from Photos",
    description:
      "See and remove hidden EXIF metadata — GPS location, camera details, date taken — from JPG, PNG and WebP photos before sharing. Free and on-device.",
    keywords: [
      "metadata remover",
      "remove exif data",
      "exif remover online",
      "remove gps from photo",
      "strip photo metadata",
      "remove location data from image",
      "exif data viewer remover",
      "photo privacy tool",
      "clean image metadata",
      "remove camera info from photo",
    ],
    about:
      "Every phone photo quietly embeds EXIF metadata: the camera model, the date and time, and often the exact GPS coordinates where it was taken. Share the file and you share all of it. GenRise Metadata Remover first shows you what's embedded in a JPG, PNG or WebP — camera, date, GPS — then produces a clean copy with the hidden data stripped. Both steps run in your browser, so the photo's location data never passes through a server on its way to being removed.",
    features: [
      "Inspect first: see embedded camera, date-taken and GPS data before stripping",
      "Removes EXIF metadata including GPS coordinates",
      "Works on JPG, PNG and WebP photos",
      "Output is a clean copy — the original file is untouched",
      "View-then-clean flow so you know what you're removing",
      "On-device processing — photos never uploaded",
    ],
    useCases: [
      "Removing GPS location before posting photos publicly",
      "Stripping camera data from images sold or shared online",
      "Cleaning photos before listing items for sale",
      "Protecting your home address embedded in everyday photos",
      "Auditing what a photo reveals before sending it",
    ],
    faqs: [
      {
        question: "What metadata does a photo actually contain?",
        answer:
          "Typically the camera or phone model, the exact date and time, exposure settings — and for phone photos, often GPS coordinates precise enough to locate your house. This tool shows you what's there before removing it.",
      },
      {
        question: "Why should I remove metadata before sharing photos?",
        answer:
          "GPS EXIF data can reveal where you live, work, or took the photo — a real privacy risk on marketplaces, forums and public posts. Stripping it shares the image without sharing your location.",
      },
      {
        question: "Does removing metadata affect image quality?",
        answer:
          "No — only the hidden data blocks are removed. The visible image is unchanged.",
      },
      {
        question: "Do social media sites strip metadata for me?",
        answer:
          "Many large platforms strip EXIF on upload — but marketplaces, forums, email and direct file shares often don't. Stripping before you send is the only approach that's safe everywhere.",
      },
      {
        question: "Can I check what's in a photo without removing it?",
        answer:
          "Yes — upload it and the embedded camera, date and GPS data displays without any obligation to clean the file.",
      },
    ],
  },

  "password-generator": {
    title: "Password Generator — Strong Random Passwords, No Sign-Up",
    description:
      "Generate strong random passwords from 4 to 64 characters with uppercase, lowercase, numbers and symbols. Cryptographically secure, offline, free.",
    keywords: [
      "password generator",
      "random password generator",
      "strong password generator",
      "secure password generator",
      "password generator online",
      "generate strong password",
      "16 character password generator",
      "password maker",
      "cryptographically secure password",
      "free password generator",
    ],
    about:
      "GenRise Password Generator creates strong random passwords using your browser's cryptographic RNG (crypto.getRandomValues) — the same source of randomness used by password managers. Set any length from 4 to 64 characters and toggle uppercase, lowercase, numbers and symbols; each enabled character class is guaranteed to appear, so a \"numbers included\" password actually contains a digit. Generation happens offline on your device — no password is ever transmitted, logged or stored, which is exactly how a password generator should work.",
    features: [
      "Cryptographically secure randomness via crypto.getRandomValues",
      "Adjustable length from 4 to 64 characters",
      "Toggle uppercase, lowercase, numbers and symbols independently",
      "Guarantees every enabled character class appears at least once",
      "One-click copy to clipboard",
      "Fully offline generation — nothing leaves your device",
    ],
    useCases: [
      "Creating strong unique passwords for new accounts",
      "Generating Wi-Fi, device and admin passwords",
      "Replacing reused passwords after a breach",
      "Making PINs and codes that need real randomness",
      "Producing passwords that meet specific character requirements",
    ],
    faqs: [
      {
        question: "Are the passwords actually random and secure?",
        answer:
          "Yes. The generator uses crypto.getRandomValues — the browser's cryptographically secure random source — not the predictable Math.random. Each character is drawn uniformly from your chosen character set.",
      },
      {
        question: "What length should my password be?",
        answer:
          "16 characters is a strong default for most accounts. For high-value accounts (email, banking), go 20+. Length beats complexity — a longer password with mixed classes is harder to crack than a short symbol-heavy one.",
      },
      {
        question: "Is the generated password sent or stored anywhere?",
        answer:
          "No — generation is 100% offline in your browser. The password exists only on your screen until you copy it. This is meaningfully safer than generators that run on a server.",
      },
      {
        question: "Why is every character type guaranteed to appear?",
        answer:
          "If you enable symbols, at least one symbol is always included — so the result genuinely satisfies \"must contain a symbol\" style rules rather than occasionally producing passwords without one.",
      },
      {
        question: "Should I use symbols, or is length enough?",
        answer:
          "Both help. Mixed character classes widen the search space, but length does the heavy lifting — a 20-character lowercase password is stronger than an 8-character one with symbols. Use all four classes plus length where the site allows it.",
      },
    ],
  },

  "hash-generator": {
    title: "Hash Generator — SHA-1, SHA-256, SHA-384 & SHA-512 Checksums",
    description:
      "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes of text or any file — computed locally with WebCrypto. Verify downloads and data integrity free.",
    keywords: [
      "hash generator",
      "sha256 generator",
      "sha-256 hash online",
      "file checksum calculator",
      "sha1 hash generator",
      "sha512 generator",
      "md5 alternative hash",
      "checksum verifier",
      "hash text online",
      "file hash calculator",
      "verify file integrity",
    ],
    about:
      "GenRise Hash Generator computes SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text or file using the browser's built-in WebCrypto API — the same primitives that secure TLS. Paste text for an instant digest, or drop a file to compute its checksum for integrity verification. Because hashing runs locally, it's a trustworthy way to verify downloads: your file isn't uploaded, and the hex digest you compare against a published checksum is computed entirely on your machine.",
    features: [
      "SHA-1, SHA-256, SHA-384 and SHA-512 algorithms",
      "Hash pasted text or hash any file by dropping it in",
      "Powered by the browser's native WebCrypto — not a JS reimplementation",
      "Lowercase hex digest output with one-click copy",
      "Ideal for verifying download integrity against published checksums",
      "Files are hashed on-device — nothing is uploaded",
    ],
    useCases: [
      "Verifying a downloaded file matches its published SHA-256 checksum",
      "Generating hashes for data-integrity checks",
      "Comparing two files by digest instead of size",
      "Producing checksums for distributed files",
      "Hashing strings for development and debugging",
    ],
    faqs: [
      {
        question: "How do I verify a file's checksum?",
        answer:
          "Drop the file in, pick the algorithm the publisher used (usually SHA-256), and compare the generated hex digest to the published one — identical means the file arrived intact and unmodified.",
      },
      {
        question: "Which algorithm should I use?",
        answer:
          "SHA-256 is the standard default — it's what most checksums are published in. Use SHA-512 for extra margin, SHA-384 where specified, and SHA-1 only when matching an existing SHA-1 checksum (it's considered weak for security purposes).",
      },
      {
        question: "Can I hash a file without uploading it?",
        answer:
          "That's exactly what this does — the file is read and hashed on your device with WebCrypto. Nothing is sent to a server, so it's safe even for private files.",
      },
      {
        question: "Is hashing the same as encryption?",
        answer:
          "No. Hashing is one-way — you can't recover the input from a hash. It's for fingerprints and integrity checks, not for protecting data. Never hash passwords unsalted for storage; use a proper password-hashing algorithm like bcrypt or Argon2.",
      },
      {
        question: "Why is there no MD5 option?",
        answer:
          "MD5 is cryptographically broken — collisions are trivially produced — so it gives false confidence for verification. The SHA-2 family offered here is what modern checksums actually use.",
      },
    ],
  },

  // ── Developer ─────────────────────────────────────────────────────────────

  "json-formatter": {
    title: "JSON Formatter — Format, Validate, Minify & Explore JSON",
    description:
      "Format and validate JSON with 2 or 4-space indent, minify it, or explore it as a collapsible tree. Instant, private, in-browser JSON tools.",
    keywords: [
      "json formatter",
      "json validator",
      "format json online",
      "json beautifier",
      "json prettifier",
      "minify json",
      "json viewer",
      "json tree viewer",
      "validate json online",
      "json pretty print",
    ],
    about:
      "GenRise JSON Formatter takes pasted JSON and makes it useful: pretty-print it with your choice of indentation, validate it and surface parse errors, minify it down for production payloads, or explore the structure as a collapsible tree — handy when you're five levels deep in an API response. Everything runs locally in your browser, so API responses containing tokens, user data or internal fields stay on your machine instead of being pasted into someone else's server.",
    features: [
      "Pretty-print JSON with 2-space, 4-space or no indentation",
      "Validation with clear errors on malformed input",
      "One-click minification for production payloads",
      "Collapsible tree view for exploring nested structures",
      "Handles large, deeply nested API responses",
      "Fully client-side — safe for responses containing tokens or user data",
    ],
    useCases: [
      "Reading a minified API response as formatted JSON",
      "Validating a config file or payload before shipping",
      "Exploring a deeply nested response as a tree",
      "Minifying JSON for a request body or config",
      "Debugging malformed JSON with a real error message",
    ],
    faqs: [
      {
        question: "How do I format unreadable minified JSON?",
        answer:
          "Paste it in and format — it re-renders with clean indentation (2 or 4 spaces) so the structure is readable. Switch to the tree view for a collapsible, navigable version.",
      },
      {
        question: "How do I know if my JSON is valid?",
        answer:
          "Paste it — valid JSON formats cleanly; invalid input produces a parse error telling you it couldn't be read. Common culprits: trailing commas, single quotes, unquoted keys.",
      },
      {
        question: "What does minify do?",
        answer:
          "It strips all whitespace and line breaks, producing the smallest valid JSON — what you want for request payloads, embedded config, or anywhere bytes count.",
      },
      {
        question: "Is it safe to paste API responses containing tokens?",
        answer:
          "Here, yes — everything is processed locally in your browser and never transmitted. That's the real advantage over server-side formatters, which receive whatever you paste.",
      },
    ],
  },

  "base64-codec": {
    title: "Base64 Encoder / Decoder — Encode Text & Files Online",
    description:
      "Encode text or files to Base64 and decode Base64 back — instantly and privately in your browser. For data URIs, APIs and debugging. Free.",
    keywords: [
      "base64 encode",
      "base64 decode",
      "base64 encoder decoder",
      "base64 encode online",
      "decode base64 string",
      "file to base64",
      "image to base64",
      "base64 converter",
      "encode file base64",
      "base64 to text",
    ],
    about:
      "GenRise Base64 Encoder / Decoder converts in both directions: encode plain text or an entire file into a Base64 string, or decode Base64 back to readable text. It's the utility behind data URIs, Basic auth headers, email attachments and embedded assets — and unlike server-side encoders, whatever you encode stays on your device, which matters when the payload is a credential or a file you shouldn't transmit.",
    features: [
      "Encode text to Base64 and decode Base64 to text",
      "Encode whole files — useful for data URIs and embedded assets",
      "Instant conversion as you type",
      "Handles UTF-8 text correctly",
      "Runs entirely in your browser — sensitive strings stay private",
      "Free, unlimited, no sign-up",
    ],
    useCases: [
      "Encoding credentials for HTTP Basic auth headers",
      "Turning a small image or file into a data URI",
      "Decoding Base64 blobs from API responses and JWTs",
      "Embedding binary data in JSON or XML",
      "Debugging encoded strings during development",
    ],
    faqs: [
      {
        question: "How do I encode text to Base64?",
        answer:
          "Paste your text, hit encode — the Base64 output appears instantly, ready to copy. The same flow decodes Base64 back to text.",
      },
      {
        question: "Can I convert a file or image to Base64?",
        answer:
          "Yes — switch to file mode and drop the file in. The Base64 string can be embedded directly in HTML, CSS or JSON as a data URI.",
      },
      {
        question: "Is Base64 encoding encryption?",
        answer:
          "No — it's a reversible encoding, not encryption. Anyone can decode it. Never use Base64 alone to protect sensitive data; it only changes how bytes are represented.",
      },
      {
        question: "Why does Base64 make data bigger?",
        answer:
          "Base64 packs 3 bytes into 4 characters, so output is roughly 33% larger than the input. That's the cost of representing binary data as text-safe characters.",
      },
      {
        question: "Is my data uploaded to encode it?",
        answer:
          "No — encoding uses built-in browser APIs locally. Credentials and files you convert never leave your device.",
      },
    ],
  },

  "uuid-generator": {
    title: "UUID Generator — Bulk Random v4 UUIDs, Free & Instant",
    description:
      "Generate up to 100 random UUID v4 identifiers at once with cryptographic randomness — copy individually or all at once. Free, instant, offline.",
    keywords: [
      "uuid generator",
      "random uuid",
      "uuid v4 generator",
      "bulk uuid generator",
      "generate uuid online",
      "guid generator",
      "uuid generator free",
      "unique id generator",
      "random uuid v4",
      "uuid generator bulk",
    ],
    about:
      "GenRise UUID Generator produces random version-4 UUIDs using the browser's cryptographic RNG via crypto.randomUUID() — the same API your backend would call. Generate one or a batch of up to 100 at once, copy any single UUID or the whole list with one click. Because generation is local, it's instant, works offline, and produces IDs that were never visible to any server.",
    features: [
      "Cryptographically random UUID v4 via crypto.randomUUID()",
      "Generate up to 100 UUIDs in one click",
      "Copy a single UUID or the entire list at once",
      "Standard 36-character format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
      "Instant, offline-capable generation",
      "Free with no sign-up or rate limits",
    ],
    useCases: [
      "Generating primary keys for database seeding",
      "Creating unique IDs for objects, sessions or filenames",
      "Producing test data for development and QA",
      "Naming uploads or resources with collision-safe IDs",
      "Bulk-generating identifiers for fixtures and mocks",
    ],
    faqs: [
      {
        question: "What's the difference between UUID v4 and other versions?",
        answer:
          "v4 UUIDs are purely random — 122 bits of randomness — which is what nearly every application needs. Other versions derive from timestamps (v1, v7) or name hashing (v3, v5). This generator produces v4, the safe general-purpose choice.",
      },
      {
        question: "Are the UUIDs truly unique?",
        answer:
          "Effectively, yes — a v4 UUID has about 5.3×10³⁶ possible values, and they're generated with the browser's cryptographic RNG. The odds of a collision are astronomically low; that's the whole point of the format.",
      },
      {
        question: "Can I generate UUIDs in bulk?",
        answer:
          "Yes — set the count up to 100 and generate; the whole list appears and copies to your clipboard in one click.",
      },
      {
        question: "Is a UUID the same as a GUID?",
        answer:
          "Functionally yes — GUID is Microsoft's name for the same 128-bit identifier format. A UUID from this generator works anywhere a GUID is expected.",
      },
    ],
  },

  "url-encoder": {
    title: "URL Encoder / Decoder — Percent-Encode URLs & Query Strings",
    description:
      "Encode URLs and query-string values with percent-encoding, or decode them back — instant, free, and runs entirely in your browser.",
    keywords: [
      "url encoder",
      "url decoder",
      "percent encode",
      "url encode online",
      "decode url encoded string",
      "encodeURIComponent online",
      "query string encoder",
      "url escape characters",
      "url decode online",
      "encode url parameters",
    ],
    about:
      "GenRise URL Encoder / Decoder converts text to percent-encoded form (the %20-style escaping URLs require) and decodes encoded strings back to readable text. It's the tool for building query strings, safely embedding values in URLs, and decoding the opaque parameter soup in a copied link. Encoding runs on your device — relevant when the URL contains tokens or parameters you'd rather not hand to a server.",
    features: [
      "Percent-encode text for safe use in URLs and query strings",
      "Decode percent-encoded URLs back to readable text",
      "Instant conversion as you type",
      "Handles special characters, spaces, Unicode and reserved symbols",
      "Local processing — URLs with tokens stay private",
      "Free, unlimited, no sign-up",
    ],
    useCases: [
      "Encoding parameter values for query strings and redirects",
      "Decoding a copied URL to read its real parameters",
      "Escaping special characters in a path or search query",
      "Building share links with encoded text or UTM params",
      "Debugging encoded callbacks and OAuth redirect URLs",
    ],
    faqs: [
      {
        question: "What is URL encoding (percent-encoding)?",
        answer:
          "It replaces characters that are unsafe or reserved in URLs with % followed by their hex byte value — a space becomes %20, & becomes %26. It lets arbitrary text ride inside a URL without breaking its structure.",
      },
      {
        question: "How do I decode a URL full of %20 and %3D?",
        answer:
          "Paste the encoded URL or parameter string into the decoder — it converts every %XX sequence back to the original character, giving you readable text.",
      },
      {
        question: "When do I need to encode a URL parameter?",
        answer:
          "Whenever a value contains characters with meaning in URLs — &, =, ?, spaces, # — or non-ASCII text. Encoding the value prevents it from corrupting the query string's structure.",
      },
      {
        question: "Is my URL sent anywhere when I encode it?",
        answer:
          "No — encode/decode is done by built-in browser functions locally. URLs containing tokens or session parameters never leave your device.",
      },
    ],
  },

  "regex-tester": {
    title: "Regex Tester — Test Regular Expressions with Live Highlighting",
    description:
      "Test regex patterns against sample text with live match highlighting, flags support and capture-group display. Free, instant, JavaScript engine.",
    keywords: [
      "regex tester",
      "regex tester online",
      "test regular expression",
      "regex match tester",
      "javascript regex tester",
      "regex validator",
      "regexp tester",
      "regex capture groups",
      "regex live preview",
      "regular expression tester free",
    ],
    about:
      "GenRise Regex Tester evaluates your regular expression against sample text as you type — matches highlight live in the text, and every match lists its position and capture groups so you can verify the pattern is grabbing exactly what you intend. Set JavaScript-style flags (g, i, m, s, u…), see the match count, and get a clear error for invalid syntax. It uses the real JavaScript RegExp engine — what matches here is what matches in your code.",
    features: [
      "Live match highlighting inside your test text",
      "JavaScript flags field — g, i, m, s, u and more",
      "Capture groups listed for every match",
      "Match count and match positions",
      "Clear errors on invalid patterns",
      "Real JS RegExp engine — results match production code",
    ],
    useCases: [
      "Building and debugging a regex before shipping it",
      "Verifying capture groups extract the right values",
      "Testing patterns against realistic sample data",
      "Checking flag behaviour (global, case-insensitive, multiline)",
      "Learning regex interactively with instant feedback",
    ],
    faqs: [
      {
        question: "Which regex flavour does this use?",
        answer:
          "JavaScript's native RegExp engine — so results match what you'd get in a browser or Node.js. Patterns for PCRE (PHP) or other engines may behave differently on edge-case syntax.",
      },
      {
        question: "How do I test capture groups?",
        answer:
          "Add groups with parentheses in your pattern — each match in the results lists its captured groups alongside the full match and its position in the text.",
      },
      {
        question: "What flags can I use?",
        answer:
          "Any JavaScript flags — g (all matches), i (case-insensitive), m (multiline anchors), s (dot matches newlines), u (Unicode), y (sticky). The tester applies g automatically so every match is shown.",
      },
      {
        question: "Why does my pattern error here but not in Python?",
        answer:
          "Regex flavours differ — features like lookbehind, named groups or \\z exist in some engines and not others, or use different syntax. This tester reflects the JavaScript engine exactly.",
      },
    ],
  },

  "jwt-decoder": {
    title: "JWT Decoder — Decode JSON Web Tokens Locally & Safely",
    description:
      "Decode a JWT's header and payload instantly — with live expiry status for exp/iat claims. Runs 100% in your browser; tokens are never sent anywhere.",
    keywords: [
      "jwt decoder",
      "decode jwt",
      "jwt decoder online",
      "json web token decoder",
      "jwt payload viewer",
      "decode jwt token",
      "jwt expiry checker",
      "inspect jwt",
      "jwt debugger",
      "decode jwt without sending",
    ],
    about:
      "GenRise JWT Decoder splits a JSON Web Token into its header and payload and presents the claims readably — with live status for exp and iat so you can see at a glance whether the token is expired and when it was issued. The important difference from pasting tokens into hosted debuggers: decoding happens entirely in your browser, so the credential never transits a third party. It deliberately decodes only — signature verification isn't attempted, since that requires the signing key.",
    features: [
      "Decodes JWT header and payload into readable JSON",
      "Live expiry status for exp claims and issue time for iat",
      "Instant decode as you paste — no submit needed",
      "100% local — the token never leaves your browser",
      "Handles standard base64url JWT segments",
      "Free, no sign-up, no token logging",
    ],
    useCases: [
      "Inspecting claims in a token during API development",
      "Checking whether a token is expired and when it was issued",
      "Debugging auth flows — audience, issuer, scopes, subject",
      "Reading a token's payload before trusting what it asserts",
      "Safely decoding tokens without leaking them to a hosted tool",
    ],
    faqs: [
      {
        question: "Is it safe to paste a JWT into this decoder?",
        answer:
          "Here, yes — decoding is pure local base64url + JSON parsing; the token is never transmitted. As a habit though, treat JWTs as credentials: prefer offline tools and never paste production tokens into sites you don't control.",
      },
      {
        question: "Does this verify the token's signature?",
        answer:
          "No — and that's important to understand. Decoding reads the payload; it doesn't prove the token is authentic. Verification needs the signing key or public key, which happens server-side in a real system.",
      },
      {
        question: "What do exp and iat mean?",
        answer:
          "exp is the expiry timestamp — the decoder shows live whether the token is expired. iat is the issued-at time. Both are Unix timestamps in the payload.",
      },
      {
        question: "Why won't my token decode?",
        answer:
          "A JWT has three base64url segments separated by dots — header.payload.signature. If decoding fails, the string is truncated, has whitespace inside it, or isn't actually a JWT (e.g. an opaque token, which can't be decoded by design).",
      },
      {
        question: "Can I decode encrypted (JWE) tokens?",
        answer:
          "No — this decodes signed (JWS) tokens whose payload is base64url JSON. JWE tokens are encrypted and require the decryption key.",
      },
    ],
  },

  "markdown-previewer": {
    title: "Markdown Previewer — Live Markdown to HTML Preview",
    description:
      "Write Markdown and see the rendered HTML preview live as you type — headings, lists, code, links and more. Free, private, browser-based.",
    keywords: [
      "markdown previewer",
      "markdown preview online",
      "markdown editor live preview",
      "markdown to html",
      "markdown renderer",
      "live markdown editor",
      "preview markdown online",
      "md preview",
      "github markdown preview",
      "markdown writing tool",
    ],
    about:
      "GenRise Markdown Previewer renders your Markdown into a live HTML preview as you type — headings, emphasis, lists, links, images, code blocks and the rest of the standard syntax — so you can see exactly how a README, doc or post will look before you commit it. Rendering happens in the page itself: nothing you write is sent to a server, which makes it a safe scratchpad for drafts, internal docs and anything unpublished.",
    features: [
      "Live rendered preview that updates as you type",
      "Full standard Markdown syntax — headings, lists, links, code, quotes, tables",
      "Clean rendered styling for readability",
      "Safe local rendering — drafts never leave your browser",
      "No editor lock-in — write here, paste anywhere",
      "Free with no sign-up",
    ],
    useCases: [
      "Previewing a README before pushing to GitHub",
      "Drafting documentation and seeing it rendered live",
      "Checking Markdown syntax before posting to a forum or CMS",
      "Learning Markdown with instant visual feedback",
      "Composing formatted content without a heavyweight editor",
    ],
    faqs: [
      {
        question: "Which Markdown syntax is supported?",
        answer:
          "The standard set — headings, bold/italic, links, images, lists, blockquotes, code spans and fenced code blocks — rendered live as you type.",
      },
      {
        question: "Does the preview match GitHub's rendering?",
        answer:
          "It renders standard Markdown the same way for the common cases. GitHub adds extensions (task lists, mentions, alerts) that are platform-specific — this preview covers the portable core syntax that works everywhere.",
      },
      {
        question: "Can I write here and export the HTML?",
        answer:
          "The preview shows the rendered output for checking your work — write your Markdown here, verify it looks right, then paste the source into wherever it's headed.",
      },
      {
        question: "Is what I write uploaded anywhere?",
        answer:
          "No — parsing and rendering run in your browser. Drafts, docs and anything you paste stay entirely on your device.",
      },
    ],
  },

  "text-diff-checker": {
    title: "Text Diff Checker — Compare Two Texts & Highlight Changes",
    description:
      "Compare two blocks of text side by side and see exactly what changed — added, removed and modified lines highlighted. Free, instant, private.",
    keywords: [
      "diff checker",
      "text compare online",
      "compare two texts",
      "text diff tool",
      "find difference between texts",
      "compare text files online",
      "text comparison tool",
      "diff online free",
      "code diff checker",
      "document compare",
    ],
    about:
      "GenRise Text Diff Checker compares two blocks of text and highlights exactly what changed — added lines, removed lines and edits — so you can spot the difference without reading every word. Paste the original and revised versions side by side and the diff is computed instantly. It's useful for comparing code snippets, contract revisions, essay drafts, config files or any two versions of text — and it runs locally, so confidential documents stay on your machine.",
    features: [
      "Side-by-side comparison of two text blocks",
      "Added, removed and changed content highlighted",
      "Instant diff as you paste — no submit step",
      "Works for prose, code, lists and config files",
      "Local processing — confidential text never uploaded",
      "Free with no sign-up",
    ],
    useCases: [
      "Comparing two versions of a contract or document",
      "Spotting what changed between code snippets",
      "Diffing config files before and after an edit",
      "Checking revisions in an essay or article draft",
      "Verifying what a paste or export actually changed",
    ],
    faqs: [
      {
        question: "How do I compare two pieces of text?",
        answer:
          "Paste the original on one side and the revised version on the other — the diff highlights what's added, removed and changed automatically.",
      },
      {
        question: "Can I compare code with this?",
        answer:
          "Yes — it diffs any plain text, code included. Paste two versions of a snippet or config and changed lines are highlighted.",
      },
      {
        question: "What kinds of changes does it detect?",
        answer:
          "Line-level changes: lines added, lines removed, and lines that were modified. It's the same model as a Git-style line diff.",
      },
      {
        question: "Is the text I compare uploaded?",
        answer:
          "No — the comparison runs in your browser. Both texts stay on your device, which matters for contracts, code and other sensitive content.",
      },
    ],
  },

  "cron-explainer": {
    title: "Cron Expression Explainer — Cron to Plain English + Run Times",
    description:
      "Translate any 5-field cron expression into plain English and preview the next 5 scheduled run times. Free, instant, works in your browser.",
    keywords: [
      "cron expression explainer",
      "cron translator",
      "cron to english",
      "cron schedule calculator",
      "crontab explainer",
      "what does this cron mean",
      "cron expression parser",
      "cron next run times",
      "crontab schedule checker",
      "cron expression generator helper",
    ],
    about:
      "GenRise Cron Expression Explainer decodes 5-field cron syntax — minute hour day-of-month month day-of-week — into a plain-English description, then lists the next five actual run times so you can confirm the schedule does what you think it does. It's the fast sanity check before you commit a crontab entry, debug why a job didn't fire, or figure out what a schedule in a legacy system actually means. Parsing runs in-page: expressions like */15 9-17 * * 1-5 turn into \"every 15 minutes, 9am–5pm, Monday–Friday\" instantly.",
    features: [
      "Translates standard 5-field cron to plain English",
      "Shows the next 5 scheduled run times with real dates",
      "Supports ranges, steps, lists and wildcards",
      "Instant explanation as you type",
      "Clear error for expressions that don't parse",
      "Runs locally — no server round-trip",
    ],
    useCases: [
      "Verifying a crontab entry schedules what you intend",
      "Decoding a cron expression in inherited infrastructure",
      "Finding out why a scheduled job fires at unexpected times",
      "Checking the next run times before deploying a schedule",
      "Learning cron syntax with immediate plain-English feedback",
    ],
    faqs: [
      {
        question: "What do the five fields in a cron expression mean?",
        answer:
          "Left to right: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6, Sunday = 0). * means \"every\". So 30 9 * * 1-5 runs at 9:30, Monday through Friday.",
      },
      {
        question: "How do I check when a cron job will next run?",
        answer:
          "Paste the expression — the explainer lists the next five concrete run times, so you see the actual dates and times rather than guessing.",
      },
      {
        question: "Does it support steps like */15 and ranges like 9-17?",
        answer:
          "Yes — wildcards (*), steps (*/15, 0-30/10), ranges (9-17), lists (1,15) and combinations are all parsed and explained.",
      },
      {
        question: "Is this standard Unix cron syntax?",
        answer:
          "Yes — the classic 5-field format used by crontab, GitHub Actions-style schedules with the same layout, and most schedulers. Extended syntax with seconds or years fields (Quartz-style) isn't covered.",
      },
      {
        question: "What timezone are the run times in?",
        answer:
          "The next-run preview uses your device's local timezone. Real cron jobs run in the server's configured timezone — often UTC — so bear that in mind when comparing.",
      },
    ],
  },

  // ── Calculators ───────────────────────────────────────────────────────────

  "percentage-calculator": {
    title: "Percentage Calculator — Percent Of, Change & Ratio",
    description:
      "Calculate X% of Y, what percent X is of Y, and percentage increase or decrease — three tools in one. Instant results, free, no sign-up.",
    keywords: [
      "percentage calculator",
      "percent calculator",
      "percentage increase calculator",
      "percentage decrease calculator",
      "what percent of",
      "calculate percentage online",
      "percent of a number",
      "percentage change calculator",
      "percentage formula calculator",
      "discount percentage calculator",
    ],
    about:
      "GenRise Percentage Calculator covers the three calculations people actually search for: what is X% of Y, X is what percent of Y, and the percentage increase or decrease between two values. Each gets its own clean panel — type the numbers and the answer appears instantly. It's the quick answer for discounts, tips, markups, growth rates, grades and anything else expressed in percent — running entirely in your browser.",
    features: [
      "X% of Y — find a percentage of any number",
      "X is what % of Y — express one number as a percent of another",
      "Percentage increase or decrease between two values",
      "Instant results as you type — no submit button",
      "Handles decimals and large numbers",
      "Free, private, works on any device",
    ],
    useCases: [
      "Working out discounts and sale prices while shopping",
      "Calculating tips, tax and markups",
      "Finding percentage growth or decline in metrics",
      "Computing grade percentages and score ratios",
      "Answering \"what percent is this of that\" instantly",
    ],
    faqs: [
      {
        question: "How do I calculate what is X% of Y?",
        answer:
          "Use the first panel: enter the percentage in X and the number in Y — e.g. 15% of 80 = 12. The result appears as you type.",
      },
      {
        question: "How do I find what percent one number is of another?",
        answer:
          "Use the \"X is what % of Y\" panel — e.g. 45 out of 60 is 75%. Useful for test scores, progress tracking and ratios.",
      },
      {
        question: "How is percentage change calculated?",
        answer:
          "The increase/decrease panel computes (new − old) ÷ old × 100. A positive result is growth, negative is a decline — shown with a + or − sign.",
      },
      {
        question: "How do I calculate a discount quickly?",
        answer:
          "For a 30% discount on an 80 item: use \"X% of Y\" to find 30% of 80 = 24, then subtract — final price 56. Or mentally compute 70% of the price directly.",
      },
    ],
  },

  "age-calculator": {
    title: "Age Calculator — Exact Age in Years, Months & Days",
    description:
      "Calculate your exact age in years, months and days — plus total days lived — from a birth date, as of today or any date. Free and instant.",
    keywords: [
      "age calculator",
      "calculate my age",
      "age calculator from date of birth",
      "how old am i",
      "exact age calculator",
      "age in days calculator",
      "date of birth calculator",
      "age calculator online",
      "chronological age calculator",
      "age in years months days",
    ],
    about:
      "GenRise Age Calculator turns a birth date into an exact age — years, months and days — plus your total days lived. Set the \"as of\" date to any day, not just today, to answer questions like \"how old will I be on this date\" or \"how old was I when this happened\". The arithmetic handles varying month lengths and leap years correctly, so the answer is exact — not an approximation. Calculation runs in your browser with nothing stored.",
    features: [
      "Exact age in years, months and days",
      "Total days lived as a bonus figure",
      "As-of date is adjustable — compute age on any date, past or future",
      "Correct handling of month lengths and leap years",
      "Instant result as you pick the dates",
      "Private — birth dates never leave your device",
    ],
    useCases: [
      "Finding your exact age for a form or application",
      "Calculating age on a specific past or future date",
      "Checking age eligibility cutoffs for exams and programs",
      "Fun stats like total days alive",
      "Verifying someone's age from a stated birth date",
    ],
    faqs: [
      {
        question: "How do I calculate my exact age?",
        answer:
          "Enter your date of birth — your age shows instantly as years, months and days, plus the total number of days you've lived.",
      },
      {
        question: "Can I calculate age on a date other than today?",
        answer:
          "Yes — change the \"as of\" date to any past or future date. Useful for eligibility cutoffs (\"age as of 1st January\") or historical questions.",
      },
      {
        question: "Does it handle leap years correctly?",
        answer:
          "Yes — the calculation counts real calendar days, so February 29th and varying month lengths are handled exactly.",
      },
      {
        question: "Why does the month/day count sometimes surprise people?",
        answer:
          "Months have different lengths, so \"1 month\" isn't a fixed number of days — the calculator borrows the right number of days from the previous month, matching how age is conventionally stated.",
      },
    ],
  },

  "unit-converter": {
    title: "Unit Converter — Length, Weight, Temperature, Data & More",
    description:
      "Convert between units of length, weight, temperature, area, volume, speed, data and time — instantly in your browser. Free, accurate, no sign-up.",
    keywords: [
      "unit converter",
      "length converter",
      "weight converter",
      "temperature converter",
      "cm to inches",
      "kg to lbs",
      "celsius to fahrenheit",
      "km to miles",
      "data size converter",
      "volume converter",
      "unit conversion online free",
    ],
    about:
      "GenRise Unit Converter handles the eight conversions people need daily: length, weight, temperature, area, volume, speed, data and time. Pick a category, choose the from and to units, type a value — the result is instant. Whether you're converting cm to inches, kg to lb, Celsius to Fahrenheit or MB to GB, the math runs locally and works offline once loaded — handy when the thing you're converting is literally how much data you have left.",
    features: [
      "Eight categories: length, weight, temperature, area, volume, speed, data, time",
      "Metric and imperial units in both directions",
      "Instant conversion as you type",
      "Accurate temperature conversion (not a simple multiplier)",
      "Works offline once loaded",
      "Free with no sign-up",
    ],
    useCases: [
      "Converting measurements while cooking or shopping abroad",
      "Switching between metric and imperial for travel",
      "Temperature conversions for weather and recipes",
      "Data size conversions (MB ↔ GB) for storage and plans",
      "Homework and DIY measurement conversions",
    ],
    faqs: [
      {
        question: "Which unit categories are supported?",
        answer:
          "Eight: length, weight, temperature, area, volume, speed, data and time — covering the conversions people need day to day.",
      },
      {
        question: "How do I convert Celsius to Fahrenheit?",
        answer:
          "Choose the temperature category, set Celsius to Fahrenheit, and type the value — e.g. 25°C converts to 77°F. Temperature uses the proper offset formula, not a simple ratio.",
      },
      {
        question: "Does it convert both ways?",
        answer:
          "Yes — pick any pair of units in either direction within a category: miles to km, km to miles, kg to lb, lb to kg, and so on.",
      },
      {
        question: "Does it work offline?",
        answer:
          "Once the page has loaded, yes — conversion is pure local math, no lookup calls. Useful when you're converting units precisely because connectivity is limited.",
      },
    ],
  },

  "bmi-calculator": {
    title: "BMI Calculator — Body Mass Index in Metric or Imperial",
    description:
      "Calculate your BMI from height and weight in cm/kg or ft/in/lb — with the WHO weight category. Instant, private, free.",
    keywords: [
      "bmi calculator",
      "body mass index calculator",
      "bmi calculator kg cm",
      "bmi calculator ft lbs",
      "calculate my bmi",
      "bmi chart",
      "am i healthy weight",
      "bmi calculator online",
      "body mass index formula",
      "bmi for men women",
    ],
    about:
      "GenRise BMI Calculator computes your Body Mass Index from height and weight — in metric (cm, kg) or imperial (ft/in, lb) units, whichever you know — and shows the WHO category: underweight, normal weight, overweight or obese. The conversion between unit systems is handled internally, so there's no need to convert anything first. The number is computed on your device — health data is exactly the kind of thing that shouldn't be logged by a server.",
    features: [
      "Metric (cm/kg) and imperial (ft/in/lb) input",
      "Instant BMI with one decimal precision",
      "WHO weight category shown alongside the number",
      "No unit conversion needed — mixed input handled",
      "Runs locally — your health data stays private",
      "Free, no account, works on any device",
    ],
    useCases: [
      "Checking your BMI for a health screening or form",
      "Tracking BMI alongside a fitness or weight goal",
      "Quick check when a study or program asks for BMI",
      "Converting between measurement systems seamlessly",
      "A private way to compute BMI without apps that log it",
    ],
    faqs: [
      {
        question: "How is BMI calculated?",
        answer:
          "Weight in kilograms divided by height in metres squared (kg/m²). If you enter feet/inches and pounds, the tool converts to metric first — same formula, same result.",
      },
      {
        question: "What do the BMI categories mean?",
        answer:
          "WHO ranges: under 18.5 is underweight, 18.5–24.9 normal weight, 25–29.9 overweight, 30 and above obese. These are population-level screening bands, not a personal diagnosis.",
      },
      {
        question: "Is BMI accurate for everyone?",
        answer:
          "BMI doesn't distinguish muscle from fat or account for frame size — muscular people can read \"overweight\" while being lean. Use it as a screening number, and consult a professional for a real assessment.",
      },
      {
        question: "Is my height and weight data stored?",
        answer:
          "No — the calculation happens entirely in your browser. Nothing is sent or saved, which is how a health-adjacent tool should behave.",
      },
    ],
  },

  "date-difference": {
    title: "Date Difference Calculator — Days, Weeks & Months Between Dates",
    description:
      "Calculate the exact time between two dates — in years, months and days, plus total days and weeks. Free, instant, and private.",
    keywords: [
      "date difference calculator",
      "days between dates",
      "days between two dates",
      "how many days between",
      "date calculator",
      "number of days between dates",
      "weeks between dates",
      "date duration calculator",
      "days until calculator",
      "calculate days between two dates",
    ],
    about:
      "GenRise Date Difference Calculator answers \"how long between these two dates\" precisely — expressed as years, months and days, plus the total in days and weeks. Order doesn't matter; it handles either direction. Whether you're counting down to a deadline, measuring a project's duration, figuring out how old something is, or checking a notice period, the result is exact — real calendar months and leap years included, not a 30-days-per-month approximation.",
    features: [
      "Exact difference in years, months and days",
      "Total days and total weeks shown too",
      "Works in either direction — past or future dates",
      "Accurate across month lengths and leap years",
      "Instant result as you pick dates",
      "Runs entirely in your browser",
    ],
    useCases: [
      "Counting days until a deadline, event or trip",
      "Measuring exact durations for contracts and notice periods",
      "Finding how many days between two historical dates",
      "Calculating a project or subscription duration",
      "Answering \"how many days since\" questions exactly",
    ],
    faqs: [
      {
        question: "How do I find the number of days between two dates?",
        answer:
          "Pick the start and end dates — the calculator shows the difference as years/months/days plus the total day and week counts.",
      },
      {
        question: "Does it matter which date I enter first?",
        answer:
          "No — the tool figures out which is earlier and reports the absolute difference between them.",
      },
      {
        question: "Does it count calendar months or 30-day months?",
        answer:
          "Real calendar months — so the year/month/day figure is the exact elapsed calendar time, not an approximation. The total-days figure is exact regardless.",
      },
      {
        question: "Can I use it to count down to a future date?",
        answer:
          "Yes — set the start as today and the end as the future date to see exactly how many days, weeks and months remain.",
      },
    ],
  },

  // ── Fun ───────────────────────────────────────────────────────────────────

  "ascii-art-generator": {
    title: "ASCII Art Generator — Turn Any Image into Text Art",
    description:
      "Convert any image into ASCII art with adjustable width, character set and contrast — four character ramps from minimal to detailed. Free and instant.",
    keywords: [
      "ascii art generator",
      "image to ascii",
      "photo to ascii art",
      "text art generator",
      "picture to text",
      "ascii art maker",
      "image to text art",
      "ascii converter",
      "turn photo into ascii",
      "ascii art from image online",
    ],
    about:
      "GenRise ASCII Art Generator converts any image into text-art you can paste into terminals, READMEs, comments and chat — the picture rebuilt from characters where darker pixels become denser glyphs. Choose from four character ramps (Minimal, Standard, Detailed, Blocks), and tune the output width, character set and contrast until the likeness lands. Conversion is pure local canvas work — the image never leaves your device — then copy or download the art as text.",
    features: [
      "Converts any image into character-based ASCII art",
      "Four character ramps: Minimal, Standard, Detailed, Blocks",
      "Adjustable output width, character set and contrast",
      "Real-time regeneration as you tune settings",
      "Copy or download the result as text",
      "Runs entirely in your browser — no upload",
    ],
    useCases: [
      "Making ASCII portraits and logos for terminals and READMEs",
      "Retro-styled text art for forums, chats and comments",
      "Code comments and CLI splash art",
      "Converting a photo into a copy-pasteable text version",
      "Creative typography experiments from real images",
    ],
    faqs: [
      {
        question: "How does an image become ASCII art?",
        answer:
          "The image is sampled in a grid; each cell's brightness maps to a character — dark areas get dense glyphs like @ or #, light areas get dots or spaces. The ramp you pick decides the character palette.",
      },
      {
        question: "Which settings give the best result?",
        answer:
          "Start with the Standard ramp at a moderate width and raise the contrast if the image looks washed out. High-contrast source photos with a clear subject translate best; busy low-contrast images turn muddy.",
      },
      {
        question: "What are the character ramps for?",
        answer:
          "Minimal uses few characters for a stark look, Detailed uses many for finer shading, Blocks uses block glyphs for a chunky retro feel, and Standard is the balanced default.",
      },
      {
        question: "Can I use the result in code or a README?",
        answer:
          "Yes — the output is plain text. Paste it into a code block, comment or terminal and it'll render monospaced exactly as generated.",
      },
    ],
  },

  "meme-generator": {
    title: "Meme Generator — Add Captions to Any Image Free",
    description:
      "Make a meme from any image — top and bottom captions, classic fonts, colours and outline controls, JPG or PNG download. No watermark, no sign-up.",
    keywords: [
      "meme generator",
      "meme maker",
      "make a meme online",
      "add text to image meme",
      "meme creator free",
      "custom meme generator",
      "top bottom text meme",
      "meme generator no watermark",
      "impact font meme maker",
      "caption image generator",
    ],
    about:
      "GenRise Meme Generator does the classic format: your image, bold top and bottom captions, live preview updating as you type. Pick from four fonts including Impact for the traditional look, scale the text, set the fill and outline colours, and toggle all-caps — then download as JPG or PNG. There's no watermark, no account, and no upload: the meme is drawn on a local canvas, so your template images stay on your device.",
    features: [
      "Top and bottom captions with live preview as you type",
      "Classic meme fonts: Impact, Arial Black, Georgia, Comic Sans",
      "Adjustable text size, fill colour and outline colour",
      "All-caps toggle for the authentic meme look",
      "Download as JPG or PNG",
      "No watermark, no upload, no account",
    ],
    useCases: [
      "Making classic top/bottom caption memes from your own photos",
      "Quick reaction images for chats and social posts",
      "Custom memes without a watermark",
      "Inside-joke images for teams and group chats",
      "Captioning screenshots and photos instantly",
    ],
    faqs: [
      {
        question: "How do I make a meme with my own picture?",
        answer:
          "Drop in any image, type the top and bottom text, and watch the meme render live. Tune the font, size and colours, then download as JPG or PNG.",
      },
      {
        question: "Is there a watermark on the meme?",
        answer:
          "No — the downloaded image is clean. No watermark, no logo, no account required.",
      },
      {
        question: "Can I use the classic Impact font?",
        answer:
          "Yes — Impact is one of four fonts, alongside Arial Black, Georgia and Comic Sans, with adjustable size and stroke for that bold outlined look.",
      },
      {
        question: "Are my images uploaded?",
        answer:
          "No — the caption is drawn onto your image on a local canvas. Nothing is transmitted, and the meme downloads straight from your browser.",
      },
    ],
  },

  "random-picker-wheel": {
    title: "Random Picker Wheel — Spin to Pick a Random Option",
    description:
      "Spin a colourful wheel to randomly pick from your list — names, prizes, choices. Optional winner-removal mode for draws. Free, fair, instant.",
    keywords: [
      "random picker wheel",
      "spin the wheel",
      "wheel of names",
      "random name picker",
      "spinning wheel picker",
      "random choice generator",
      "prize wheel online",
      "pick random winner",
      "decision wheel",
      "raffle wheel online",
    ],
    about:
      "GenRise Random Picker Wheel turns a list of options — one per line — into a colourful spinning wheel that picks a winner with cryptographically fair randomness. Paste names, prizes, chores or choices, hit spin, and watch the wheel land. Turn on winner-removal mode to run an elimination-style draw where each picked option leaves the wheel — perfect for giveaways and classroom picks. No sign-up, and the outcome is decided by a real RNG, not a predictable shuffle.",
    features: [
      "Custom options — one per line, as many as you like",
      "Colourful animated wheel with a satisfying ~4-second spin",
      "Cryptographically fair random selection",
      "Winner-removal mode for elimination draws",
      "Instant result announced after each spin",
      "Free, private, works on any screen",
    ],
    useCases: [
      "Picking a giveaway or raffle winner fairly",
      "Choosing who goes first, or who does which chore",
      "Classroom student picks and quiz questions",
      "Deciding where to eat or what to watch",
      "Team standup order and icebreaker picks",
    ],
    faqs: [
      {
        question: "How do I add names to the wheel?",
        answer:
          "Type or paste them into the options box — one per line — and the wheel redraws instantly with a coloured slice per option.",
      },
      {
        question: "Is the pick actually random and fair?",
        answer:
          "Yes — the winner is chosen with crypto.getRandomValues, the browser's cryptographic RNG. Every option has an equal chance; the spin animation just dramatizes the result.",
      },
      {
        question: "Can I remove winners so they can't be picked twice?",
        answer:
          "Yes — enable winner removal and each picked option is removed from the wheel, so you can run an ordered draw or pick several unique winners.",
      },
      {
        question: "How many options can the wheel hold?",
        answer:
          "As many as you can list — each gets a slice. Practically, a few dozen stays readable; hundreds still work but the slices get thin.",
      },
    ],
  },

  "dice-roller": {
    title: "Dice Roller & Coin Flip — d4 to d20 with True Randomness",
    description:
      "Roll virtual dice — d4, d6, d8, d10, d12, d20 — up to 20 at once, or flip a coin. Cryptographically fair results. Free and instant.",
    keywords: [
      "dice roller",
      "roll dice online",
      "d20 roller",
      "virtual dice",
      "coin flip online",
      "flip a coin",
      "dnd dice roller",
      "random dice roll",
      "roll a die",
      "heads or tails",
    ],
    about:
      "GenRise Dice Roller rolls virtual dice — d4, d6, d8, d10, d12 and d20, up to twenty at a time — and flips coins, using crypto.getRandomValues for genuinely fair results rather than predictable pseudo-randomness. Every roll shows all the dice and their total. It's the pocket dice set for board games, tabletop RPGs, classroom probability and any decision you want to leave to fate — no app, no sign-up, no rigged outcomes.",
    features: [
      "Six dice types: d4, d6, d8, d10, d12 and d20",
      "Roll up to 20 dice at once with a total shown",
      "Coin flip for heads-or-tails decisions",
      "Cryptographically fair randomness (crypto.getRandomValues)",
      "Instant results, unlimited rolls",
      "Free, no ads, works offline once loaded",
    ],
    useCases: [
      "Tabletop RPG and board game rolls without physical dice",
      "Coin flips for decisions and kickoffs",
      "Classroom probability and statistics demos",
      "Settling disputes and making arbitrary choices",
      "Rolling multiple dice for damage, stats or pools",
    ],
    faqs: [
      {
        question: "Are the rolls truly random?",
        answer:
          "Yes — results come from crypto.getRandomValues, the browser's cryptographic RNG, so every face has an exactly equal chance. It's fairer than most physical dice.",
      },
      {
        question: "Which dice can I roll?",
        answer:
          "d4, d6, d8, d10, d12 and d20 — the standard tabletop set. Pick the type, choose how many (up to 20), and roll.",
      },
      {
        question: "Does it add up the total?",
        answer:
          "Yes — every roll shows each die's result plus the combined total, so multi-dice rolls are ready to use.",
      },
      {
        question: "Can I flip a coin too?",
        answer:
          "Yes — there's a dedicated coin flip for heads-or-tails, using the same fair RNG.",
      },
    ],
  },

  "hacker-terminal": {
    title: "Fake Hacker Terminal — Animated Terminal Typing Effect",
    description:
      "Play any text back as an animated hacker-style terminal — the movie-style typing effect for pranks, videos and fun. Free, no sign-up.",
    keywords: [
      "hacker terminal",
      "fake hacking screen",
      "hacker typer",
      "terminal typing effect",
      "fake hacker screen online",
      "hacker prank",
      "movie hacking simulator",
      "green terminal text",
      "pretend to hack",
      "hacker screen simulator",
    ],
    about:
      "GenRise Fake Hacker Terminal plays back any text you paste as a rapid, movie-style terminal typing animation — the green-on-black cascade that reads as \"hacking\" on screen. Use it for pranks, video backgrounds, livestream filler, or just the satisfaction of watching code stream past. Paste your own text or script, hit play, and the terminal does the Hollywood part. Everything runs locally — nothing you type is sent anywhere.",
    features: [
      "Animated terminal typing playback of any pasted text",
      "Classic hacker-movie aesthetic — green text on dark terminal",
      "Custom text: use your own code, logs or script",
      "Instant playback, fullscreen-friendly",
      "Harmless — it's a visual effect, not a real terminal",
      "Free with no sign-up",
    ],
    useCases: [
      "Harmless pranks — look busy \"hacking\" on screen",
      "Background visuals for videos, streams and skits",
      "Party and presentation effects",
      "Filler content for a second monitor",
      "Fun demos of what movie hacking looks like",
    ],
    faqs: [
      {
        question: "Is this actually hacking anything?",
        answer:
          "No — it's purely a visual typing animation, like the hacker-typer genre of sites. No commands run, nothing is accessed; it just looks dramatic.",
      },
      {
        question: "Can I use my own text?",
        answer:
          "Yes — paste any text (code, logs, a script, lorem ipsum) and it plays back as the animated terminal stream.",
      },
      {
        question: "What's it for?",
        answer:
          "Fun: pranks, video and stream backgrounds, skits, or pretending to be in a heist movie. It's a classic joke format — the entertainment is the point.",
      },
      {
        question: "Does it work fullscreen for recording?",
        answer:
          "Yes — put the browser fullscreen and the terminal fills the view, which is how people use it for video shots and pranks.",
      },
    ],
  },

  // ── Audio & Video ─────────────────────────────────────────────────────────

  "audio-trimmer": {
    title: "Audio Trimmer — Cut Audio Files to the Exact Section",
    description:
      "Trim an audio file to the exact part you need — set start and end, preview the cut, export as WAV. Free, in-browser, no uploads.",
    keywords: [
      "audio trimmer",
      "trim audio online",
      "cut audio file",
      "audio cutter",
      "trim mp3 online",
      "cut song online",
      "audio clip maker",
      "trim audio free",
      "wav editor online",
      "cut music clip",
    ],
    about:
      "GenRise Audio Trimmer cuts an audio file down to exactly the section you want — drag the start and end points, see the selected length and total duration, preview the cut, and export it as a WAV file. It handles any audio format your browser can decode — MP3, WAV, M4A, OGG and more. Decoding and export run locally with the Web Audio API, so recordings and audio never leave your device.",
    features: [
      "Trim to precise start and end points",
      "Live selection length vs. total duration",
      "Preview the cut before exporting",
      "Accepts MP3, WAV, M4A, OGG and other browser-decodable audio",
      "Exports as WAV — lossless and universally compatible",
      "On-device processing — audio never uploaded",
    ],
    useCases: [
      "Cutting a song down to a ringtone-length clip",
      "Trimming silence or chatter off a recording",
      "Extracting a quote or section from a podcast",
      "Clipping sound effects from a longer file",
      "Shortening voice memos before sharing",
    ],
    faqs: [
      {
        question: "Which audio formats can I trim?",
        answer:
          "Anything your browser can decode — MP3, WAV, M4A/AAC, OGG and more. The export is WAV, which plays everywhere and keeps full quality.",
      },
      {
        question: "How do I cut out just the part I want?",
        answer:
          "Load the file, set the start and end points with the sliders, check the selection length, preview it, and export — you get exactly that section as a WAV.",
      },
      {
        question: "Does trimming reduce audio quality?",
        answer:
          "The cut is exported as lossless WAV, so the kept section is at full decoded quality — there's no extra lossy re-encode.",
      },
      {
        question: "Is my audio uploaded?",
        answer:
          "No — decoding, trimming and encoding all happen in your browser with the Web Audio API. Recordings stay on your device.",
      },
    ],
  },

  "voice-recorder": {
    title: "Voice Recorder — Record Audio in Your Browser, No App",
    description:
      "Record audio from your microphone with a live waveform, pause and resume, choose the format, and download. Free voice recorder — no app needed.",
    keywords: [
      "voice recorder online",
      "record audio online",
      "browser voice recorder",
      "record microphone online",
      "online audio recorder",
      "voice memo recorder",
      "record voice no app",
      "mic recorder online free",
      "audio recording browser",
      "dictaphone online",
    ],
    about:
      "GenRise Voice Recorder captures audio straight from your microphone in the browser — no app install, no account, no upload to a cloud service. Watch the live waveform as you record, pause and resume mid-session, pick a recording format where your browser offers a choice, then download the file instantly. Because recording uses the native MediaRecorder API on your device, what you record stays yours — ideal for voice memos, interview notes, and anything you wouldn't want on someone else's server.",
    features: [
      "Record microphone audio directly in the browser — no app",
      "Live waveform visualisation while recording",
      "Pause and resume mid-recording",
      "Recording-format choice where the browser supports several",
      "Instant download with the correct file extension",
      "Nothing is uploaded — audio is captured and saved locally",
    ],
    useCases: [
      "Quick voice memos and ideas without a phone app",
      "Recording interview or lecture notes on a laptop",
      "Capturing audio for podcasts and voiceovers",
      "Dictating drafts and notes",
      "Recording on shared computers without installing software",
    ],
    faqs: [
      {
        question: "How do I record my voice without an app?",
        answer:
          "Open the recorder, allow microphone access when prompted, and hit Start Recording. Pause/resume as needed, then stop and download — the whole thing runs in the browser.",
      },
      {
        question: "Where does the recording get saved?",
        answer:
          "Nowhere until you download it — recording happens locally with the MediaRecorder API and the file saves straight to your device. Nothing is sent to a server.",
      },
      {
        question: "What format is the recording in?",
        answer:
          "Whatever your browser's MediaRecorder supports — typically WebM/Opus, with alternatives offered when available. The download gets the right extension automatically.",
      },
      {
        question: "Can I pause and continue the same recording?",
        answer:
          "Yes — pause and resume freely; the final file is one continuous recording of everything you captured.",
      },
      {
        question: "Is there a recording time limit?",
        answer:
          "No artificial limit — record as long as your device allows. Longer sessions simply produce larger files.",
      },
    ],
  },

  "screen-recorder": {
    title: "Screen Recorder — Record Your Screen in the Browser",
    description:
      "Record your screen — with system or microphone audio — directly in the browser, then download the video. No app, no sign-up, nothing uploaded.",
    keywords: [
      "screen recorder online",
      "record screen in browser",
      "free screen recorder no download",
      "screen recording online",
      "record screen with audio",
      "browser screen capture",
      "screen recorder no install",
      "capture screen video online",
      "record browser tab",
      "webm screen recorder",
    ],
    about:
      "GenRise Screen Recorder captures your screen — a window, a tab or the whole display — straight from the browser, with system or microphone audio where your browser supports it. No desktop app to install, no account, and no cloud processing: the video is encoded on your device via the MediaRecorder API and downloads directly to you. It's the zero-setup answer for quick demos, bug reports, walkthroughs and clips.",
    features: [
      "Record full screen, a window, or a single browser tab",
      "System or microphone audio where the browser supports it",
      "Recording format options where available",
      "Instant video download when you stop",
      "No app install — uses the browser's native screen capture",
      "Fully private — the video never leaves your device",
    ],
    useCases: [
      "Recording a bug or error to share with support",
      "Quick product demos and walkthroughs",
      "Capturing a presentation or tutorial",
      "Recording gameplay or app clips",
      "Screen capture on machines where you can't install software",
    ],
    faqs: [
      {
        question: "How do I record my screen without downloading software?",
        answer:
          "Click record — the browser asks what to share (whole screen, a window, or a tab). Pick it, record, stop, and download the video. The capture uses your browser's built-in screen-share API.",
      },
      {
        question: "Can I record audio with the screen?",
        answer:
          "Where the browser supports it, yes — system audio for a tab/window or your microphone. Audio support varies by browser: Chrome shares tab audio, for example.",
      },
      {
        question: "What format does the recording save as?",
        answer:
          "WebM by default in most browsers — playable in Chrome, Firefox, VLC and modern players. Where your browser offers other MediaRecorder formats, you can pick one before starting.",
      },
      {
        question: "Is the recording uploaded anywhere?",
        answer:
          "No — encoding happens on your device and the file downloads straight to you. Nothing passes through a server, so recordings can include anything on screen without privacy worries.",
      },
      {
        question: "Is there a time limit?",
        answer:
          "No fixed limit — record as long as you need. Longer recordings produce bigger files, and everything stays local either way.",
      },
    ],
  },

  "video-to-gif": {
    title: "Video to GIF Converter — Turn Clips into Animated GIFs",
    description:
      "Convert part of a video into an animated GIF — pick the start, clip length and frame rate. Free, in-browser conversion with no uploads.",
    keywords: [
      "video to gif",
      "video to gif converter",
      "convert video to gif online",
      "mp4 to gif",
      "make gif from video",
      "gif maker from video",
      "video clip to gif",
      "animated gif converter",
      "video to gif no upload",
      "create gif from mp4",
    ],
    about:
      "GenRise Video to GIF turns a section of a video into an animated GIF: pick where the clip starts, how long it runs (up to about 15 seconds), and the frame rate from 2 to 20 fps — the tool estimates the frame count so you can balance smoothness against file size. Frames are captured locally and encoded into a real GIF, so your video is never uploaded — the private way to make reaction GIFs, demos and clips.",
    features: [
      "Choose the exact start point and clip length (up to ~15s)",
      "Frame-rate control from 2 to 20 fps",
      "Frame-count estimate so you can predict the output size",
      "Encodes a true animated GIF — works everywhere GIFs do",
      "Accepts MP4, WebM and other browser-playable video",
      "Runs entirely on-device — video never uploaded",
    ],
    useCases: [
      "Reaction GIFs from video clips",
      "Short product demos and UI captures for docs",
      "Converting a highlight moment to a shareable GIF",
      "Looping clips for chats and forums",
      "GIFs for READMEs and issue reports",
    ],
    faqs: [
      {
        question: "How do I turn part of a video into a GIF?",
        answer:
          "Load the video, set the start time and clip length, pick a frame rate, and convert — the selected section downloads as an animated GIF.",
      },
      {
        question: "What frame rate should I use?",
        answer:
          "8–12 fps looks smooth enough for most GIFs while keeping file size sane. Go higher for fast motion, lower for long clips — the tool shows the estimated frame count as you adjust.",
      },
      {
        question: "Why is there a clip length limit?",
        answer:
          "GIFs grow huge fast — every frame is a full image. Capping around 15 seconds keeps output usable for sharing; for longer video, an actual video format is the better choice.",
      },
      {
        question: "Why does my GIF look smaller or choppier than the video?",
        answer:
          "GIFs trade resolution and frame rate for compatibility — it's a 1987 format with 256-colour frames. Pick a shorter clip and moderate fps for the cleanest result.",
      },
      {
        question: "Is my video uploaded to convert it?",
        answer:
          "No — frames are captured and encoded into a GIF entirely in your browser. The source video never leaves your device.",
      },
    ],
  },
};

export function getToolSeoOverride(slug: string): ToolSeoOverride | undefined {
  return toolSeoOverrides[slug];
}
