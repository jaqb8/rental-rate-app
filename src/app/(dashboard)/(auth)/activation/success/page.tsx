import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ActivationSuccess() {
  return (
    <main className="container mx-auto max-w-md p-6">
      <div className="flex flex-col items-center">
        <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
        <h2 className="mb-2 text-center text-3xl font-bold">
          Account Activated
        </h2>
        <p className="mb-6 text-center text-gray-400">
          Your email has been verified and your account is now active.
        </p>
        <p className="mb-8 text-center text-gray-300">
          Thank you for joining Rate Your Landlord. You can now access all
          features of our platform.
        </p>
        <div className="w-full space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Go to Home Page</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/profile">Complete Your Profile</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
