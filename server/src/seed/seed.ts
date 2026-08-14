import "dotenv/config";
import neo4j from "neo4j-driver";
import {
  skills,
  courses,
  careers,
  careerRequirements,
  courseTeaches,
  courseRequires,
  people,
  personSkills,
  personConnections,
  personInterests,
  prerequisites,
} from "./data.js";

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error(
    "Missing NEO4J_URI / NEO4J_USER / NEO4J_PASSWORD.\n" +
      "Copy server/.env.example to server/.env and fill in your CognoDB connection details."
  );
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function main() {
  const session = driver.session();
  try {
    console.log("Verifying connection to CognoDB...");
    await driver.verifyConnectivity();
    console.log("Connected.");

    console.log("Clearing existing data...");
    await session.run("MATCH (n) DETACH DELETE n");

    console.log("Creating uniqueness constraints...");
    await session.run(
      "CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE"
    );
    await session.run(
      "CREATE CONSTRAINT course_id IF NOT EXISTS FOR (c:Course) REQUIRE c.id IS UNIQUE"
    );
    await session.run(
      "CREATE CONSTRAINT career_id IF NOT EXISTS FOR (c:Career) REQUIRE c.id IS UNIQUE"
    );
    await session.run(
      "CREATE CONSTRAINT person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE"
    );

    console.log(`Loading ${skills.length} skills...`);
    await session.run(
      `UNWIND $rows AS row
       CREATE (s:Skill {id: row.id, name: row.name, category: row.category})`,
      { rows: skills }
    );

    console.log(`Loading ${prerequisites.length} prerequisite edges...`);
    await session.run(
      `UNWIND $rows AS row
       MATCH (a:Skill {id: row[0]}), (b:Skill {id: row[1]})
       CREATE (a)-[:PREREQUISITE_OF]->(b)`,
      { rows: prerequisites }
    );

    console.log(`Loading ${courses.length} courses...`);
    await session.run(
      `UNWIND $rows AS row
       CREATE (c:Course {
         id: row.id, title: row.title, provider: row.provider,
         url: row.url, level: row.level, hours: row.hours
       })`,
      { rows: courses }
    );

    console.log(`Loading ${courseTeaches.length} TEACHES edges...`);
    await session.run(
      `UNWIND $rows AS row
       MATCH (c:Course {id: row[0]}), (s:Skill {id: row[1]})
       CREATE (c)-[:TEACHES]->(s)`,
      { rows: courseTeaches }
    );

    console.log(`Loading ${courseRequires.length} course REQUIRES edges...`);
    await session.run(
      `UNWIND $rows AS row
       MATCH (c:Course {id: row[0]}), (s:Skill {id: row[1]})
       CREATE (c)-[:REQUIRES]->(s)`,
      { rows: courseRequires }
    );

    console.log(`Loading ${careers.length} careers...`);
    await session.run(
      `UNWIND $rows AS row
       CREATE (c:Career {id: row.id, title: row.title, description: row.description})`,
      { rows: careers }
    );

    console.log(`Loading ${careerRequirements.length} REQUIRES_SKILL edges...`);
    await session.run(
      `UNWIND $rows AS row
       MATCH (c:Career {id: row[0]}), (s:Skill {id: row[1]})
       CREATE (c)-[:REQUIRES_SKILL {importance: row[2]}]->(s)`,
      { rows: careerRequirements }
    );

    console.log(`Loading ${people.length} people...`);
    await session.run(
      `UNWIND $rows AS row
       CREATE (p:Person {
         id: row.id, name: row.name, headline: row.headline,
         bio: row.bio, avatarSeed: row.avatarSeed
       })`,
      { rows: people }
    );

    console.log(`Loading ${personSkills.length} HAS_SKILL edges...`);
    await session.run(
      `UNWIND $rows AS row
       MATCH (p:Person {id: row[0]}), (s:Skill {id: row[1]})
       CREATE (p)-[:HAS_SKILL {level: row[2]}]->(s)`,
      { rows: personSkills }
    );

    console.log(`Loading ${personConnections.length} KNOWS edges (both directions)...`);
    await session.run(
      `UNWIND $rows AS row
       MATCH (a:Person {id: row[0]}), (b:Person {id: row[1]})
       CREATE (a)-[:KNOWS]->(b)
       CREATE (b)-[:KNOWS]->(a)`,
      { rows: personConnections }
    );

    console.log(`Loading ${personInterests.length} INTERESTED_IN edges...`);
    await session.run(
      `UNWIND $rows AS row
       MATCH (p:Person {id: row[0]}), (c:Career {id: row[1]})
       CREATE (p)-[:INTERESTED_IN]->(c)`,
      { rows: personInterests }
    );

    const count = await session.run(
      "MATCH (n) RETURN count(n) AS nodes UNION ALL MATCH ()-[r]->() RETURN count(r) AS nodes"
    );
    const [nodeCount, relCount] = count.records.map((r) => r.get("nodes").toNumber());
    console.log(`Done. ${nodeCount} nodes, ${relCount} relationships.`);
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
