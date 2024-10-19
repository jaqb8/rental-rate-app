import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { utapi } from "@/server/uploadthing";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        image: z.string().optional(),
        imageKey: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.image && ctx.user.imageKey) {
        const utResult = await utapi.deleteFiles(ctx.user.imageKey);
        if (utResult.deletedCount === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete image",
          });
        }
      }

      const { passwordHash: _, ...user } = await ctx.db.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          ...input,
        },
      });
      return user;
    }),
});
