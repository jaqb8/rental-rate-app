import { getServerAuthSession } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
