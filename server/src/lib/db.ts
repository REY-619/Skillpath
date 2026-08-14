import neo4j, { Driver, Session, SessionMode } from "neo4j-driver";

/**
 * CognoDB speaks openCypher over Bolt and is wire-compatible with the
 * official Neo4j drivers, so we connect to it exactly like a Neo4j
 * instance: bolt+s://<instance-id>.databases.cognodb.cloud
 */

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

let driver: Driver | null = null;
let initError: string | null = null;

function getDriver(): Driver {
  if (driver) return driver;

  if (!uri || !user || !password) {
    initError =
      "Database is not configured. Set NEO4J_URI, NEO4J_USER and NEO4J_PASSWORD in server/.env " +
      "(see server/.env.example) to your CognoDB connection details.";
    throw new Error(initError);
  }

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionPoolSize: 20,
    connectionAcquisitionTimeout: 10_000,
    connectionTimeout: 10_000,
  });

  return driver;
}

/** Verifies connectivity without throwing; used by the /health route. */
export async function checkConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const d = getDriver();
    await d.verifyConnectivity();
    return { ok: true, message: "Connected to CognoDB." };
  } catch (err) {
    const message =
      initError ?? (err instanceof Error ? err.message : "Could not reach the database.");
    return { ok: false, message };
  }
}

/**
 * Runs `work` inside a managed session/transaction and always closes the
 * session, translating connectivity failures into a typed error the API
 * routes can turn into a clean 503 instead of an unhandled 500.
 */
export async function withSession<T>(
  work: (session: Session) => Promise<T>,
  mode: SessionMode = neo4j.session.READ
): Promise<T> {
  let session: Session;
  try {
    const d = getDriver();
    session = d.session({ defaultAccessMode: mode });
  } catch (err) {
    throw new DatabaseUnavailableError(
      err instanceof Error ? err.message : "Database is not configured."
    );
  }

  try {
    return await work(session);
  } catch (err: any) {
    if (isConnectivityError(err)) {
      throw new DatabaseUnavailableError(
        "Could not reach CognoDB. Check that your instance is running and your " +
          "NEO4J_URI / NEO4J_PASSWORD are correct."
      );
    }
    throw err;
  } finally {
    await session.close();
  }
}

function isConnectivityError(err: any): boolean {
  const code = err?.code ?? "";
  const message = String(err?.message ?? "");
  return (
    code.startsWith("ServiceUnavailable") ||
    code === "Neo.ClientError.Security.Unauthorized" ||
    message.includes("ECONNREFUSED") ||
    message.includes("ENOTFOUND") ||
    message.includes("Could not perform discovery") ||
    message.includes("Connection acquisition timed out")
  );
}

export class DatabaseUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}
