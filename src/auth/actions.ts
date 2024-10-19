"use server";

import { db } from "@/server/db";
import { hash, verify } from "@node-rs/argon2";
import { type z } from "zod";
import { lucia } from "./lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginFormSchema, signUpFormSchema } from "@/lib/schemas/auth";
import { generateIdFromEntropySize } from "lucia";
import { EmailTemplate, sendMail } from "@/lib/email";
import { validateRequest } from "./validate-request";
import { createActivationCode } from "./activation";
import { env } from "@/env";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
}

export async function signUp(
  _: any,
  formData: FormData,
): Promise<ActionResponse<z.infer<typeof signUpFormSchema>>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = signUpFormSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
        password2: err.fieldErrors.password2?.[0],
      },
    };
  }

  const { email, password } = parsed.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      formError: "Email already in use",
    };
  }

  const userId = generateIdFromEntropySize(10);
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  await db.user.create({
    data: {
      id: userId,
      email,
      passwordHash,
    },
  });

  const activationCode = await createActivationCode(userId);

  await sendMail({
    to: email,
    template: EmailTemplate.EmailVerification,
    props: {
      verificationLink: `${env.APP_URL}/activation?code=${activationCode}`,
    },
  });

  return redirect("/verify-email");
}

export async function login(
  redirectUrl: string,
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
    where: {
      email,
      emailVerified: {
        not: null,
      },
    },
  });

  if (!existingUser) {
    return {
      formError: "Account does not exist or email is not verified",
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
  return redirect(redirectUrl);
}

export async function logout(): Promise<{ error: string } | void> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "No session found",
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}
