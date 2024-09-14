import { type TFileRouter } from "@/app/api/uploadthing/core";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<TFileRouter>();
export const UploadDropzone = generateUploadDropzone<TFileRouter>();
