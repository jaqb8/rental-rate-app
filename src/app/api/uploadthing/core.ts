import { createCaller } from "@/server/api/root";
import { api } from "@/trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTFiles } from "uploadthing/server";
import { z } from "zod";
import { createTRPCContext } from "@/server/api/trpc";

const f = createUploadthing();

export const fileRouter = {
  userAvatarUploader: f({ image: { maxFileSize: "1MB" } })
    .input(z.object({ userId: z.string() }))
    .middleware(async ({ req, input }) => {
      return { userId: input.userId };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      const trpc = createCaller(await createTRPCContext({} as any));
      const user = await trpc.auth.updateUser({
        image: file.url,
      });
      console.log("User updated", user);
      return { uploadedBy: metadata.userId };
    }),
  landlordImgUploader: f({ image: { maxFileSize: "1MB" } })
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
      await api.landlord.updatePhoto({
        id: metadata.landlordId,
        data: { photoUrl: file.url },
      });
      return { uploadedBy: metadata.landlordId };
    }),
} satisfies FileRouter;

export type TFileRouter = typeof fileRouter;
