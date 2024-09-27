"use client";

import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { type Review } from "@prisma/client";
import { type z } from "zod";
import ReviewForm, {
  type reviewFormSchema,
} from "@/components/forms/ReviewForm";

export default function EditReviewForm({
  review,
  onEditComplete,
}: {
  review: Omit<Review, "createdAt"> & { createdAt: string };
  onEditComplete: () => void;
}) {
  const { toast } = useToast();

  const { mutate: updateReview, isPending: isUpdatePending } =
    api.review.update.useMutation({
      onSuccess: async () => {
        onEditComplete();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  function onSubmit(values: z.infer<typeof reviewFormSchema>) {
    updateReview({
      id: review.id,
      data: values,
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-primary bg-card-foreground">
      <div className="border-b border-primary bg-primary/10 p-6">
        <h1 className="text-2xl font-bold text-primary-foreground">
          Edit Review
        </h1>
      </div>
      <div className="p-6">
        <ReviewForm
          onSubmit={onSubmit}
          isLoading={isUpdatePending}
          defaultValues={{
            title: review.title,
            content: review.content,
            rating: review.rating,
          }}
        />
      </div>
    </div>
  );
}
