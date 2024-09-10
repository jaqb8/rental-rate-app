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
import { Check, Edit, MapPin, MessageSquare, Star } from "lucide-react";
import Link from "next/link";

export default async function LandlordPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const trpc = createCaller(await createTRPCContext({} as any));
  const landlord = await trpc.landlord.getById({ id: params.id });

  const placeholderReviews = [
    {
      id: "1",
      rating: 4,
      comment: "Great landlord, very responsive",
      author: "Tenant 1",
      date: "2023-05-15",
    },
    {
      id: "2",
      rating: 3,
      comment: "Decent, but slow to fix issues",
      author: "Tenant 2",
      date: "2023-04-20",
    },
    {
      id: "3",
      rating: 5,
      comment: "Excellent! Highly recommended",
      author: "Tenant 3",
      date: "2023-03-10",
    },
  ];

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
      <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=1234`} alt='123' />
            <AvatarFallback>UL</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">Unknown Landlord</CardTitle>
            <p className="text-sm text-muted-foreground">Landlord ID: {landlord?.id}</p>
          </div>
        </div>
      </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col space-y-1">
            <h3 className="font-semibold">Address</h3>
            <p>{landlord?.street}</p>
            <p>
              {landlord?.city}
              {landlord?.zip ? `, ${landlord?.zip}` : ""}
            </p>
          </div>
          <div>
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
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button className="flex-1" variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" /> Write a Review
          </Button>
          <Button className="flex-1" variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
          <Button className="flex-1" variant="outline">
            <MapPin className="mr-2 h-4 w-4" /> Show on Map
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
