import { createCaller } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import React from 'react'
import AddReviewForm from './form';
import { notFound } from 'next/navigation';

export default async function AddReview({ params }: { params: { id: string } }) {
    const trpc = createCaller(await createTRPCContext({} as any));
    const landlord = await trpc.landlord.getById({ id: params.id });

  if (!landlord) {
    notFound();
  }

  return (
    <div>
      <AddReviewForm landlord={landlord} />
    </div>
  )
}
