import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { House, Star } from "lucide-react";
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
  return (
    <div className="px-36 w-full">
      {searchParams.created && (
        <Alert className="mb-4">
          <House className="h-4 w-4" />
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
          <CardTitle>id: {landlord?.id}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span>
              Street: <strong>{landlord?.street}</strong>
            </span>
            <span>
              City: <strong>{landlord?.city}</strong>
            </span>
            <span>
              State: <strong>{landlord?.state}</strong>
            </span>
            <span>
              Zip: <strong>{landlord?.zip}</strong>
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold">Last Reviews</h3>
            <div className="flex flex-col">
              <span>Review 1</span>
              <span>Review 2</span>
              <span>Review 3</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline">
            <Star className="h-4 w-4 mr-2" /> Review
          </Button>
          <Button variant="outline">Edit</Button>
          <Button variant="outline">Show on Map</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
