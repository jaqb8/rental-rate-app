import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  CircleCheck,
  Ellipsis,
  ImageIcon,
  MapPin,
  MessageSquare,
  MessageSquarePlus,
  Pencil,
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
import EditReviewButton from "./EditLandlordButton";
import { api } from "@/trpc/server";
import { CopyButton } from "@/components/copy-button";
import { env } from "@/env";
import { getScopedI18n } from "locales/server";

export const revalidate = +(process.env.NEXT_REVALIDATION_TIME ?? 0) || 3600;

export default async function LandlordPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const t = await getScopedI18n("LandlordPage");
  const { user } = await cache(validateRequest)();
  const landlord = await api.landlord.getById({ id: params.id });
  const reviews = await api.review.getByLandlordId({
    landlordId: params.id,
    limit: 3,
  });
  const { avgRating, count: reviewCount } =
    await api.review.getAvgRatingByLandlordId({
      landlordId: params.id,
    });

  if (!landlord) {
    notFound();
  }

  const invalidateLandlordPage = async () => {
    "use server";
    revalidatePath(`/landlord/${landlord.id}`);
  };

  const onUploadComplete = async (res: { url: string; key: string }[]) => {
    "use server";
    if (Array.isArray(res) && res.length > 0 && res[0]) {
      await api.landlord.updatePhoto({
        id: landlord.id,
        data: {
          photoUrl: res[0].url,
          photoKey: res[0].key,
        },
      });
      await invalidateLandlordPage();
    } else {
      throw new Error("Something went wrong while uploading the image");
    }
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
              {t("alert.title")}{" "}
            </AlertTitle>
          </div>
          <AlertDescription className="ps-6 font-thin">
            {t("alert.message")}
            <span className="font-normal">
              {t("alert.cta")}{" "}
              <Link
                href={`/landlord/${params.id}/reviews/new`}
                className="underline hover:text-blue-500"
              >
                {t("alert.here")}
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
              <div className="flex flex-col gap-2">
                <Button variant="secondary" size="sm" asChild>
                  <Link href={`/landlord/${landlord.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("edit")}
                  </Link>
                </Button>
                <DeleteLandlordAlert landlordId={landlord.id} />
              </div>
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
                  landlord={landlord}
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
                  onUploadComplete={onUploadComplete}
                >
                  {t("uploadPhoto")}
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
                  <span className="ps-2 font-semibold">{t("lastReviews")}</span>
                  <Link href={`/landlord/${landlord.id}/reviews`}>
                    <Button className="text-base" variant="link">
                      <Ellipsis className="mr-1 h-5 w-5" />
                      {t("showMore")}
                    </Button>
                  </Link>
                </div>
                <ul className="space-y-4">
                  {reviews.map((review) => (
                    <li
                      key={review.id}
                      className="rounded-md bg-secondary p-3 text-secondary-foreground hover:bg-secondary/95"
                    >
                      <div className="mb-1 flex items-start justify-between md:items-center">
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
                        <div className="flex flex-col items-end gap-2 md:flex-row md:items-center">
                          <Link
                            href={`/landlord/${landlord.id}/reviews/${review.id}`}
                          >
                            <span className="text-sm text-muted-foreground hover:underline">
                              {review.createdAt}
                            </span>
                          </Link>
                          {user?.id === review.userId && (
                            <EditReviewButton
                              landlordId={landlord.id}
                              reviewId={review.id}
                            />
                          )}
                        </div>
                      </div>
                      <p className="pt-2 text-sm">{review.content}</p>
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
                    {t("noReviews")}
                  </p>
                  <Link
                    href={`/landlord/${landlord.id}/reviews/new`}
                    className="mt-2"
                  >
                    <Button variant="secondary">
                      <Plus className="me-1 h-5 w-5" />
                      {t("addFirstOpinion")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col justify-between gap-2 md:flex-row">
          <Link
            className="w-full"
            href={`/landlord/${landlord.id}/reviews/new`}
          >
            <Button className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" /> {t("writeAnOpinion")}
            </Button>
          </Link>

          <Link className="w-full" href={`/?landlordId=${landlord.id}`}>
            <Button className="w-full" variant="secondary">
              <MapPin className="mr-2 h-4 w-4" /> {t("showOnMap")}
            </Button>
          </Link>

          <CopyButton
            value={env.APP_URL + `/landlord/${landlord.id}`}
            className="w-full md:w-32"
            variant="secondary"
            message={t("copied")}
          >
            {t("share")}
          </CopyButton>
        </CardFooter>
      </Card>
    </>
  );
}
