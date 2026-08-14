import { Link } from "react-router-dom";
import type { MentorMatch } from "../lib/api";
import { Avatar } from "./Avatar";
import { EmptyBlock } from "./StatusViews";

export function MentorList({ mentors }: { mentors: MentorMatch[] }) {
  if (mentors.length === 0) {
    return (
      <EmptyBlock
        title="No mentors found nearby"
        hint="No one within two connections already has the missing skills."
      />
    );
  }

  return (
    <ul className="mentor-list">
      {mentors.map(({ mentor, coveredSkills, hops }) => (
        <li key={mentor.id} className="mentor-row">
          <Link to={`/people/${mentor.id}`} className="mentor-link">
            <Avatar name={mentor.name} seed={mentor.avatarSeed} size={36} />
            <div>
              <span className="mentor-name">{mentor.name}</span>
              <p className="ink-soft mentor-headline">{mentor.headline}</p>
            </div>
          </Link>
          <div className="mentor-meta">
            <span className="chip chip-hops">{hops === 1 ? "direct connection" : `${hops} hops away`}</span>
            <p className="ink-faint mentor-covers">
              knows {coveredSkills.map((s) => s.name).join(", ")}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
