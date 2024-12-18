"use client";

import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { type Review } from "@prisma/client";
import { type z } from "zod";
import ReviewForm, {
  type ReviewFormSchema,
} from "@/components/forms/ReviewForm";
import { useRouter } from "next/navigation";
import { useScopedI18n } from "locales/client";

export default function EditReviewForm({
  landlordId,
  review,
  onEditComplete,
}: {
  landlordId: string;
  review: Omit<Review, "createdAt"> & { createdAt: string };
  onEditComplete: () => void;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const t = useScopedI18n("AddReviewPage");

  const { mutate: updateReview, isPending: isUpdatePending } =
    api.review.update.useMutation({
      onSuccess: async () => {
        onEditComplete();
        router.push(`/landlord/${landlordId}/reviews/${review.id}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  function onSubmit(values: ReviewFormSchema) {
    updateReview({
      id: review.id,
      data: values,
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-primary bg-card-foreground">
      <div className="border-b border-primary bg-primary/10 p-6">
        <h1 className="text-2xl font-bold text-primary-foreground">
          {t("editTitle")}
        </h1>
      </div>
      <div className="p-6">
        <ReviewForm
          onSubmit={onSubmit}
          isLoading={isUpdatePending}
          defaultValues={{
            content: review.content,
            rating: review.rating,
          }}
        />
      </div>
    </div>
  );
}
