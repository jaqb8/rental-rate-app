import { getScopedI18n } from "locales/server";
import LoginForm from "./form";
import Link from "next/link";

export default async function LoginPage() {
  const t = await getScopedI18n("Login");

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
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            {t("noAccount")}
            <Link href="/register" className="underline">
              {t("signUp")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
