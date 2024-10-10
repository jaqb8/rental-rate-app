import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import {
  CircleCheck,
  Edit,
  Ellipsis,
  ImageIcon,
  MapPin,
  MessageSquare,
  MessageSquarePlus,
  Plus,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { UploadFileButton } from "@/components/upload-file-button";
import { revalidatePath } from "next/cache";
import DeleteImageButton from "./DeleteImageButton";
import DeleteLandlordAlert from "./DeleteLandlordAlert";
import { validateRequest } from "@/auth/validate-request";
import { cache } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditLandlordButton from "./EditLandlordButton";

export default async function LandlordPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { user } = await cache(validateRequest)();
  const trpc = createCaller(await createTRPCContext({} as any));
  const landlord = await trpc.landlord.getById({ id: params.id });
  const reviews = await trpc.review.getByLandlordId({
    landlordId: params.id,
    limit: 3,
  });
  const { avgRating, count: reviewCount } =
    await trpc.review.getAvgRatingByLandlordId({
      landlordId: params.id,
    });

  if (!landlord) {
    notFound();
  }

  const invalidateLandlordPage = async () => {
    "use server";
    revalidatePath(`/landlord/${landlord.id}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />,
      );
    }
    return stars;
  };

  return (
    <>
      {searchParams.created && (
        <Alert className="mb-4 border border-primary bg-primary/30 text-secondary">
          <div className="flex items-center gap-1">
            <CircleCheck className="h-5 w-5 font-bold text-primary" />
            <AlertTitle className="mb-0 text-lg font-bold">
              New Landlord Added!
            </AlertTitle>
          </div>
          <AlertDescription className="ps-6 font-thin">
            You have successfully added a new landlord to the database. You can
            now view and manage their information on this page.{" "}
            <span className="font-normal">
              Also feel free to leave a review for the landlord{" "}
              <Link
                href={`/landlord/${params.id}/reviews/new`}
                className="underline hover:text-blue-500"
              >
                here
              </Link>
              .
            </span>
          </AlertDescription>
          <Link
            href={`/landlord/${params.id}/`}
            className="absolute right-3 top-3 text-secondary hover:text-primary"
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </Link>
        </Alert>
      )}
      <Card className="border-primary bg-card-foreground text-primary-foreground">
        <CardHeader className="space-y-1">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">
                {landlord.street} {landlord.streetNumber}{" "}
                {landlord.flatNumber ? ` / ${landlord.flatNumber}` : ""}
              </div>
              <div className="text-xl">
                {landlord.city}, {landlord.zip}
              </div>
              <div className="flex items-center gap-2 pt-3 text-secondary">
                <div className="">{avgRating.toFixed(1)}</div>
                <div className="flex">{renderStars(avgRating)}</div>
                <div>({reviewCount})</div>
              </div>
            </div>
            {user?.id === landlord.userId && (
              <DeleteLandlordAlert landlordId={landlord.id} />
            )}
          </div>
        </CardHeader>
        <div className="relative mb-6 h-48 w-full border-y border-primary bg-primary/30">
          {landlord.photoUrl ? (
            <>
              <Image
                src={landlord.photoUrl}
                alt={`Photo of ${landlord.street} ${landlord.streetNumber}`}
                fill={true}
                className="object-cover"
              />
              {user?.id === landlord.userId && (
                <DeleteImageButton
                  landlordId={landlord.id}
                  onDeleteComplete={invalidateLandlordPage}
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
              <ImageIcon className="h-14 w-14 text-muted" />
              {user?.id === landlord.userId && (
                <UploadFileButton
                  landlordId={landlord.id}
                  onUploadComplete={invalidateLandlordPage}
                >
                  Upload Photo
                </UploadFileButton>
              )}
            </div>
          )}
        </div>
        <CardContent className="grid gap-6">
          <div>
            {reviews.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="ps-2 font-semibold">Last Reviews</span>
                  <Link href={`/landlord/${landlord.id}/reviews`}>
                    <Button className="text-base" variant="link">
                      <Ellipsis className="mr-1 h-5 w-5" />
                      Show more
                    </Button>
                  </Link>
                </div>
                <ul className="space-y-4">
                  {reviews.map((review) => (
                    <li
                      key={review.id}
                      className="rounded-md bg-secondary p-3 text-secondary-foreground hover:bg-secondary/95"
                    >
                      <Link
                        href={`/landlord/${landlord.id}/reviews/${review.id}`}
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <div className="flex gap-3">
                            <Avatar>
                              <AvatarImage
                                src={review.userImage}
                                alt={review.username}
                              />
                              <AvatarFallback className="bg-muted-foreground/30">
                                {review.username?.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">
                                {review.username}
                              </span>
                              <div className="mb-1 flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "fill-current text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {review.createdAt}
                            </span>
                            {user?.id === review.userId && (
                              <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="text-secondary-foreground hover:text-primary"
                              >
                                <EditLandlordButton
                                  landlordId={landlord.id}
                                  reviewId={review.id}
                                />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="pt-2 text-sm">{review.content}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {reviews.length === 0 && (
              <Card className="w-full border-primary bg-primary/30">
                <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
                  <MessageSquarePlus className="h-12 w-12 text-muted" />
                  <p className="text-center text-lg font-medium text-muted">
                    No reviews yet
                  </p>
                  <Link
                    href={`/landlord/${landlord.id}/reviews/new`}
                    className="mt-2"
                  >
                    <Button variant="secondary">
                      <Plus className="me-1 h-5 w-5" />
                      Add first opinion
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          <Link
            className="flex-1"
            href={`/landlord/${landlord.id}/reviews/new`}
          >
            <Button className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" /> Write an opinion
            </Button>
          </Link>

          <Link className="flex-1" href={`/?landlordId=${landlord.id}`}>
            <Button className="w-full" variant="secondary">
              <MapPin className="mr-2 h-4 w-4" /> Show on Map
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
