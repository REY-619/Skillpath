import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { LoadingBlock, ErrorBlock } from "../components/StatusViews";

export function CareerPage() {
  const { careerId = "" } = useParams();
  const state = useAsync(() => api.career(careerId), [careerId]);

  if (state.status === "loading") return <div className="page"><LoadingBlock label="Loading career" /></div>;
  if (state.status === "error")
    return (
      <div className="page">
        <ErrorBlock error={state.error} onRetry={state.reload} />
      </div>
    );

  const career = state.data;

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/careers" className="back-link">
          ← Careers
        </Link>
        <span className="eyebrow">Destination</span>
        <h1>{career.title}</h1>
        <p className="page-lede">{career.description}</p>
      </header>

      <section>
        <h2 className="section-title">Required skills</h2>
        <ul className="skill-importance-list">
          {career.requiredSkills.map(({ skill, importance }) => (
            <li key={skill.id} className={`track-${skill.category}`}>
              <span className="skill-track-dot" />
              <span className="skill-name">{skill.name}</span>
              <span className="importance-dots" aria-label={`Importance ${importance} of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < importance ? "dot dot-filled" : "dot"} />
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
