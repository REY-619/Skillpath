import { Router } from "express";
import { withSession } from "../lib/db.js";
import { asyncHandler } from "../lib/http.js";

export const careersRouter = Router();

// GET /api/careers — list careers with their required skill count.
careersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await withSession(async (session) => {
      const result = await session.run(
        `MATCH (c:Career)
         OPTIONAL MATCH (c)-[:REQUIRES_SKILL]->(s:Skill)
         RETURN c { .id, .title, .description } AS career, count(DISTINCT s) AS requiredSkillCount
         ORDER BY c.title`
      );
      return result.records.map((r) => ({
        ...r.get("career"),
        requiredSkillCount: r.get("requiredSkillCount").toNumber(),
      }));
    });
    res.json(data);
  })
);

// GET /api/careers/:id — a career with its required skills, ranked by importance.
careersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await withSession(async (session) => {
      const result = await session.run(
        `MATCH (c:Career {id: $id})
         OPTIONAL MATCH (c)-[r:REQUIRES_SKILL]->(s:Skill)
         RETURN c { .id, .title, .description } AS career,
                collect(DISTINCT { skill: s { .id, .name, .category }, importance: r.importance })
                  AS requiredSkills`,
        { id }
      );
      if (result.records.length === 0) return null;
      const r = result.records[0];
      return {
        ...r.get("career"),
        requiredSkills: r
          .get("requiredSkills")
          .filter((s: any) => s.skill)
          .sort((a: any, b: any) => b.importance - a.importance),
      };
    });

    if (!data) {
      res.status(404).json({ error: "not_found", message: `No career with id "${id}".` });
      return;
    }
    res.json(data);
  })
);
