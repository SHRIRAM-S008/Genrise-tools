export async function removeImageBackground(
  file: File,
  onProgress?: (key: string, current: number, total: number) => void
): Promise<{ blob: Blob; filename: string }> {
  const { removeBackground } = await import("@imgly/background-removal");

  const blob = await removeBackground(file, {
    progress: onProgress,
  });

  return {
    blob,
    filename: file.name.replace(/\.[^./\\]+$/, "") + "-no-bg.png",
  };
}
