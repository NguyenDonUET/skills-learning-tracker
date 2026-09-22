import { ApiError, jsonError, requireDbUser } from "@/lib/api-auth";
import { parseGoalInput, toApiSkill } from "@/lib/api-mappers";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

async function getOwnedSkill(userId: string, id: string) {
  const skill = await prisma.skill.findFirst({
    where: { id, userId },
  });
  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }
  return skill;
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const skill = await getOwnedSkill(user.id, id);
    return Response.json({ skill: toApiSkill(skill) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    await getOwnedSkill(user.id, id);

    const body = (await request.json()) as {
      name?: unknown;
      color?: unknown;
      goal?: unknown;
    };

    const data: {
      name?: string;
      color?: string;
      goalType?: string | null;
      goalTargetHours?: number | null;
    } = {};

    if (body.name !== undefined) {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (!name) throw new ApiError(400, "Name is required");
      data.name = name;
    }

    if (body.color !== undefined) {
      if (typeof body.color !== "string" || !body.color.trim()) {
        throw new ApiError(400, "Invalid color");
      }
      data.color = body.color.trim();
    }

    if (body.goal !== undefined) {
      try {
        const parsed = parseGoalInput(body.goal);
        data.goalType = parsed.goalType;
        data.goalTargetHours = parsed.goalTargetHours;
      } catch {
        throw new ApiError(400, "Invalid goal");
      }
    }

    const skill = await prisma.skill.update({
      where: { id },
      data,
    });

    return Response.json({ skill: toApiSkill(skill) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    await getOwnedSkill(user.id, id);

    // MongoDB/Prisma: cascade delete sessions manually
    await prisma.$transaction([
      prisma.session.deleteMany({ where: { userId: user.id, skillId: id } }),
      prisma.skill.delete({ where: { id } }),
    ]);

    return new Response(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
