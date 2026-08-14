import { Router } from "express";
import { withSession } from "../lib/db.js";
import { asyncHandler } from "../lib/http.js";

export const peopleRouter = Router();

// GET /api/people — list all people with a quick skill count for the directory view.
peopleRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const people = await withSession(async (session) => {
      const result = await session.run(
        `MATCH (p:Person)
         OPTIONAL MATCH (p)-[:HAS_SKILL]->(s:Skill)
         RETURN p { .id, .name, .headline, .avatarSeed } AS person,
                count(DISTINCT s) AS skillCount
         ORDER BY p.name`,
      );
      return result.records.map((r) => ({
        ...r.get("person"),
        skillCount: r.get("skillCount").toNumber(),
      }));
    });
    res.json(people);
  }),
);

// GET /api/people/:id — profile with skills, interests and direct connections.
peopleRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await withSession(async (session) => {
      const result = await session.run(
        `MATCH (p:Person {id: $id})
         OPTIONAL MATCH (p)-[hs:HAS_SKILL]->(s:Skill)
         WITH p, collect(DISTINCT { skill: s { .id, .name, .category }, level: hs.level }) AS skills
         OPTIONAL MATCH (p)-[:INTERESTED_IN]->(c:Career)
         WITH p, skills, collect(DISTINCT c { .id, .title }) AS interests
         OPTIONAL MATCH (p)-[:KNOWS]-(friend:Person)
         RETURN p { .id, .name, .headline, .bio, .avatarSeed } AS person,
                skills,
                interests,
                collect(DISTINCT friend { .id, .name, .headline, .avatarSeed }) AS connections`,
        { id },
      );
      if (result.records.length === 0) return null;
      const r = result.records[0];
      return {
        ...r.get("person"),
        skills: r.get("skills").filter((s: any) => s.skill),
        interests: r.get("interests"),
        connections: r.get("connections"),
      };
    });

    if (!data) {
      res
        .status(404)
        .json({ error: "not_found", message: `No person with id "${id}".` });
      return;
    }
    res.json(data);
  }),
);
