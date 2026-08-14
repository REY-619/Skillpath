import { Router } from "express";
import { withSession } from "../lib/db.js";
import { asyncHandler } from "../lib/http.js";

export const skillsRouter = Router();

// GET /api/skills — full skill catalog with prerequisite edges, for the skill map view.
skillsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await withSession(async (session) => {
      const result = await session.run(
        `MATCH (s:Skill)
         OPTIONAL MATCH (s)-[:PREREQUISITE_OF]->(next:Skill)
         RETURN s { .id, .name, .category } AS skill,
                collect(DISTINCT next.id) AS unlocks`
      );
      return result.records.map((r) => ({
        ...r.get("skill"),
        unlocks: r.get("unlocks"),
      }));
    });
    res.json(data);
  })
);
