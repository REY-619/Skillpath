import { useEffect, useRef, useState } from "react";
import { ApiError } from "./api";

type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; error: ApiError | Error }
  | { status: "success"; data: T };

/** Runs `fn` whenever `deps` change, tracking loading/success/error state and ignoring stale responses. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> & { reload: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });
  const requestId = useRef(0);

  function run() {
    const id = ++requestId.current;
    setState({ status: "loading" });
    fn().then(
      (data) => {
        if (requestId.current === id) setState({ status: "success", data });
      },
      (error) => {
        if (requestId.current === id) setState({ status: "error", error });
      }
    );
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(run, deps);

  return { ...state, reload: run } as AsyncState<T> & { reload: () => void };
}
