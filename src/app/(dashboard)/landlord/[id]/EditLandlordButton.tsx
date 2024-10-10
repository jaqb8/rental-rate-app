"use client";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function EditLandlordButton({
  landlordId,
  reviewId,
}: {
  landlordId: string;
  reviewId: string;
}) {
  const router = useRouter();

  return (
    <Button
      size="icon"
      variant="secondary"
      className="hover:bg-secondary-foreground/10"
      onClick={() =>
        router.push(`/landlord/${landlordId}/reviews/${reviewId}/edit`)
      }
    >
      <Edit className="h-4 w-4" />
      <span className="sr-only">Edit review</span>
    </Button>
  );
}
