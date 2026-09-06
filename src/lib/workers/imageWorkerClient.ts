import { createWorkerRpc } from "./workerClient";

let call: ReturnType<typeof createWorkerRpc> | null = null;

function getCall() {
  if (!call) {
    call = createWorkerRpc(
      () => new Worker(new URL("./imageWorker.ts", import.meta.url), { type: "module" })
    );
  }
  return call;
}

export function runInImageWorker<T>(op: string, payload: unknown): Promise<T> {
  return getCall()<T>(op, payload);
}
