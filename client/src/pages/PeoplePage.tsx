import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/StatusViews";
import { Avatar } from "../components/Avatar";

export function PeoplePage() {
  const state = useAsync(api.people, []);

  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Directory</span>
        <h1>Who's on the map</h1>
        <p className="page-lede">
          Pick anyone below to plot their route to a new career — the graph will chart which
          skills to learn next and who around them can help.
        </p>
      </header>

      {state.status === "loading" && <LoadingBlock label="Loading people" />}
      {state.status === "error" && <ErrorBlock error={state.error} onRetry={state.reload} />}
      {state.status === "success" && state.data.length === 0 && (
        <EmptyBlock title="No one's here yet" hint="Run the seed script to load sample data." />
      )}
      {state.status === "success" && state.data.length > 0 && (
        <div className="grid grid-people">
          {state.data.map((p) => (
            <Link to={`/people/${p.id}`} key={p.id} className="card card-person">
              <Avatar name={p.name} seed={p.avatarSeed} />
              <div className="card-person-body">
                <h3>{p.name}</h3>
                <p className="ink-soft">{p.headline}</p>
              </div>
              <span className="chip chip-count">{p.skillCount} skills</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
