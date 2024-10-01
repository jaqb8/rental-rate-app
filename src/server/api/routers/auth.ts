import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { lucia } from "@/auth/lucia";
import { cookies } from "next/headers";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6).max(255),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const passwordHash = await hash(input.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });
      const userId = generateIdFromEntropySize(10);
      await ctx.db.user.create({
        data: { id: userId, email: input.email, passwordHash },
      });
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await lucia.invalidateSession(ctx.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  }),
});
