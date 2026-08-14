import { ApiError } from "../lib/api";

export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div className="status-block" role="status" aria-live="polite">
      <div className="skeleton-row" />
      <div className="skeleton-row" style={{ width: "70%" }} />
      <div className="skeleton-row" style={{ width: "45%" }} />
      <span className="sr-only">{label}…</span>
    </div>
  );
}

export function EmptyBlock({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="status-block status-empty">
      <h3>{title}</h3>
      {hint && <p className="ink-soft">{hint}</p>}
    </div>
  );
}

export function ErrorBlock({ error, onRetry }: { error: ApiError | Error; onRetry?: () => void }) {
  const isDbDown = error instanceof ApiError && error.kind === "database_unavailable";
  return (
    <div className="status-block status-error">
      <h3>{isDbDown ? "Can't reach the database" : "Something went wrong"}</h3>
      <p className="ink-soft">{error.message}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
