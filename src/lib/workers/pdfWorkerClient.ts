import { createWorkerRpc } from "./workerClient";

let call: ReturnType<typeof createWorkerRpc> | null = null;

function getCall() {
  if (!call) {
    call = createWorkerRpc(
      () => new Worker(new URL("./pdfWorker.ts", import.meta.url), { type: "module" })
    );
  }
  return call;
}

export function runInPdfWorker<T>(op: string, payload: unknown): Promise<T> {
  return getCall()<T>(op, payload);
}
