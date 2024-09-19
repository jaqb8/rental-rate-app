import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { revalidatePath } from "next/cache";

export const reviewRouter = createTRPCRouter({
  getByLandlordId: publicProcedure
    .input(z.object({ landlordId: z.string() }))
    .query(({ ctx, input }) => {
      const reviews = ctx.db.review.findMany({
        where: {
          landlordId: input.landlordId,
        },
      });
      return reviews;
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        rating: z.number().int().gte(1).lte(5),
        landlordId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.create({
        data: {
          title: input.title,
          content: input.content,
          rating: input.rating,
          landlordId: input.landlordId,
        },
      });

      const avgRating = await ctx.db.review.aggregate({
        where: { landlordId: input.landlordId },
        _avg: { rating: true },
      });

      await ctx.db.landlord.update({
        where: { id: input.landlordId },
        data: { avgRating: avgRating._avg.rating ?? 0 },
      });

      return review;
    }),
});
