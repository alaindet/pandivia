export function doOnce(fn: () => void): () => void {

  let done = false;

  return () => {
    if (!done) {
      done = true;
      fn();
    }
  };
}