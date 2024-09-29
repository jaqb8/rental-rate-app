import { HydrateClient } from "@/trpc/server";
import { Sidebar } from "@/components/sidebar";
import { validateRequest } from "@/auth/validate-request";

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <HydrateClient>
      <main className="flex">
        <Sidebar user={user} />
      </main>
    </HydrateClient>
  );
}
