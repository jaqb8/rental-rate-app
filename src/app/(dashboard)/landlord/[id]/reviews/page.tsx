import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { Star } from "lucide-react";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
        className={`h-4 w-4 ${
          index < rating ? "fill-current text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen text-white">
      <h1 className="mb-6 text-3xl font-semibold">{landlordName}</h1>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg bg-secondary p-6 text-secondary-foreground"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">{review.title}</span>
              <span className="text-sm text-muted-foreground">
                {review.createdAt}
              </span>
            </div>
            <div className="mb-2 flex">{renderStars(review.rating)}</div>
            <p>{review.content}</p>
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
