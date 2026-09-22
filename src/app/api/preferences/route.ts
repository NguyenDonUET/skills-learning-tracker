import { ApiError, jsonError, requireDbUser } from "@/lib/api-auth";
import { prisma } from "@/lib/db";

/** Read/update signed-in user preferences (theme, etc.). */
export async function GET() {
  try {
    const user = await requireDbUser();
    return Response.json({
      preferences: { theme: user.theme },
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireDbUser();
    const body = (await request.json()) as { theme?: unknown };

    if (body.theme === undefined) {
      throw new ApiError(400, "No preferences to update");
    }

    if (
      typeof body.theme !== "string" ||
      !["light", "dark", "system"].includes(body.theme)
    ) {
      throw new ApiError(400, "theme must be light, dark, or system");
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { theme: body.theme },
    });

    return Response.json({
      preferences: { theme: updated.theme },
    });
  } catch (error) {
    return jsonError(error);
  }
}
