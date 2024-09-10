import { getServerAuthSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
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
