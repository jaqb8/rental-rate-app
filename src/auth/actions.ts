"use server";

import { db } from "@/server/db";
import { verify } from "@node-rs/argon2";
import { type z } from "zod";
import { lucia } from "./lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginFormSchema } from "@/lib/schemas/login";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
}

export async function login(
  _: any,
  formData: FormData,
): Promise<ActionResponse<z.infer<typeof loginFormSchema>>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = loginFormSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return {
      formError: "Incorrect email or password",
    };
  }

  const validPassword = await verify(existingUser.passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return {
      formError: "Incorrect email or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}
