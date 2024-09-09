import { z } from "zod";

import {
  createCallerFactory,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const landlordRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const landlord = ctx.db.landlord.findUnique({
        where: { id: input.id },
      });

      return landlord ?? null;
    }),

  create: publicProcedure
    .input(
      z.object({
        street: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        zip: z.string().min(1),
        country: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.landlord.create({
        data: {
          street: input.street,
          city: input.city,
          state: input.state,
          zip: input.zip,
          country: input.country,
        },
      });
    }),

  //   getLatest: protectedProcedure.query(async ({ ctx }) => {
  //     const post = await ctx.db.post.findFirst({
  //       orderBy: { createdAt: "desc" },
  //       where: { createdBy: { id: ctx.session.user.id } },
  //     });

  //     return post ?? null;
  //   }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});