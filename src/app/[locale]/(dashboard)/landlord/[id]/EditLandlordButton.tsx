"use client";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function EditReviewButton({
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
      variant="ghost"
      className="hover:border hover:border-primary hover:text-primary"
      onClick={() =>
        router.push(`/landlord/${landlordId}/reviews/${reviewId}/edit`)
      }
    >
      <Edit className="h-4 w-4" />
      <span className="sr-only">Edit review</span>
    </Button>
  );
}
