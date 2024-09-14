import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTFiles } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: "1MB" } })
    .input(
      z.object({
        landlordId: z.string(),
      }),
    )
    .middleware(async ({ req, input, files }) => {
      const fileOverrides = files.map((file) => ({
        ...file,
        customId: input.landlordId,
      }));
      return { landlordId: input.landlordId, [UTFiles]: fileOverrides };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const trpc = createCaller(await createTRPCContext({} as any));
      await trpc.landlord.update({
        id: metadata.landlordId,
        data: { photoUrl: file.url },
      });
      return { uploadedBy: metadata.landlordId };
    }),
} satisfies FileRouter;

export type TFileRouter = typeof fileRouter;
