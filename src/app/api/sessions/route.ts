import { ApiError, jsonError, requireDbUser } from "@/lib/api-auth";
import {
  isValidDateString,
  isValidDuration,
  toApiSession,
} from "@/lib/api-mappers";
import { todayDateString } from "@/lib/dates";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const user = await requireDbUser();
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get("skillId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (skillId) {
      const skill = await prisma.skill.findFirst({
        where: { id: skillId, userId: user.id },
        select: { id: true },
      });
      if (!skill) throw new ApiError(404, "Skill not found");
    }

    if (from && !isValidDateString(from)) {
      throw new ApiError(400, "Invalid from date");
    }
    if (to && !isValidDateString(to)) {
      throw new ApiError(400, "Invalid to date");
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        ...(skillId ? { skillId } : {}),
        ...(from || to
          ? {
              date: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return Response.json({ sessions: sessions.map(toApiSession) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireDbUser();
    const body = (await request.json()) as {
      skillId?: unknown;
      durationMinutes?: unknown;
      date?: unknown;
      notes?: unknown;
    };

    const skillId = typeof body.skillId === "string" ? body.skillId : "";
    if (!skillId) throw new ApiError(400, "skillId is required");

    const skill = await prisma.skill.findFirst({
      where: { id: skillId, userId: user.id },
      select: { id: true },
    });
    if (!skill) throw new ApiError(404, "Skill not found");

    const durationMinutes = Number(body.durationMinutes);
    if (!isValidDuration(durationMinutes)) {
      throw new ApiError(400, "durationMinutes must be an integer >= 1");
    }

    const date =
      typeof body.date === "string" && body.date
        ? body.date
        : todayDateString();
    if (!isValidDateString(date)) {
      throw new ApiError(400, "Invalid date (expected YYYY-MM-DD)");
    }

    let notes: string | null = null;
    if (body.notes !== undefined && body.notes !== null) {
      if (typeof body.notes !== "string") {
        throw new ApiError(400, "Invalid notes");
      }
      notes = body.notes.trim() ? body.notes.trim() : null;
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        skillId,
        durationMinutes,
        date,
        notes,
      },
    });

    return Response.json({ session: toApiSession(session) }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
