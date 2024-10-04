import { verifyActivationCode } from "@/auth/activation";
import { lucia } from "@/auth/lucia";
import { env } from "@/env";
import { db } from "@/server/db";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code || typeof code !== "string") {
    notFound();
  }

  try {
    const userId = await verifyActivationCode(code);
    if (!userId) {
      console.error("Invalid activation code");
      return NextResponse.redirect(`${env.APP_URL}/activation/failure`);
    }

    await db.user.update({
      where: { id: userId },
      data: {
        emailVerified: new Date(),
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return NextResponse.redirect(`${env.APP_URL}/activation/success`);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${env.APP_URL}/activation/failure`);
  }
}
