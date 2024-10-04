import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

export default function ActivationFailure() {
  return (
    <main className="container mx-auto max-w-md p-6">
      <div className="flex flex-col items-center">
        <CircleX className="mb-4 h-16 w-16 text-red-500" />
        <h2 className="mb-2 text-center text-3xl font-bold">
          Account Activation Failed
        </h2>
        <p className="mb-6 text-center text-gray-400">
          Something went wrong while activating your account. Please try again.
        </p>
        <p className="mb-8 text-center text-gray-300">
          If you continue to have issues, please contact support.
        </p>
        <div className="w-full space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Resend Verification Email</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/">Go to Home Page</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
