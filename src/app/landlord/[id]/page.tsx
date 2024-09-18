import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import {
  Check,
  Edit,
  ImageIcon,
  MapPin,
  MessageSquare,
  MessageSquarePlus,
  Plus,
  Star,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { UploadFileButton } from "@/components/upload-file-button";
import { revalidatePath } from "next/cache";
import DeleteImageButton from "./DeleteImageButton";

export default async function LandlordPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const trpc = createCaller(await createTRPCContext({} as any));
  const landlord = await trpc.landlord.getById({ id: params.id });

  const placeholderReviews = [];
  // const placeholderReviews = [
  //   {
  //     id: "1",
  //     rating: 4,
  //     comment: "Great landlord, very responsive",
  //     author: "Tenant 1",
  //     date: "2023-05-15",
  //   },
  //   {
  //     id: "2",
  //     rating: 3,
  //     comment: "Decent, but slow to fix issues",
  //     author: "Tenant 2",
  //     date: "2023-04-20",
  //   },
  //   {
  //     id: "3",
  //     rating: 5,
  //     comment: "Excellent! Highly recommended",
  //     author: "Tenant 3",
  //     date: "2023-03-10",
  //   },
  // ];

  if (!landlord) {
    notFound();
  }

  const invalidateLandlordPage = async () => {
    "use server";
    revalidatePath(`/landlord/${landlord.id}`);
  };

  return (
    <div className="w-full">
      {searchParams.created && (
        <Alert className="mb-4">
          <Check className="h-4 w-4" />
          <AlertTitle className="text-lg text-green-600">
            New Landlord Added!
          </AlertTitle>
          <AlertDescription>
            You have successfully added a new landlord to the database. You can
            now view and manage their information on this page.{" "}
            <span className="font-bold">
              Also feel free to leave a review for the landlord{" "}
              <Link
                href={`/landlord/${params.id}/review`}
                className="underline hover:text-blue-500"
              >
                here
              </Link>
              .
            </span>
          </AlertDescription>
        </Alert>
      )}
      <Card className="border-primary bg-card-foreground text-primary-foreground shadow-2xl shadow-primary/80">
        <CardHeader className="space-y-1">
          <div className="flex justify-between">
            <div>
              <div className="text-2xl font-bold">
                {landlord.street} {landlord.streetNumber}{" "}
                {landlord.flatNumber ? ` / ${landlord.flatNumber}` : ""}
              </div>
              <div className="text-xl">
                {landlord.city}, {landlord.zip}
              </div>
            </div>
            <Button variant="secondary">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
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
              <DeleteImageButton
                landlordId={landlord.id}
                onDeleteComplete={invalidateLandlordPage}
              />
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
              <ImageIcon className="h-14 w-14 text-muted" />
              <UploadFileButton
                landlordId={landlord.id}
                onUploadComplete={invalidateLandlordPage}
              >
                Upload Photo
              </UploadFileButton>
            </div>
          )}
        </div>
        <CardContent className="grid gap-6">
          <div>
            {placeholderReviews.length > 0 && (
              <>
                <h3 className="mb-2 font-semibold">Last 3 Reviews</h3>
                <ul className="space-y-4">
                  {placeholderReviews.map((review) => (
                    <li key={review.id} className="rounded-md bg-muted p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium">{review.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {review.date}
                        </span>
                      </div>
                      <div className="mb-1 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-current text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {placeholderReviews.length === 0 && (
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
          <Link className="flex-1" href={`/landlord/${landlord.id}/reviews/new`}>
            <Button className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" /> Write an opinion
            </Button>
          </Link>

          <Link className="flex-1" href={`/?landlordId=${landlord.id}`}>
            <Button className="w-full">
              <MapPin className="mr-2 h-4 w-4" /> Show on Map
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
