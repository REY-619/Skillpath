export type Person = {
  id: string;
  name: string;
  headline: string;
  bio?: string;
  avatarSeed: string;
  skillCount?: number;
};

export type SkillRef = { id: string; name: string; category: string };

export type PersonDetail = Person & {
  skills: { skill: SkillRef; level: string }[];
  interests: { id: string; title: string }[];
  connections: Person[];
};

export type Skill = SkillRef & { unlocks: string[] };

export type Career = {
  id: string;
  title: string;
  description: string;
  requiredSkillCount?: number;
};

export type CareerDetail = Career & {
  requiredSkills: { skill: SkillRef; importance: number }[];
};

export type Course = {
  id: string;
  title: string;
  provider: string;
  url: string;
  level: "beginner" | "intermediate" | "advanced";
  hours: number;
  teaches?: SkillRef[];
};

export type SkillGapEntry = SkillRef & { importance: number };

export type Milestone = {
  skill: SkillRef;
  isTargetSkill: boolean;
  course: Course | null;
};

export type LearningPath = {
  knownIds: string[];
  milestones: Milestone[];
};

export type MentorMatch = {
  mentor: Person;
  coveredSkills: { id: string; name: string }[];
  hops: number;
};

export type CourseRecommendation = {
  course: Course;
  covers: { id: string; name: string }[];
  coverage: number;
};

export class ApiError extends Error {
  status: number;
  kind: "database_unavailable" | "not_found" | "other";
  constructor(status: number, kind: ApiError["kind"], message: string) {
    super(message);
    this.status = status;
    this.kind = kind;
  }
}

async function request<T>(path: string): Promise<T> {
  let res: Response;
  try {
    const API_URL = import.meta.env.VITE_API_URL || "";

    res = await fetch(`${API_URL}/api${path}`);
  } catch {
    throw new ApiError(
      0,
      "database_unavailable",
      "Could not reach the SkillPath server.",
    );
  }

  if (!res.ok) {
    let message = `Request failed (${res.status}).`;
    let kind: ApiError["kind"] = "other";
    try {
      const body = await res.json();
      message = body.message ?? message;
      if (body.error === "database_unavailable") kind = "database_unavailable";
      if (body.error === "not_found") kind = "not_found";
    } catch {
      // no JSON body — keep default message
    }
    throw new ApiError(res.status, kind, message);
  }

  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{ ok: boolean; message: string }>("/health"),
  people: () => request<Person[]>("/people"),
  person: (id: string) => request<PersonDetail>(`/people/${id}`),
  skills: () => request<Skill[]>("/skills"),
  careers: () => request<Career[]>("/careers"),
  career: (id: string) => request<CareerDetail>(`/careers/${id}`),
  courses: () => request<Course[]>("/courses"),
  skillGap: (personId: string, careerId: string) =>
    request<SkillGapEntry[]>(
      `/graph/skill-gap?personId=${personId}&careerId=${careerId}`,
    ),
  learningPath: (personId: string, careerId: string) =>
    request<LearningPath>(
      `/graph/learning-path?personId=${personId}&careerId=${careerId}`,
    ),
  mentors: (personId: string, careerId: string) =>
    request<MentorMatch[]>(
      `/graph/mentors?personId=${personId}&careerId=${careerId}`,
    ),
  courseRecommendations: (personId: string, careerId: string) =>
    request<CourseRecommendation[]>(
      `/graph/course-recommendations?personId=${personId}&careerId=${careerId}`,
    ),
};
