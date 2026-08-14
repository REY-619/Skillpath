import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { LoadingBlock, ErrorBlock } from "../components/StatusViews";
import { Avatar } from "../components/Avatar";
import { LearningPathLine } from "../components/LearningPathLine";
import { MentorList } from "../components/MentorList";
import { CourseRecommendationList } from "../components/CourseRecommendationList";

export function PersonPage() {
  const { personId = "" } = useParams();
  const personState = useAsync(() => api.person(personId), [personId]);
  const careersState = useAsync(api.careers, []);

  const [careerId, setCareerId] = useState<string | null>(null);

  const effectiveCareerId = useMemo(() => {
    if (careerId) return careerId;
    if (personState.status === "success" && personState.data.interests[0]) {
      return personState.data.interests[0].id;
    }
    return null;
  }, [careerId, personState]);

  const pathState = useAsync(
    () => (effectiveCareerId ? api.learningPath(personId, effectiveCareerId) : Promise.resolve(null)),
    [personId, effectiveCareerId]
  );
  const mentorState = useAsync(
    () => (effectiveCareerId ? api.mentors(personId, effectiveCareerId) : Promise.resolve(null)),
    [personId, effectiveCareerId]
  );
  const courseState = useAsync(
    () =>
      effectiveCareerId
        ? api.courseRecommendations(personId, effectiveCareerId)
        : Promise.resolve(null),
    [personId, effectiveCareerId]
  );

  if (personState.status === "loading")
    return (
      <div className="page">
        <LoadingBlock label="Loading profile" />
      </div>
    );
  if (personState.status === "error")
    return (
      <div className="page">
        <ErrorBlock error={personState.error} onRetry={personState.reload} />
      </div>
    );

  const person = personState.data;

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← People
      </Link>

      <header className="person-header">
        <Avatar name={person.name} seed={person.avatarSeed} size={64} />
        <div>
          <h1>{person.name}</h1>
          <p className="ink-soft">{person.headline}</p>
        </div>
      </header>

      {person.bio && <p className="person-bio">{person.bio}</p>}

      <section className="skill-chip-section">
        <h2 className="section-title">Current skills</h2>
        {person.skills.length === 0 ? (
          <p className="ink-faint">No skills recorded yet.</p>
        ) : (
          <ul className="skill-chip-list">
            {person.skills.map(({ skill, level }) => (
              <li key={skill.id} className={`skill-chip track-${skill.category}`}>
                <span className="skill-track-dot" />
                {skill.name}
                <span className="skill-level ink-faint">{level}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="career-picker">
        <h2 className="section-title">Chart a route to…</h2>
        {careersState.status === "loading" && <LoadingBlock label="Loading careers" />}
        {careersState.status === "error" && (
          <ErrorBlock error={careersState.error} onRetry={careersState.reload} />
        )}
        {careersState.status === "success" && (
          <div className="career-chip-row">
            {careersState.data.map((c) => (
              <button
                key={c.id}
                className={`career-chip ${effectiveCareerId === c.id ? "active" : ""}`}
                onClick={() => setCareerId(c.id)}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
      </section>

      {effectiveCareerId && (
        <div className="route-panels">
          <section className="panel panel-route">
            <h2 className="section-title">Route to skill up</h2>
            {pathState.status === "loading" && <LoadingBlock label="Charting the route" />}
            {pathState.status === "error" && (
              <ErrorBlock error={pathState.error} onRetry={pathState.reload} />
            )}
            {pathState.status === "success" && pathState.data && (
              <LearningPathLine milestones={pathState.data.milestones} />
            )}
          </section>

          <div className="panel-column">
            <section className="panel">
              <h2 className="section-title">Mentors nearby</h2>
              {mentorState.status === "loading" && <LoadingBlock label="Finding mentors" />}
              {mentorState.status === "error" && (
                <ErrorBlock error={mentorState.error} onRetry={mentorState.reload} />
              )}
              {mentorState.status === "success" && mentorState.data && (
                <MentorList mentors={mentorState.data} />
              )}
            </section>

            <section className="panel">
              <h2 className="section-title">Best single courses</h2>
              {courseState.status === "loading" && <LoadingBlock label="Finding courses" />}
              {courseState.status === "error" && (
                <ErrorBlock error={courseState.error} onRetry={courseState.reload} />
              )}
              {courseState.status === "success" && courseState.data && (
                <CourseRecommendationList items={courseState.data} />
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
