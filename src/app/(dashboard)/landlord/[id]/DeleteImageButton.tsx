"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { type Landlord } from "@prisma/client";
import { Loader2, Trash } from "lucide-react";

export default function DeleteImageButton({
  landlord,
  onDeleteComplete,
}: {
  landlord: Landlord;
  onDeleteComplete: () => void;
}) {
  const { toast } = useToast();
  const { mutate: deleteImage, isPending: isPendingDeleteImage } =
    api.landlord.deleteImage.useMutation({
      onSuccess: () => {
        onDeleteComplete();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  return (
    <Button
      size="icon"
      variant="outline"
      className="absolute right-3 top-3"
      onClick={() =>
        deleteImage({ id: landlord.id, key: landlord.photoKey ?? "" })
      }
      disabled={isPendingDeleteImage}
    >
      {isPendingDeleteImage ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-900" />
      ) : (
        <Trash className="h-4 w-4 text-gray-900" />
      )}
    </Button>
  );
}
