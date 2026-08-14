import type { Milestone } from "../lib/api";

export function LearningPathLine({ milestones }: { milestones: Milestone[] }) {
  if (milestones.length === 0) {
    return (
      <div className="status-block status-empty">
        <h3>Already there</h3>
        <p className="ink-soft">Every skill this career requires is already checked off.</p>
      </div>
    );
  }

  return (
    <div className="transit-line" role="list" aria-label="Learning path">
      <div className="transit-stop transit-start" role="listitem">
        <span className="transit-node transit-node-start" aria-hidden="true" />
        <div className="transit-stop-body">
          <span className="transit-here">You are here</span>
        </div>
      </div>

      {milestones.map((m, i) => (
        <div key={m.skill.id} className={`transit-stop track-${m.skill.category}`} role="listitem">
          <span
            className={`transit-node ${m.isTargetSkill ? "transit-node-target" : ""}`}
            aria-hidden="true"
          />
          <div className="transit-stop-body">
            <div className="transit-stop-head">
              <span className="skill-track-dot" />
              <h4>{m.skill.name}</h4>
              {m.isTargetSkill && <span className="chip chip-target">required</span>}
            </div>
            <p className="ink-faint track-label">{m.skill.category} track · stop {i + 1}</p>
            {m.course ? (
              <a className="course-pill" href={m.course.url} target="_blank" rel="noreferrer">
                <span className="course-pill-title">{m.course.title}</span>
                <span className="course-pill-meta">
                  {m.course.provider} · {m.course.hours}h · {m.course.level}
                </span>
              </a>
            ) : (
              <p className="ink-faint no-course">No course in the catalog teaches this yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
