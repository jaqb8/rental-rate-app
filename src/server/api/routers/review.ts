import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import dayjs from "dayjs";

export const reviewRouter = createTRPCRouter({
  getByLandlordId: publicProcedure
    .input(
      z.object({
        landlordId: z.string(),
        limit: z.number().int().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.db.review.findMany({
        where: {
          landlordId: input.landlordId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
      });
      return reviews.map((review) => ({
        ...review,
        createdAt: dayjs(review.createdAt).format("DD-MM-YYYY HH:mm"),
      }));
    }),

  getAvgRatingByLandlordId: publicProcedure
    .input(
      z.object({
        landlordId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.db.review.findMany({
        where: {
          landlordId: input.landlordId,
        },
      });
      const ratings = reviews.map((review) => review.rating);
      if (ratings.length === 0) {
        return {
          avgRating: 0,
          count: 0,
        };
      }
      return {
        avgRating:
          ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length,
        count: ratings.length,
      };
    }),

  getAll: publicProcedure
    .input(
      z.object({
        landlordId: z.string(),
        page: z.number().int().optional().default(1),
        pageSize: z.number().int().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.db.review.findMany({
        where: { landlordId: input.landlordId },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        page: input.page,
        pageSize: input.pageSize,
        count: await ctx.db.review.count({
          where: { landlordId: input.landlordId },
        }),
        results: reviews.map((review) => ({
          ...review,
          createdAt: dayjs(review.createdAt).format("DD-MM-YYYY HH:mm"),
        })),
      };
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
    .mutation(({ ctx, input }) => {
      return ctx.db.review.create({
        data: {
          title: input.title,
          content: input.content,
          rating: input.rating,
          landlordId: input.landlordId,
        },
      });
    }),
});
