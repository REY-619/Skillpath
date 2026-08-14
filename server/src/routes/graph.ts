import { Router } from "express";
import { Session } from "neo4j-driver";
import { withSession } from "../lib/db.js";
import { asyncHandler } from "../lib/http.js";

export const graphRouter = Router();

type SkillNode = { id: string; name: string; category: string };

function toNum(v: any): number {
  return typeof v?.toNumber === "function" ? v.toNumber() : v;
}

function requireQueryParams(req: any, res: any, keys: string[]): boolean {
  const missing = keys.filter((k) => !req.query[k]);
  if (missing.length > 0) {
    res.status(400).json({
      error: "missing_params",
      message: `Missing required query param(s): ${missing.join(", ")}.`,
    });
    return false;
  }
  return true;
}

/**
 * GET /api/graph/skill-gap?personId=&careerId=
 * The skills a career requires that a person does not already have,
 * ordered by how important the career considers them.
 */
graphRouter.get(
  "/skill-gap",
  asyncHandler(async (req, res) => {
    if (!requireQueryParams(req, res, ["personId", "careerId"])) return;
    const { personId, careerId } = req.query as { personId: string; careerId: string };

    const gap = await withSession(async (session) => {
      const result = await session.run(
        `MATCH (p:Person {id: $personId})
         MATCH (c:Career {id: $careerId})-[r:REQUIRES_SKILL]->(req:Skill)
         WHERE NOT (p)-[:HAS_SKILL]->(req)
         RETURN req { .id, .name, .category } AS skill, r.importance AS importance
         ORDER BY r.importance DESC`,
        { personId, careerId }
      );
      return result.records.map((r) => ({
        ...r.get("skill"),
        importance: toNum(r.get("importance")),
      }));
    });

    res.json(gap);
  })
);

/**
 * Finds the shortest PREREQUISITE_OF chain (1..6 hops) leading to `targetId`,
 * preferring a chain that starts from a skill the person already has. If no
 * known skill reaches it, falls back to the shortest chain from any "root"
 * skill (one with no prerequisite of its own).
 */
async function shortestPrereqChain(
  session: Session,
  targetId: string,
  knownIds: string[]
): Promise<SkillNode[]> {
  const fromKnown = await session.run(
    `MATCH path = shortestPath((k:Skill)-[:PREREQUISITE_OF*1..6]->(target:Skill {id: $targetId}))
     WHERE k.id IN $knownIds AND k.id <> $targetId
     RETURN [n IN nodes(path) | n { .id, .name, .category }] AS chain
     ORDER BY length(path) ASC
     LIMIT 1`,
    { targetId, knownIds }
  );
  if (fromKnown.records.length > 0) {
    return fromKnown.records[0].get("chain");
  }

  const fromRoot = await session.run(
    `MATCH path = shortestPath((root:Skill)-[:PREREQUISITE_OF*1..6]->(target:Skill {id: $targetId}))
     WHERE NOT ()-[:PREREQUISITE_OF]->(root)
     RETURN [n IN nodes(path) | n { .id, .name, .category }] AS chain
     ORDER BY length(path) ASC
     LIMIT 1`,
    { targetId }
  );
  if (fromRoot.records.length > 0) {
    return fromRoot.records[0].get("chain");
  }

  // Target has no prerequisites at all — it's directly learnable.
  const targetOnly = await session.run(
    `MATCH (target:Skill {id: $targetId}) RETURN target { .id, .name, .category } AS skill`,
    { targetId }
  );
  return targetOnly.records.length > 0 ? [targetOnly.records[0].get("skill")] : [];
}

/**
 * GET /api/graph/learning-path?personId=&careerId=
 *
 * The headline multi-hop query: for every skill a career requires that the
 * person is missing, walks the PREREQUISITE_OF graph to build an ordered
 * chain of skills to learn, then attaches the best-fit course for each new
 * skill in the chain (fewest additional prerequisites first).
 */
graphRouter.get(
  "/learning-path",
  asyncHandler(async (req, res) => {
    if (!requireQueryParams(req, res, ["personId", "careerId"])) return;
    const { personId, careerId } = req.query as { personId: string; careerId: string };

    const path = await withSession(async (session) => {
      const knownResult = await session.run(
        `MATCH (p:Person {id: $personId})-[:HAS_SKILL]->(s:Skill)
         RETURN collect(s.id) AS knownIds`,
        { personId }
      );
      if (knownResult.records.length === 0) return null;
      const knownIds: string[] = knownResult.records[0].get("knownIds");

      const missingResult = await session.run(
        `MATCH (c:Career {id: $careerId})-[r:REQUIRES_SKILL]->(req:Skill)
         WHERE NOT req.id IN $knownIds
         RETURN req.id AS id, r.importance AS importance
         ORDER BY r.importance DESC`,
        { careerId, knownIds }
      );
      if (missingResult.records.length === 0) {
        return { knownIds, milestones: [] as any[] };
      }

      const seen = new Set(knownIds);
      const milestones: any[] = [];

      for (const rec of missingResult.records) {
        const targetId = rec.get("id");
        if (seen.has(targetId)) continue;

        const chain = await shortestPrereqChain(session, targetId, knownIds);
        for (const skill of chain) {
          if (seen.has(skill.id)) continue;
          seen.add(skill.id);

          const courseResult = await session.run(
            `MATCH (course:Course)-[:TEACHES]->(s:Skill {id: $skillId})
             OPTIONAL MATCH (course)-[:REQUIRES]->(req:Skill)
             WITH course, collect(req.id) AS reqIds
             RETURN course { .id, .title, .provider, .url, .level, .hours } AS course, reqIds
             ORDER BY size(reqIds) ASC
             LIMIT 1`,
            { skillId: skill.id }
          );

          milestones.push({
            skill,
            isTargetSkill: skill.id === targetId,
            course: courseResult.records[0]?.get("course") ?? null,
          });
        }
      }

      return { knownIds, milestones };
    });

    if (!path) {
      res.status(404).json({ error: "not_found", message: "Person or career not found." });
      return;
    }
    res.json(path);
  })
);

/**
 * GET /api/graph/mentors?personId=&careerId=
 *
 * Walks the professional network (KNOWS) up to 2 hops out and ranks
 * connections by how many of the person's career skill gaps they already
 * cover — the kind of "friend of a friend who knows what I need" query
 * that needs a recursive join in SQL but falls out naturally in Cypher.
 */
graphRouter.get(
  "/mentors",
  asyncHandler(async (req, res) => {
    if (!requireQueryParams(req, res, ["personId", "careerId"])) return;
    const { personId, careerId } = req.query as { personId: string; careerId: string };

    const mentors = await withSession(async (session) => {
      const result = await session.run(
        `MATCH (p:Person {id: $personId})
         MATCH (c:Career {id: $careerId})-[:REQUIRES_SKILL]->(req:Skill)
         WHERE NOT (p)-[:HAS_SKILL]->(req)
         WITH p, collect(DISTINCT req.id) AS missingIds
         MATCH path = (p)-[:KNOWS*1..2]-(mentor:Person)
         WHERE mentor <> p
         WITH missingIds, mentor, min(length(path)) AS hops
         MATCH (mentor)-[:HAS_SKILL]->(ms:Skill)
         WHERE ms.id IN missingIds
         WITH mentor, hops, collect(DISTINCT ms { .id, .name }) AS coveredSkills
         RETURN mentor { .id, .name, .headline, .avatarSeed } AS mentor, coveredSkills, hops
         ORDER BY size(coveredSkills) DESC, hops ASC
         LIMIT 6`,
        { personId, careerId }
      );
      return result.records.map((r) => ({
        mentor: r.get("mentor"),
        coveredSkills: r.get("coveredSkills"),
        hops: toNum(r.get("hops")),
      }));
    });

    res.json(mentors);
  })
);

/**
 * GET /api/graph/course-recommendations?personId=&careerId=
 * Courses ranked by how many of the person's missing skills they cover in one go.
 */
graphRouter.get(
  "/course-recommendations",
  asyncHandler(async (req, res) => {
    if (!requireQueryParams(req, res, ["personId", "careerId"])) return;
    const { personId, careerId } = req.query as { personId: string; careerId: string };

    const courses = await withSession(async (session) => {
      const result = await session.run(
        `MATCH (p:Person {id: $personId})
         MATCH (c:Career {id: $careerId})-[:REQUIRES_SKILL]->(req:Skill)
         WHERE NOT (p)-[:HAS_SKILL]->(req)
         WITH collect(DISTINCT req.id) AS missingIds
         MATCH (course:Course)-[:TEACHES]->(s:Skill)
         WHERE s.id IN missingIds
         WITH course, collect(DISTINCT s { .id, .name }) AS covers
         RETURN course { .id, .title, .provider, .url, .level, .hours } AS course,
                covers,
                size(covers) AS coverage
         ORDER BY coverage DESC
         LIMIT 5`,
        { personId, careerId }
      );
      return result.records.map((r) => ({
        course: r.get("course"),
        covers: r.get("covers"),
        coverage: toNum(r.get("coverage")),
      }));
    });

    res.json(courses);
  })
);
