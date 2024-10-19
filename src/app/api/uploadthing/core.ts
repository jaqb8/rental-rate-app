import { api } from "@/trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTFiles } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

export const fileRouter = {
  userAvatarUploader: f({ image: { maxFileSize: "1MB" } })
    .input(z.object({ userId: z.string() }))
    .middleware(async ({ req, input }) => {
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
    .middleware(async ({ req, input }) => {
      // const fileOverrides = files.map((file) => ({
      //   ...file,
      //   customId: input.landlordId,
      // }));
      return { landlordId: input.landlordId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // const res = await api.landlord.updatePhoto({
      //   id: metadata.landlordId,
      //   data: { photoUrl: file.url },
      // });
      // console.log(res);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type TFileRouter = typeof fileRouter;
