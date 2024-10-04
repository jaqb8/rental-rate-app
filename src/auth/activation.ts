import { db } from "@/server/db";
import { generateRandomString, alphabet } from "oslo/crypto";

export async function createActivationCode(userId: string): Promise<string> {
  const randomString = generateRandomString(8, alphabet("a-z", "0-9"));
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const { code } = await db.activation.create({
    data: {
      code: randomString,
      expiresAt,
      userId,
    },
  });
  return code;
}

export async function verifyActivationCode(
  code: string,
): Promise<string | null> {
  const activation = await db.activation.findFirst({
    where: {
      code,
    },
  });

  if (!activation) {
    return null;
  }

  if (activation.expiresAt < new Date()) {
    await db.activation.delete({
      where: { id: activation.id },
    });
    return null;
  }

  await db.activation.delete({
    where: { id: activation.id },
  });

  return activation.userId;
}
