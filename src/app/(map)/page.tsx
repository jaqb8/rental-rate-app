import { HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/sidebar";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex">
        <Sidebar />
      </main>
    </HydrateClient>
  );
}
