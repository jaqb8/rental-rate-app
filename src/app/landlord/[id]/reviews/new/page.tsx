import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import React from "react";
import AddReviewForm from "./form";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AddReview({
  params,
}: {
  params: { id: string };
}) {
  const trpc = createCaller(await createTRPCContext({} as any));
  const landlord = await trpc.landlord.getById({ id: params.id });

  if (!landlord) {
    notFound();
  }

  const invalidateLandlordPage = async () => {
    "use server";
    revalidatePath(`/landlord/${landlord.id}`);
  };

  return (
    <div>
      <AddReviewForm
        landlord={landlord}
        onAddComplete={invalidateLandlordPage}
      />
    </div>
  );
}
