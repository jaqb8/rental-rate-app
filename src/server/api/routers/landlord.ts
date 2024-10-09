import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { utapi } from "@/server/uploadthing";

export const landlordRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.landlord.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const landlord = ctx.db.landlord.findUnique({
        where: { id: input.id },
      });

      return landlord ?? null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        street: z.string().min(1),
        streetNumber: z.string().min(1),
        flatNumber: z.string().optional(),
        city: z.string().min(1),
        zip: z.string().min(1),
        country: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const address = `${input.street},${input.streetNumber},${input.flatNumber},${input.city},${input.zip},${input.country}`;
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
      const lat = data[0]?.lat;
      const lng = data[0]?.lon;

      if (!lat || !lng) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch coordinates",
        });
      }

      return ctx.db.landlord.create({
        data: {
          street: input.street,
          streetNumber: input.streetNumber,
          flatNumber: input.flatNumber,
          city: input.city,
          zip: input.zip,
          country: input.country,
          lat,
          lng,
          userId: ctx.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          street: z.string().optional(),
          streetNumber: z.string().optional(),
          flatNumber: z.string().optional(),
          city: z.string().optional(),
          zip: z.string().optional(),
          country: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const address = `${input.data.street},${input.data.streetNumber}${input.data.flatNumber ? `/${input.data.flatNumber}` : ""},${input.data.city},${input.data.zip},${input.data.country}`;
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

      const lat = data[0]?.lat;
      const lng = data[0]?.lon;

      if (!lat || !lng) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch coordinates",
        });
      }

      const result = await ctx.db.landlord.updateMany({
        where: { id: input.id, userId: ctx.userId },
        data: {
          ...input.data,
          lat,
          lng,
        },
      });
      if (result.count === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not allowed to update this landlord or it does not exist",
        });
      }
      return result;
    }),

  updatePhoto: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          photoUrl: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.landlord.updateMany({
        where: { id: input.id, userId: ctx.userId },
        data: input.data,
      });
      if (result.count === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not allowed to update this landlord or it does not exist",
        });
      }
      return result;
    }),

  deleteImage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const photoCustomId = input.id;
      const utResult = await utapi.deleteFiles(photoCustomId, {
        keyType: "customId",
      });
      if (utResult.deletedCount === 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete image",
        });
      }
      const dbResult = await ctx.db.landlord.updateMany({
        where: { id: input.id, userId: ctx.userId },
        data: { photoUrl: null },
      });
      if (dbResult.count === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not allowed to update this landlord or it does not exist",
        });
      }
      return dbResult;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.landlord.deleteMany({
        where: { id: input.id, userId: ctx.userId },
      });
      if (result.count === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You are not allowed to delete this landlord or it does not exist",
        });
      }
      return result;
    }),
});
