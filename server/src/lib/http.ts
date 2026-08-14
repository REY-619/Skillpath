import { NextFunction, Request, RequestHandler, Response } from "express";
import { DatabaseUnavailableError } from "./db.js";

/** Wraps an async route handler so rejected promises reach Express's error middleware. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof DatabaseUnavailableError) {
    res.status(503).json({ error: "database_unavailable", message: err.message });
    return;
  }
  console.error(err);
  const message = err instanceof Error ? err.message : "Unexpected server error.";
  res.status(500).json({ error: "internal_error", message });
}
