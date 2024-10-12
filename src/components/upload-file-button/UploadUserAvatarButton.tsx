"use client";

import { Loader2, Upload } from "lucide-react";
import { UploadButton } from "../uploadthing";
import { useToast } from "@/hooks/use-toast";

export default function UploadUserAvatarButton({
  children,
  userId,
  onUploadComplete,
}: {
  children: React.ReactNode;
  userId: string;
  onUploadComplete: (res: any) => void;
}) {
  const { toast } = useToast();
  return (
    <div>
      <UploadButton
        input={{
          userId,
        }}
        appearance={{
          button:
            "ut-ready:bg-secondary ut-ready:text-secondary-foreground ut-ready:shadow-sm ut-ready:hover:bg-secondary/80 focus-within:ring-0 ut-uploading:cursor-not-allowed bg-secondary after:ut-uploading:bg-green-500 after:ut-uploading:bg-opacity-50 font-medium",
          allowedContent: "hidden",
        }}
        endpoint="userAvatarUploader"
        content={{
          button: ({ isUploading }) => (
            <div className="flex items-center space-x-2 text-sm">
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {children}
            </div>
          ),
        }}
        onBeforeUploadBegin={(files) => {
          if (files[0]) {
            const fileExtension = files[0].name.split(".").pop();
            files[0] = new File([files[0]], `${userId}.${fileExtension}`, {
              type: files[0].type,
            });
          }
          return files;
        }}
        onClientUploadComplete={onUploadComplete}
        onUploadError={(error) => {
          let message = error.message;
          if (error.message.includes("FileSizeMismatch")) {
            message = "File size is too big (max 1MB)";
          }
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
        }}
      />
    </div>
  );
}
