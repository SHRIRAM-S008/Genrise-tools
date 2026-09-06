interface PendingEntry {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}

interface WorkerResponse {
  id: number;
  result?: unknown;
  error?: string;
}

/**
 * Creates a lazily-instantiated singleton worker plus a promise-based RPC
 * caller. The worker is only spun up on first use (never during SSR).
 */
export function createWorkerRpc(createWorker: () => Worker) {
  let worker: Worker | null = null;
  let nextId = 0;
  const pending = new Map<number, PendingEntry>();

  function ensureWorker(): Worker {
    if (worker) return worker;
    worker = createWorker();
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, result, error } = event.data;
      const entry = pending.get(id);
      if (!entry) return;
      pending.delete(id);
      if (error) entry.reject(new Error(error));
      else entry.resolve(result);
    };
    worker.onerror = (event: ErrorEvent) => {
      for (const [id, entry] of pending) {
        entry.reject(new Error(event.message || "Worker error"));
        pending.delete(id);
      }
    };
    return worker;
  }

  return function call<T>(op: string, payload: unknown, transfer: Transferable[] = []): Promise<T> {
    if (typeof Worker === "undefined") {
      return Promise.reject(new Error("Web Workers are not supported in this environment"));
    }
    const w = ensureWorker();
    const id = nextId++;
    return new Promise<T>((resolve, reject) => {
      pending.set(id, { resolve: resolve as (value: unknown) => void, reject });
      w.postMessage({ id, op, payload }, transfer);
    });
  };
}
