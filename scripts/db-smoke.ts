/**
 * Phase 6 smoke test: connect to MongoDB via Prisma, create a test user,
 * skill, and session, then clean up. Does not require Clerk.
 *
 * Usage: pnpm db:smoke
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const clerkId = `smoke-test-${Date.now()}`;

  const user = await prisma.user.upsert({
    where: { clerkId },
    create: { clerkId, theme: "system" },
    update: {},
  });
  console.log("user", user.id);

  const skill = await prisma.skill.create({
    data: {
      userId: user.id,
      name: "Smoke Test Skill",
      color: "#059669",
      goalType: "weekly",
      goalTargetHours: 5,
    },
  });
  console.log("skill", skill.id);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      skillId: skill.id,
      durationMinutes: 30,
      date: new Date().toISOString().slice(0, 10),
      notes: "Phase 6 smoke test",
    },
  });
  console.log("session", session.id);

  const summaryCount = await prisma.session.count({
    where: { userId: user.id },
  });
  console.log("sessionCount", summaryCount);

  await prisma.session.deleteMany({ where: { userId: user.id } });
  await prisma.skill.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
  console.log("cleaned up — Phase 6 DB smoke OK");
}

main()
  .catch((error) => {
    console.error("db smoke failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
