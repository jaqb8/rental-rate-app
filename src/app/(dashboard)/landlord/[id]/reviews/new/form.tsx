"use client";

import { type Landlord } from "@prisma/client";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import ReviewForm, {
  type reviewFormSchema,
} from "@/components/forms/ReviewForm";
import { type z } from "zod";

export default function AddReviewForm({
  landlord,
  onAddComplete,
}: {
  landlord: Landlord;
  onAddComplete: (id: string) => void;
}) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const { mutate: createReview, isPending: isCreatePending } =
    api.review.create.useMutation({
      onSuccess: async (data) => {
        await utils.review.getAvgRatingByLandlordId.invalidate({
          landlordId: landlord.id,
        });
        onAddComplete(data.id);
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
    createReview({
      ...values,
      landlordId: landlord.id,
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-primary bg-card-foreground">
      <div className="border-b border-primary bg-primary/10 p-6">
        <h1 className="mb-2 text-2xl font-bold text-primary-foreground">
          Add Review
        </h1>
        <p className="text-lg font-semibold text-primary-foreground">
          {landlord.street} {landlord.streetNumber}
          {landlord.flatNumber && ` / ${landlord.flatNumber}`}
        </p>
        <div className="flex flex-col">
          <span className="text-primary-foreground">
            {landlord.zip} {landlord.city}
          </span>
          <span className="text-primary-foreground/80">{landlord.country}</span>
        </div>
      </div>
      <div className="p-6">
        <ReviewForm onSubmit={onSubmit} isLoading={isCreatePending} />
      </div>
    </div>
  );
}
