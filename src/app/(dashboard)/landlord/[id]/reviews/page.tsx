import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { Flag, MapPin, Share2, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default async function LandlordReviewsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | undefined>;
}) {
  const trpc = createCaller(await createTRPCContext({} as any));
  const {
    results: reviews,
    count,
    pageSize,
  } = await trpc.review.getAll({
    page: parseInt(searchParams.page ?? "1"),
    pageSize: 5,
    landlordId: params.id,
  });
  const landlord = await trpc.landlord.getById({ id: params.id });
  const landlordName = `${landlord?.street} ${landlord?.streetNumber}${landlord?.flatNumber ? `/${landlord.flatNumber}` : ""}, ${landlord?.city}`;

  const reviewsPerPage = pageSize;
  const totalPages = Math.ceil(count / reviewsPerPage);
  const currentPage = parseInt(searchParams.page ?? "1");

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
    <div className="min-h-screen text-white">
      <h1 className="mb-6 flex items-center text-3xl font-semibold">
        <MapPin className="h-8 w-8" />
        <Button
          variant="link"
          className="text-3xl font-semibold text-secondary"
          asChild
        >
          <Link href={`/landlord/${params.id}`}>{landlordName}</Link>
        </Button>
      </h1>
      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border border-primary bg-card-foreground p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={review.userImage} alt={review.username} />
                  <AvatarFallback className="bg-muted-foreground">
                    {review.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium">{review.username}</span>
                  <div className="text-sm text-gray-400 hover:underline">
                    <Link href={`/landlord/${params.id}/reviews/${review.id}`}>
                      {review.createdAt}
                    </Link>
                  </div>
                </div>
              </div>
              <span className="flex">{renderStars(review.rating)}</span>
            </div>
            <p>{review.content}</p>
            <Separator className="my-3 bg-primary" />
            <div className="flex justify-between text-secondary">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />0
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" />0
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <div className="rounded-lg bg-primary p-2 text-sm">
                      Review likes and dislikes coming soon!
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex gap-2">
                {env.NEXT_PUBLIC_APP_VERSION === "1.1.0" && (
                  <Button variant="default" size="sm">
                    <Flag className="mr-1 h-4 w-4" />
                    Report
                  </Button>
                )}
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/landlord/${params.id}/reviews/${review.id}`}>
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${Math.max(currentPage - 1, 1)}`}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href={`?page=${index + 1}`}
                  isActive={currentPage === index + 1}
                  className="text-secondary-foreground"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?page=${Math.min(currentPage + 1, totalPages)}`}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
