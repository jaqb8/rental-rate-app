import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { passwordHash: _, ...user } = await ctx.db.user.update({
        where: {
          id: ctx.userId,
        },
        data: {
          ...input,
        },
      });
      return user;
    }),
});
