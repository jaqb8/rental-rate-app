import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import dayjs from "dayjs";
import { TRPCError } from "@trpc/server";

export const reviewRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!review) {
        return null;
      }
      const user = await ctx.db.user.findUnique({
        where: {
          id: review.userId,
        },
      });

      return {
        ...review,
        createdAt: dayjs(review.createdAt).format("DD-MM-YYYY HH:mm"),
        username: user?.name ?? user?.email,
        userImage: user?.image ?? "",
      };
    }),

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
      const userIds = reviews.map((review) => review.userId);
      const users = await ctx.db.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });
      const userMap = users.reduce(
        (acc, user) => {
          acc[user.id] = {
            userName: user.name ?? user.email,
            userImage: user.image ?? "",
          };
          return acc;
        },
        {} as Record<string, { userName: string; userImage: string }>,
      );

      return reviews.map((review) => ({
        ...review,
        createdAt: dayjs(review.createdAt).format("DD-MM-YYYY HH:mm"),
        username: userMap[review.userId]?.userName,
        userImage: userMap[review.userId]?.userImage,
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

      const userIds = reviews.map((review) => review.userId);
      const users = await ctx.db.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });
      const userMap = users.reduce(
        (acc, user) => {
          acc[user.id] = {
            userName: user.name ?? user.email,
            userImage: user.image ?? "",
          };
          return acc;
        },
        {} as Record<string, { userName: string; userImage: string }>,
      );

      return {
        page: input.page,
        pageSize: input.pageSize,
        count: await ctx.db.review.count({
          where: { landlordId: input.landlordId },
        }),
        results: reviews.map((review) => ({
          ...review,
          createdAt: dayjs(review.createdAt).format("DD-MM-YYYY HH:mm"),
          username: userMap[review.userId]?.userName,
          userImage: userMap[review.userId]?.userImage,
        })),
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        rating: z.number().int().gte(1).lte(5),
        landlordId: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      console.log(input);
      return ctx.db.review.create({
        data: {
          content: input.content,
          rating: input.rating,
          landlordId: input.landlordId,
          userId: ctx.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          content: z.string().optional(),
          rating: z.number().int().gte(1).lte(5).optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.review.updateMany({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        data: input.data,
      });
      if (result.count === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not allowed to update this review or it does not exist",
        });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.review.deleteMany({
        where: {
          id: input.id,
        },
      });
      if (result.count === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not allowed to delete this review or it does not exist",
        });
      }
      return result;
    }),
});
