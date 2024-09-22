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

  create: publicProcedure
    .input(
      z.object({
        street: z.string().min(1),
        streetNumber: z.string().min(1),
        flatNumber: z.string().optional(),
        city: z.string().min(1),
        zip: z.string().min(1),
        country: z.string().min(1),
        lat: z.string().optional(),
        lng: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let lat = input.lat;
      let lng = input.lng;

      if (!lat || !lng) {
        const address = `${input.street}, ${input.streetNumber}, ${input.flatNumber}, ${input.city}, ${input.zip}, ${input.country}`;
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

        lat = data[0]?.lat;
        lng = data[0]?.lon;

        if (!lat || !lng) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch coordinates",
          });
        }
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
        },
      });
    }),

  update: publicProcedure
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
      console.log(address, data);

      const lat = data[0]?.lat;
      const lng = data[0]?.lon;

      if (!lat || !lng) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch coordinates",
        });
      }

      return ctx.db.landlord.update({
        where: { id: input.id },
        data: {
          ...input.data,
          lat,
          lng,
        },
      });
    }),

  updatePhoto: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          photoUrl: z.string().optional(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.landlord.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  deleteImage: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const photoCustomId = input.id;
      const res = await utapi.deleteFiles(photoCustomId, {
        keyType: "customId",
      });
      if (res.deletedCount === 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete image",
        });
      }
      return ctx.db.landlord.update({
        where: { id: input.id },
        data: { photoUrl: null },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.landlord.delete({
        where: { id: input.id },
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
