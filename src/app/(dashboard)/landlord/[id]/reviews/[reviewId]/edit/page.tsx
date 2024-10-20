import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import React from "react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import EditReviewForm from "./form";

export const revalidate = +(process.env.NEXT_REVALIDATION_TIME ?? 0) || 3600;

export default async function EditReview({
  params,
}: {
  params: { id: string; reviewId: string };
}) {
  const trpc = createCaller(await createTRPCContext({} as any));
  const landlord = await trpc.landlord.getById({ id: params.id });
  const review = await trpc.review.getById({ id: params.reviewId });

  if (!landlord || !review) {
    notFound();
  }

  const invalidateLandlordPage = async () => {
    "use server";
    revalidatePath("/landlord/[id]", "layout");
  };

  return (
    <div>
      <EditReviewForm
        review={review}
        onEditComplete={invalidateLandlordPage}
        landlordId={landlord.id}
      />
    </div>
  );
}
