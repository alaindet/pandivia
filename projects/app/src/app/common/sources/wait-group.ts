export type WaitGroupConfig = {
  workers?: number;
  done?: () => void;
};

export function createWaitGroup(options?: WaitGroupConfig) {

  let workers = options?.workers ?? 0;
  let cleanupFn = options?.done ?? (() => {});

  const cleanup = (fn: () => void) => {
    cleanupFn = fn;
  };

  const add = (workersDiff?: number) => {
    workers += (workersDiff ?? 1);
  };

  const done = (workersDiff?: number) => {
    workers -= (workersDiff ?? 1);

    if (workers === 0) {
      cleanupFn();
    }
  };

  return { add, done, cleanup };
}
