import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import React from "react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import EditLandlordForm from "./form";

export default async function EditLandlord({
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
      <EditLandlordForm
        landlord={landlord}
        onAddComplete={invalidateLandlordPage}
      />
    </div>
  );
}
