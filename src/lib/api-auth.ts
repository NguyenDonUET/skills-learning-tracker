import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/db";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Require a Clerk session and upsert the matching Prisma User. */
export async function requireDbUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await prisma.user.upsert({
    where: { clerkId },
    create: { clerkId },
    update: {},
  });

  return user;
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
