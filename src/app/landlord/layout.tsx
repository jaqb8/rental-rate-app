import React from "react";

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="px-8 py-12 md:px-24 lg:px-64">{children}</section>
    </main>
  );
}
