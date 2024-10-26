import { Button } from "@/components/ui/button";
import { getScopedI18n } from "locales/server";
import Link from "next/link";

export default async function VerifyEmail() {
  const t = await getScopedI18n("VerifyEmail");

  return (
    <main className="container mx-auto flex max-w-md flex-col gap-2 p-6">
      <h2 className="mb-4 text-center text-3xl font-bold">{t("title")}</h2>
      <p className="pb-6 text-gray-400">{t("message")}</p>
      <div className="mb-6 rounded-lg bg-primary p-4 text-sm">
        <p>{t("didntReceiveEmail")}</p>
      </div>
      <Button variant="default" className="w-full">
        {t("resendEmail")}
      </Button>
      <p className="pt-2 text-center text-gray-400">
        {t("returnToHomePage")}
        <Link href="/" className="text-primary hover:underline">
          {t("homePage")}
        </Link>
      </p>
    </main>
  );
}
