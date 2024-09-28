import { HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex">
        <Sidebar />
      </main>
    </HydrateClient>
  );
}
