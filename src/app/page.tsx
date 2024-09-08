import Link from "next/link";
import { LatestPost } from "@/app/_components/post";
import { getServerAuthSession } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import Map from "@/components/map";
import { Sidebar } from "@/components/sidebar";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen">
        <Sidebar />
      </main>
    </HydrateClient>
  );
}
