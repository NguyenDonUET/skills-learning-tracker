import { ApiError, jsonError, requireDbUser } from "@/lib/api-auth";
import { parseGoalInput, toApiSkill } from "@/lib/api-mappers";
import { prisma } from "@/lib/db";
import { SKILL_COLORS } from "@/lib/stats";

export async function GET() {
  try {
    const user = await requireDbUser();
    const skills = await prisma.skill.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });
    return Response.json({ skills: skills.map(toApiSkill) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireDbUser();
    const body = (await request.json()) as {
      name?: unknown;
      color?: unknown;
      goal?: unknown;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      throw new ApiError(400, "Name is required");
    }

    let goalType: string | null = null;
    let goalTargetHours: number | null = null;
    if (body.goal !== undefined) {
      try {
        ({ goalType, goalTargetHours } = parseGoalInput(body.goal));
      } catch {
        throw new ApiError(400, "Invalid goal");
      }
    }

    const existing = await prisma.skill.findMany({
      where: { userId: user.id },
      select: { color: true },
    });
    const used = new Set(existing.map((s) => s.color));
    const color =
      typeof body.color === "string" && body.color.trim()
        ? body.color.trim()
        : (SKILL_COLORS.find((c) => !used.has(c)) ?? SKILL_COLORS[0]);

    const skill = await prisma.skill.create({
      data: {
        userId: user.id,
        name,
        color,
        goalType,
        goalTargetHours,
      },
    });

    return Response.json({ skill: toApiSkill(skill) }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
