import Link from "next/link";
import SignUpForm from "./form";
import { getScopedI18n } from "locales/server";

export default async function RegisterPage() {
  const t = await getScopedI18n("Register");

  return (
    <div className="w-full">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-balance text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <SignUpForm />
          <div className="mt-4 text-center text-sm">
            {t("alreadySignedUp")}{" "}
            <Link href="/login" className="underline">
              {t("signIn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
