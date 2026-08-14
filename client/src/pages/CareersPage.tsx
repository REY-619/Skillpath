import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/StatusViews";

export function CareersPage() {
  const state = useAsync(api.careers, []);

  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Destinations</span>
        <h1>Where the lines lead</h1>
        <p className="page-lede">
          Every career here is a destination station, reached by a chain of skill prerequisites.
        </p>
      </header>

      {state.status === "loading" && <LoadingBlock label="Loading careers" />}
      {state.status === "error" && <ErrorBlock error={state.error} onRetry={state.reload} />}
      {state.status === "success" && state.data.length === 0 && (
        <EmptyBlock title="No careers defined yet" hint="Run the seed script to load sample data." />
      )}
      {state.status === "success" && state.data.length > 0 && (
        <div className="grid grid-careers">
          {state.data.map((c) => (
            <Link to={`/careers/${c.id}`} key={c.id} className="card card-career">
              <h3>{c.title}</h3>
              <p className="ink-soft">{c.description}</p>
              <span className="chip">{c.requiredSkillCount} required skills</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
