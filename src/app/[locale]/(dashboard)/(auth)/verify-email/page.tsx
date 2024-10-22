import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmail() {
  return (
    <main className="container mx-auto flex max-w-md flex-col gap-2 p-6">
      <h2 className="mb-4 text-center text-3xl font-bold">Verify Your Email</h2>
      <p className="pb-6 text-gray-400">
        A verification link has been sent to your email address. Please check
        your inbox and click on the link to verify your account.
      </p>
      <div className="mb-6 rounded-lg bg-primary p-4 text-sm">
        <p>
          Didn&apos;t receive the email? Check your spam folder or click below
          to resend.
        </p>
      </div>
      <Button variant="default" className="w-full">
        Resend Verification Email
      </Button>
      <p className="pt-2 text-center text-gray-400">
        Return to{" "}
        <Link href="/" className="text-purple-400 hover:underline">
          Home page
        </Link>
      </p>
    </main>
  );
}
