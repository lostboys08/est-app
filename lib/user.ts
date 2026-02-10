import prisma from "./prisma";

const DEFAULT_USER_EMAIL = "default@estapp.local";

/**
 * Temporary helper: returns a default user, creating one if needed.
 * Replace this with real auth (e.g. NextAuth / Clerk) later.
 */
export async function getDefaultUser() {
  let user = await prisma.user.findUnique({
    where: { email: DEFAULT_USER_EMAIL },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: DEFAULT_USER_EMAIL,
        name: "Default User",
      },
    });
  }

  return user;
}
