import { ApiError, jsonError, requireDbUser } from "@/lib/api-auth";
import {
  isValidDateString,
  isValidDuration,
  toApiSession,
} from "@/lib/api-mappers";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

async function getOwnedSession(userId: string, id: string) {
  const session = await prisma.session.findFirst({
    where: { id, userId },
  });
  if (!session) {
    throw new ApiError(404, "Session not found");
  }
  return session;
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const session = await getOwnedSession(user.id, id);
    return Response.json({ session: toApiSession(session) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    await getOwnedSession(user.id, id);

    const body = (await request.json()) as {
      skillId?: unknown;
      durationMinutes?: unknown;
      date?: unknown;
      notes?: unknown;
    };

    const data: {
      skillId?: string;
      durationMinutes?: number;
      date?: string;
      notes?: string | null;
    } = {};

    if (body.skillId !== undefined) {
      if (typeof body.skillId !== "string" || !body.skillId) {
        throw new ApiError(400, "Invalid skillId");
      }
      const skill = await prisma.skill.findFirst({
        where: { id: body.skillId, userId: user.id },
        select: { id: true },
      });
      if (!skill) throw new ApiError(404, "Skill not found");
      data.skillId = body.skillId;
    }

    if (body.durationMinutes !== undefined) {
      const durationMinutes = Number(body.durationMinutes);
      if (!isValidDuration(durationMinutes)) {
        throw new ApiError(400, "durationMinutes must be an integer >= 1");
      }
      data.durationMinutes = durationMinutes;
    }

    if (body.date !== undefined) {
      if (typeof body.date !== "string" || !isValidDateString(body.date)) {
        throw new ApiError(400, "Invalid date (expected YYYY-MM-DD)");
      }
      data.date = body.date;
    }

    if (body.notes !== undefined) {
      if (body.notes === null) {
        data.notes = null;
      } else if (typeof body.notes === "string") {
        data.notes = body.notes.trim() ? body.notes.trim() : null;
      } else {
        throw new ApiError(400, "Invalid notes");
      }
    }

    const session = await prisma.session.update({
      where: { id },
      data,
    });

    return Response.json({ session: toApiSession(session) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    await getOwnedSession(user.id, id);
    await prisma.session.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}
