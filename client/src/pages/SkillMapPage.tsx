import { api } from "../lib/api";
import type { Skill } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/StatusViews";

function groupByCategory(skills: Skill[]): Map<string, Skill[]> {
  const map = new Map<string, Skill[]>();
  for (const s of skills) {
    if (!map.has(s.category)) map.set(s.category, []);
    map.get(s.category)!.push(s);
  }
  return map;
}

export function SkillMapPage() {
  const state = useAsync(api.skills, []);

  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Network</span>
        <h1>The full skill map</h1>
        <p className="page-lede">
          Each track is a line. An arrow from one skill to the next means the first unlocks the
          second — the same PREREQUISITE_OF chain the route-finder walks.
        </p>
      </header>

      {state.status === "loading" && <LoadingBlock label="Loading skill map" />}
      {state.status === "error" && <ErrorBlock error={state.error} onRetry={state.reload} />}
      {state.status === "success" && state.data.length === 0 && (
        <EmptyBlock title="No skills defined yet" hint="Run the seed script to load sample data." />
      )}
      {state.status === "success" && state.data.length > 0 && (
        <div className="skill-tracks">
          {Array.from(groupByCategory(state.data)).map(([category, skills]) => {
            const byId = new Map(state.data.map((s) => [s.id, s]));
            return (
              <div key={category} className={`track-column track-${category}`}>
                <h2 className="track-heading">
                  <span className="skill-track-dot" />
                  {category}
                </h2>
                <ul className="track-skill-list">
                  {skills.map((s) => (
                    <li key={s.id} className="track-skill-item">
                      <span className="track-skill-node" />
                      <div>
                        <span className="skill-name">{s.name}</span>
                        {s.unlocks.length > 0 && (
                          <p className="unlocks">
                            unlocks{" "}
                            {s.unlocks
                              .map((id) => byId.get(id)?.name)
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
