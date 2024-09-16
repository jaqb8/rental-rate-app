import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <header className="flex justify-between items-center px-8 py-3 bg-primary/10 border-b border-primary">
        <Link href="/">
          <Button variant="default">
            <ChevronLeft /> Go Back
          </Button>
        </Link>
      </header>
      <section className="px-8 md:px-24 lg:px-64 py-12">{children}</section>
    </main>
  );
}
