import { Router } from "express";
import { withSession } from "../lib/db.js";
import { asyncHandler } from "../lib/http.js";

export const coursesRouter = Router();

// GET /api/courses — full course catalog with the skills each course teaches.
coursesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await withSession(async (session) => {
      const result = await session.run(
        `MATCH (course:Course)
         OPTIONAL MATCH (course)-[:TEACHES]->(s:Skill)
         RETURN course { .id, .title, .provider, .url, .level, .hours } AS course,
                collect(DISTINCT s { .id, .name }) AS teaches
         ORDER BY course.title`
      );
      return result.records.map((r) => ({
        ...r.get("course"),
        teaches: r.get("teaches"),
      }));
    });
    res.json(data);
  })
);
