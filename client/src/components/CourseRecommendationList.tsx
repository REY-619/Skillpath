import type { CourseRecommendation } from "../lib/api";
import { EmptyBlock } from "./StatusViews";

export function CourseRecommendationList({ items }: { items: CourseRecommendation[] }) {
  if (items.length === 0) {
    return <EmptyBlock title="No multi-skill courses found" />;
  }

  return (
    <ul className="course-rec-list">
      {items.map(({ course, covers, coverage }) => (
        <li key={course.id} className="course-rec-row">
          <a href={course.url} target="_blank" rel="noreferrer" className="course-rec-title">
            {course.title}
          </a>
          <p className="ink-soft course-rec-meta">
            {course.provider} · {course.hours}h · {course.level}
          </p>
          <p className="ink-faint course-rec-covers">
            covers {coverage} skill{coverage === 1 ? "" : "s"}: {covers.map((s) => s.name).join(", ")}
          </p>
        </li>
      ))}
    </ul>
  );
}
