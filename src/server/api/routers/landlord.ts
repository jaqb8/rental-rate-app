import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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
        zip: z.string().min(1),
        country: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const address = `${input.street}, ${input.city}, ${input.zip}, ${input.country}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch coordinates",
        });
      }

      const data: { lat: string; lon: string }[] = await response.json();

      const lat = parseFloat(data[0]?.lat ?? "0");
      const lng = parseFloat(data[0]?.lon ?? "0");

      if (!lat || !lng) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch coordinates",
        });
      }

      return ctx.db.landlord.create({
        data: {
          street: input.street,
          city: input.city,
          zip: input.zip,
          country: input.country,
          lat,
          lng,
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
