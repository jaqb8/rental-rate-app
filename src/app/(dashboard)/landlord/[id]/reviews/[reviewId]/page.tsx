import { validateRequest } from "@/auth/validate-request";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { Flag, MapPin, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { cache } from "react";
import EditReviewButton from "../../EditLandlordButton";
import { env } from "@/env";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyButton } from "@/components/copy-button";

export default async function ReviewPage({
  params,
}: {
  params: { id: string; reviewId: string };
}) {
  const { user } = await cache(validateRequest)();
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

  const landlordName = `${landlord?.street} ${landlord?.streetNumber}${landlord?.flatNumber ? `/${landlord.flatNumber}` : ""}, ${landlord?.city}, ${landlord.country}`;

  return (
    <div>
      <div className="flex items-center pb-8">
        <MapPin className="h-8 w-8" />
        <Button
          variant="link"
          className="whitespace-normal text-3xl font-semibold text-secondary"
          asChild
        >
          <Link href={`/landlord/${landlord.id}`}>{landlordName}</Link>
        </Button>
      </div>
      <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-primary bg-card-foreground shadow-lg">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={review.userImage} alt={review.username} />
                <AvatarFallback className="bg-muted-foreground">
                  {review.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{review.username}</h2>
                <p className="text-sm text-gray-400">{review.createdAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex">{renderStars(review.rating)}</div>
              {user?.id === review.userId && (
                <EditReviewButton
                  landlordId={landlord.id}
                  reviewId={review.id}
                />
              )}
            </div>
          </div>
          <p className="mb-6">{review.content}</p>
          <Separator className="my-6 bg-primary" />
          <div className="flex items-center justify-between">
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex space-x-4">
                    <Button
                      variant="secondary"
                      className="cursor-default"
                      disabled={env.NEXT_PUBLIC_APP_VERSION !== "1.1.0"}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      <span className="hidden sm:block">Helpful</span>(0)
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={env.NEXT_PUBLIC_APP_VERSION !== "1.1.0"}
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      <span className="hidden sm:block">Not Helpful</span>(0)
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="rounded-lg bg-primary p-2 text-sm">
                    Review likes and dislikes coming soon!
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex space-x-2">
              {env.NEXT_PUBLIC_APP_VERSION === "1.1.0" && (
                <Button variant="secondary" size="icon">
                  <Flag className="h-5 w-5" />
                  <span className="sr-only">Flag review</span>
                </Button>
              )}
              <CopyButton
                value={
                  env.APP_URL + `/landlord/${landlord.id}/reviews/${review.id}`
                }
                message="Link copied to clipboard"
                variant="secondary"
              >
                Share review
              </CopyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
