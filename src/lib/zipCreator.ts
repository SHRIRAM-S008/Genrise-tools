import JSZip from "jszip";

export async function createZip(files: File[], zipName = "archive.zip"): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  return { blob, filename: zipName };
}

export interface NamedFileGroup {
  folder?: string;
  files: File[];
}

export async function createOrganizedZip(
  groups: NamedFileGroup[],
  zipName = "application-pack.zip"
): Promise<{ blob: Blob; filename: string }> {
  const zip = new JSZip();
  for (const group of groups) {
    const target = group.folder ? zip.folder(group.folder) ?? zip : zip;
    for (const file of group.files) {
      target.file(file.name, file);
    }
  }
  const blob = await zip.generateAsync({ type: "blob" });
  return { blob, filename: zipName };
}
