// Realistic-ish seed data for SkillPath.
// Deliberately spans a few tracks (data, frontend, backend, product) so the
// prerequisite graph and the professional network both have real structure —
// multiple routes into the same career, and mentors who aren't obvious.

export type Skill = { id: string; name: string; category: string };
export type Course = {
  id: string;
  title: string;
  provider: string;
  url: string;
  level: "beginner" | "intermediate" | "advanced";
  hours: number;
};
export type Career = { id: string; title: string; description: string };
export type Person = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  avatarSeed: string;
};

export const skills: Skill[] = [
  { id: "sk_html_css", name: "HTML & CSS", category: "Frontend" },
  { id: "sk_js", name: "JavaScript", category: "Frontend" },
  { id: "sk_ts", name: "TypeScript", category: "Frontend" },
  { id: "sk_react", name: "React", category: "Frontend" },
  { id: "sk_frontend_perf", name: "Frontend Performance", category: "Frontend" },
  { id: "sk_accessibility", name: "Web Accessibility", category: "Frontend" },

  { id: "sk_python", name: "Python", category: "Backend" },
  { id: "sk_sql", name: "SQL", category: "Backend" },
  { id: "sk_api_design", name: "API Design", category: "Backend" },
  { id: "sk_node", name: "Node.js", category: "Backend" },
  { id: "sk_system_design", name: "System Design", category: "Backend" },
  { id: "sk_graph_db", name: "Graph Databases", category: "Backend" },

  { id: "sk_stats", name: "Statistics", category: "Data" },
  { id: "sk_data_wrangling", name: "Data Wrangling", category: "Data" },
  { id: "sk_ml_fundamentals", name: "ML Fundamentals", category: "Data" },
  { id: "sk_deep_learning", name: "Deep Learning", category: "Data" },
  { id: "sk_data_viz", name: "Data Visualization", category: "Data" },

  { id: "sk_user_research", name: "User Research", category: "Product" },
  { id: "sk_product_strategy", name: "Product Strategy", category: "Product" },
  { id: "sk_roadmapping", name: "Roadmapping", category: "Product" },
  { id: "sk_stakeholder_mgmt", name: "Stakeholder Management", category: "Product" },

  { id: "sk_leadership", name: "Team Leadership", category: "Leadership" },
  { id: "sk_mentoring", name: "Mentoring", category: "Leadership" },
];

// a -> b means "a is a prerequisite of b" (edge direction: PREREQUISITE_OF)
export const prerequisites: [string, string][] = [
  ["sk_html_css", "sk_js"],
  ["sk_js", "sk_ts"],
  ["sk_js", "sk_react"],
  ["sk_ts", "sk_react"],
  ["sk_react", "sk_frontend_perf"],
  ["sk_html_css", "sk_accessibility"],
  ["sk_react", "sk_accessibility"],

  ["sk_python", "sk_sql"],
  ["sk_sql", "sk_api_design"],
  ["sk_js", "sk_node"],
  ["sk_node", "sk_api_design"],
  ["sk_api_design", "sk_system_design"],
  ["sk_sql", "sk_graph_db"],
  ["sk_system_design", "sk_graph_db"],

  ["sk_stats", "sk_data_wrangling"],
  ["sk_python", "sk_data_wrangling"],
  ["sk_data_wrangling", "sk_ml_fundamentals"],
  ["sk_ml_fundamentals", "sk_deep_learning"],
  ["sk_data_wrangling", "sk_data_viz"],

  ["sk_user_research", "sk_product_strategy"],
  ["sk_product_strategy", "sk_roadmapping"],
  ["sk_roadmapping", "sk_stakeholder_mgmt"],

  ["sk_stakeholder_mgmt", "sk_leadership"],
  ["sk_leadership", "sk_mentoring"],
  ["sk_system_design", "sk_leadership"],
];

export const courses: Course[] = [
  { id: "c_html_css", title: "Modern HTML & CSS", provider: "Frontend Masters", url: "https://frontendmasters.com", level: "beginner", hours: 6 },
  { id: "c_js_fundamentals", title: "JavaScript: The Hard Parts", provider: "Frontend Masters", url: "https://frontendmasters.com", level: "beginner", hours: 10 },
  { id: "c_ts_deep_dive", title: "TypeScript Deep Dive", provider: "Total TypeScript", url: "https://totaltypescript.com", level: "intermediate", hours: 8 },
  { id: "c_react_bootcamp", title: "React Bootcamp", provider: "Epic Web", url: "https://epicweb.dev", level: "intermediate", hours: 12 },
  { id: "c_web_perf", title: "Web Performance in Practice", provider: "web.dev", url: "https://web.dev", level: "advanced", hours: 5 },
  { id: "c_a11y", title: "Accessibility for Engineers", provider: "Deque University", url: "https://dequeuniversity.com", level: "intermediate", hours: 4 },

  { id: "c_python_basics", title: "Python for Everybody", provider: "Coursera", url: "https://coursera.org", level: "beginner", hours: 20 },
  { id: "c_sql_essentials", title: "SQL Essentials", provider: "Mode Analytics", url: "https://mode.com", level: "beginner", hours: 6 },
  { id: "c_api_design", title: "Practical API Design", provider: "O'Reilly", url: "https://oreilly.com", level: "intermediate", hours: 7 },
  { id: "c_node_services", title: "Building Node.js Services", provider: "NodeSchool", url: "https://nodeschool.io", level: "intermediate", hours: 9 },
  { id: "c_system_design", title: "System Design Interview Prep", provider: "ByteByteGo", url: "https://bytebytego.com", level: "advanced", hours: 15 },
  { id: "c_graph_db", title: "Graph Databases in Practice", provider: "Neo4j GraphAcademy", url: "https://graphacademy.neo4j.com", level: "intermediate", hours: 6 },

  { id: "c_statistics", title: "Statistics for Data Science", provider: "Coursera", url: "https://coursera.org", level: "beginner", hours: 18 },
  { id: "c_data_wrangling", title: "Data Wrangling with Pandas", provider: "DataCamp", url: "https://datacamp.com", level: "beginner", hours: 8 },
  { id: "c_ml_fundamentals", title: "Machine Learning Fundamentals", provider: "fast.ai", url: "https://fast.ai", level: "intermediate", hours: 25 },
  { id: "c_deep_learning", title: "Deep Learning Specialization", provider: "deeplearning.ai", url: "https://deeplearning.ai", level: "advanced", hours: 40 },
  { id: "c_data_viz", title: "Storytelling with Data", provider: "O'Reilly", url: "https://oreilly.com", level: "intermediate", hours: 6 },

  { id: "c_user_research", title: "User Research Methods", provider: "NN/g", url: "https://nngroup.com", level: "beginner", hours: 6 },
  { id: "c_product_strategy", title: "Product Strategy Foundations", provider: "Reforge", url: "https://reforge.com", level: "intermediate", hours: 10 },
  { id: "c_roadmapping", title: "Roadmapping That Works", provider: "Product School", url: "https://productschool.com", level: "intermediate", hours: 5 },
  { id: "c_stakeholder_mgmt", title: "Influencing Without Authority", provider: "LinkedIn Learning", url: "https://linkedin.com/learning", level: "intermediate", hours: 3 },

  { id: "c_leadership", title: "Engineering Leadership Foundations", provider: "Reforge", url: "https://reforge.com", level: "advanced", hours: 12 },
  { id: "c_mentoring", title: "The Craft of Mentoring", provider: "LeadDev", url: "https://leaddev.com", level: "intermediate", hours: 3 },
];

export const careers: Career[] = [
  {
    id: "car_frontend_eng",
    title: "Senior Frontend Engineer",
    description:
      "Owns user-facing product surfaces end to end: interaction design, performance, and accessibility.",
  },
  {
    id: "car_backend_eng",
    title: "Senior Backend Engineer",
    description: "Designs APIs and data models that scale, with an eye for system architecture.",
  },
  {
    id: "car_data_scientist",
    title: "Data Scientist",
    description: "Turns messy data into models and decisions, from statistics through deep learning.",
  },
  {
    id: "car_product_manager",
    title: "Product Manager",
    description: "Sets product direction by combining user research with a defensible roadmap.",
  },
  {
    id: "car_eng_manager",
    title: "Engineering Manager",
    description: "Leads engineers and technical strategy while keeping stakeholders aligned.",
  },
];

export const careerRequirements: [string, string, number][] = [
  // careerId, skillId, importance (1-5)
  ["car_frontend_eng", "sk_react", 5],
  ["car_frontend_eng", "sk_ts", 4],
  ["car_frontend_eng", "sk_frontend_perf", 4],
  ["car_frontend_eng", "sk_accessibility", 3],
  ["car_frontend_eng", "sk_html_css", 5],

  ["car_backend_eng", "sk_api_design", 5],
  ["car_backend_eng", "sk_system_design", 5],
  ["car_backend_eng", "sk_graph_db", 3],
  ["car_backend_eng", "sk_sql", 4],
  ["car_backend_eng", "sk_node", 3],

  ["car_data_scientist", "sk_stats", 5],
  ["car_data_scientist", "sk_data_wrangling", 4],
  ["car_data_scientist", "sk_ml_fundamentals", 5],
  ["car_data_scientist", "sk_deep_learning", 3],
  ["car_data_scientist", "sk_data_viz", 3],

  ["car_product_manager", "sk_user_research", 5],
  ["car_product_manager", "sk_product_strategy", 5],
  ["car_product_manager", "sk_roadmapping", 4],
  ["car_product_manager", "sk_stakeholder_mgmt", 4],

  ["car_eng_manager", "sk_leadership", 5],
  ["car_eng_manager", "sk_mentoring", 4],
  ["car_eng_manager", "sk_system_design", 3],
  ["car_eng_manager", "sk_stakeholder_mgmt", 3],
];

export const courseTeaches: [string, string][] = [
  ["c_html_css", "sk_html_css"],
  ["c_js_fundamentals", "sk_js"],
  ["c_ts_deep_dive", "sk_ts"],
  ["c_react_bootcamp", "sk_react"],
  ["c_web_perf", "sk_frontend_perf"],
  ["c_a11y", "sk_accessibility"],

  ["c_python_basics", "sk_python"],
  ["c_sql_essentials", "sk_sql"],
  ["c_api_design", "sk_api_design"],
  ["c_node_services", "sk_node"],
  ["c_system_design", "sk_system_design"],
  ["c_graph_db", "sk_graph_db"],

  ["c_statistics", "sk_stats"],
  ["c_data_wrangling", "sk_data_wrangling"],
  ["c_ml_fundamentals", "sk_ml_fundamentals"],
  ["c_deep_learning", "sk_deep_learning"],
  ["c_data_viz", "sk_data_viz"],

  ["c_user_research", "sk_user_research"],
  ["c_product_strategy", "sk_product_strategy"],
  ["c_roadmapping", "sk_roadmapping"],
  ["c_stakeholder_mgmt", "sk_stakeholder_mgmt"],

  ["c_leadership", "sk_leadership"],
  ["c_mentoring", "sk_mentoring"],
];

export const courseRequires: [string, string][] = [
  ["c_ts_deep_dive", "sk_js"],
  ["c_react_bootcamp", "sk_js"],
  ["c_web_perf", "sk_react"],
  ["c_api_design", "sk_sql"],
  ["c_node_services", "sk_js"],
  ["c_system_design", "sk_api_design"],
  ["c_graph_db", "sk_sql"],
  ["c_ml_fundamentals", "sk_data_wrangling"],
  ["c_deep_learning", "sk_ml_fundamentals"],
  ["c_product_strategy", "sk_user_research"],
  ["c_roadmapping", "sk_product_strategy"],
  ["c_leadership", "sk_stakeholder_mgmt"],
  ["c_mentoring", "sk_leadership"],
];

export const people: Person[] = [
  { id: "p_amara", name: "Amara Okafor", headline: "Frontend Engineer II", bio: "Two years into frontend, learning React deeply.", avatarSeed: "amara" },
  { id: "p_ben", name: "Ben Torres", headline: "Junior Backend Engineer", bio: "SQL-comfortable, wants to grow into system design.", avatarSeed: "ben" },
  { id: "p_chidi", name: "Chidi Nwosu", headline: "Staff Backend Engineer", bio: "Ten years shipping APIs, now mentoring the team.", avatarSeed: "chidi" },
  { id: "p_dana", name: "Dana Kowalski", headline: "Senior Frontend Engineer", bio: "Owns the design system and accessibility standards.", avatarSeed: "dana" },
  { id: "p_elif", name: "Elif Sahin", headline: "Data Analyst", bio: "Strong in statistics, exploring machine learning.", avatarSeed: "elif" },
  { id: "p_farid", name: "Farid Haidari", headline: "Senior Data Scientist", bio: "Deep learning researcher turned applied scientist.", avatarSeed: "farid" },
  { id: "p_grace", name: "Grace Lin", headline: "Associate Product Manager", bio: "One year in product, building research muscle.", avatarSeed: "grace" },
  { id: "p_hana", name: "Hana Kobayashi", headline: "Senior Product Manager", bio: "Runs roadmap planning across three squads.", avatarSeed: "hana" },
  { id: "p_ivan", name: "Ivan Petrov", headline: "Engineering Manager", bio: "Leads a platform team, previously a backend IC.", avatarSeed: "ivan" },
  { id: "p_jules", name: "Jules Bernard", headline: "Frontend Engineer I", bio: "Just picked up TypeScript, wants a growth path.", avatarSeed: "jules" },
  { id: "p_kavi", name: "Kavi Raman", headline: "Backend Engineer II", bio: "Comfortable with Node services, new to graph databases.", avatarSeed: "kavi" },
  { id: "p_lena", name: "Lena Fischer", headline: "Full-stack Engineer", bio: "Splits time between React and Node APIs.", avatarSeed: "lena" },
];

// personId, skillId, level
export const personSkills: [string, string, "beginner" | "intermediate" | "advanced"][] = [
  ["p_amara", "sk_html_css", "advanced"],
  ["p_amara", "sk_js", "advanced"],
  ["p_amara", "sk_ts", "intermediate"],

  ["p_ben", "sk_python", "intermediate"],
  ["p_ben", "sk_sql", "intermediate"],

  ["p_chidi", "sk_python", "advanced"],
  ["p_chidi", "sk_sql", "advanced"],
  ["p_chidi", "sk_api_design", "advanced"],
  ["p_chidi", "sk_node", "advanced"],
  ["p_chidi", "sk_system_design", "advanced"],
  ["p_chidi", "sk_graph_db", "intermediate"],
  ["p_chidi", "sk_leadership", "intermediate"],

  ["p_dana", "sk_html_css", "advanced"],
  ["p_dana", "sk_js", "advanced"],
  ["p_dana", "sk_ts", "advanced"],
  ["p_dana", "sk_react", "advanced"],
  ["p_dana", "sk_frontend_perf", "advanced"],
  ["p_dana", "sk_accessibility", "advanced"],

  ["p_elif", "sk_stats", "advanced"],
  ["p_elif", "sk_python", "intermediate"],
  ["p_elif", "sk_data_wrangling", "intermediate"],

  ["p_farid", "sk_stats", "advanced"],
  ["p_farid", "sk_data_wrangling", "advanced"],
  ["p_farid", "sk_ml_fundamentals", "advanced"],
  ["p_farid", "sk_deep_learning", "advanced"],
  ["p_farid", "sk_data_viz", "intermediate"],

  ["p_grace", "sk_user_research", "intermediate"],

  ["p_hana", "sk_user_research", "advanced"],
  ["p_hana", "sk_product_strategy", "advanced"],
  ["p_hana", "sk_roadmapping", "advanced"],
  ["p_hana", "sk_stakeholder_mgmt", "advanced"],

  ["p_ivan", "sk_python", "advanced"],
  ["p_ivan", "sk_sql", "advanced"],
  ["p_ivan", "sk_api_design", "advanced"],
  ["p_ivan", "sk_system_design", "advanced"],
  ["p_ivan", "sk_stakeholder_mgmt", "advanced"],
  ["p_ivan", "sk_leadership", "advanced"],
  ["p_ivan", "sk_mentoring", "intermediate"],

  ["p_jules", "sk_html_css", "intermediate"],
  ["p_jules", "sk_js", "intermediate"],
  ["p_jules", "sk_ts", "beginner"],

  ["p_kavi", "sk_js", "advanced"],
  ["p_kavi", "sk_node", "advanced"],
  ["p_kavi", "sk_api_design", "intermediate"],
  ["p_kavi", "sk_sql", "intermediate"],

  ["p_lena", "sk_html_css", "advanced"],
  ["p_lena", "sk_js", "advanced"],
  ["p_lena", "sk_ts", "intermediate"],
  ["p_lena", "sk_react", "intermediate"],
  ["p_lena", "sk_node", "intermediate"],
  ["p_lena", "sk_api_design", "beginner"],
];

// undirected in spirit — stored as directed KNOWS edges, queried both ways
export const personConnections: [string, string][] = [
  ["p_amara", "p_dana"],
  ["p_amara", "p_jules"],
  ["p_amara", "p_lena"],
  ["p_ben", "p_chidi"],
  ["p_ben", "p_kavi"],
  ["p_chidi", "p_ivan"],
  ["p_chidi", "p_kavi"],
  ["p_dana", "p_lena"],
  ["p_elif", "p_farid"],
  ["p_elif", "p_hana"],
  ["p_grace", "p_hana"],
  ["p_hana", "p_ivan"],
  ["p_ivan", "p_kavi"],
  ["p_jules", "p_lena"],
  ["p_lena", "p_kavi"],
  ["p_farid", "p_ivan"],
];

export const personInterests: [string, string][] = [
  ["p_amara", "car_frontend_eng"],
  ["p_jules", "car_frontend_eng"],
  ["p_ben", "car_backend_eng"],
  ["p_kavi", "car_backend_eng"],
  ["p_elif", "car_data_scientist"],
  ["p_grace", "car_product_manager"],
  ["p_lena", "car_backend_eng"],
];
