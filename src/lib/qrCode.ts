import QRCode from "qrcode";

export interface QrOptions {
  size?: number;
  margin?: number;
  color?: string;
  background?: string;
  errorCorrection?: "L" | "M" | "Q" | "H";
}

export async function generateQrPngBlob(text: string, options: QrOptions = {}): Promise<Blob> {
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, text, {
    width: options.size ?? 512,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrection ?? "M",
    color: {
      dark: options.color ?? "#000000",
      light: options.background ?? "#ffffff",
    },
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Failed to render QR code"))), "image/png");
  });
}

export async function generateQrSvgString(text: string, options: QrOptions = {}): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrection ?? "M",
    color: {
      dark: options.color ?? "#000000",
      light: options.background ?? "#ffffff",
    },
  });
}
