import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { Flag, MapPin, Share2, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function ReviewPage({
  params,
}: {
  params: { id: string; reviewId: string };
}) {
  const trpc = createCaller(await createTRPCContext({} as any));
  const landlordPromise = trpc.landlord.getById({ id: params.id });
  const reviewPromise = trpc.review.getById({ id: params.reviewId });
  const [landlord, review] = await Promise.all([
    landlordPromise,
    reviewPromise,
  ]);

  if (!review || !landlord) {
    notFound();
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-6 w-6 ${
          index < rating ? "fill-current text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="">
      <div className="mb-4 flex items-center text-gray-400">
        <MapPin className="mr-2 h-5 w-5" />
        <Button variant="link" asChild className="p-0 text-xl text-gray-400">
          <Link href={`/landlord/${landlord.id}`}>
            {landlord.street} {landlord.streetNumber}
            {landlord.flatNumber ? "/" + landlord.flatNumber : ""},{" "}
            {landlord.zip} {landlord.city}, {landlord.country}
          </Link>
        </Button>
      </div>
      <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-primary bg-card-foreground shadow-lg">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={review.userImage} alt={review.title} />
                <AvatarFallback className="bg-muted-foreground">
                  {review.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{review.username}</h2>
                <p className="text-sm text-gray-400">{review.createdAt}</p>
              </div>
            </div>
            <div className="flex">{renderStars(review.rating)}</div>
          </div>
          <p className="mb-6 text-gray-300">{review.content}</p>
          <Separator className="my-6" />
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Button variant="secondary">
                <ThumbsUp className="mr-2 h-4 w-4" />
                <span className="hidden sm:block">Helpful</span>(0)
              </Button>
              <Button variant="secondary">
                <ThumbsDown className="mr-2 h-4 w-4" />
                <span className="hidden sm:block">Not Helpful</span>(0)
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" size="icon">
                <Flag className="h-5 w-5" />
                <span className="sr-only">Flag review</span>
              </Button>
              <Button variant="secondary" size="icon">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share review</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
