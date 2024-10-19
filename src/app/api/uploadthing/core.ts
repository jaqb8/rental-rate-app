import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const fileRouter = {
  userAvatarUploader: f({ image: { maxFileSize: "1MB" } })
    .input(z.object({ userId: z.string() }))
    .middleware(async ({ input }) => {
      return { userId: input.userId };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
  landlordImgUploader: f({ image: { maxFileSize: "1MB" } })
    .input(
      z.object({
        landlordId: z.string(),
      }),
    )
    .middleware(async ({ input }) => {
      return { landlordId: input.landlordId };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type TFileRouter = typeof fileRouter;
