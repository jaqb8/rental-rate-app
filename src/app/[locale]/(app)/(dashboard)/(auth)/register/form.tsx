"use client";

import { signUp } from "@/auth/actions";
import { Button } from "@/components/ui/button";
import { signUpFormSchema } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import Image from "next/image";
import { SubmitButton } from "../components/submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { useScopedI18n } from "locales/client";

export default function SignUpForm() {
  const t = useScopedI18n("Register");
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      password2: "",
    },
  });

  const [state, formAction] = useFormState(signUp, null);

  return (
    <>
      <Form {...form}>
        <form action={formAction} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("confirmPasswordPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {state?.fieldError ? (
            <p className="flex flex-col space-y-1 rounded-lg border border-destructive bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {Object.values(state.fieldError).map((err) => (
                <span className="ml-1" key={err}>
                  {err}
                </span>
              ))}
            </p>
          ) : state?.formError ? (
            <p className="rounded-lg border border-destructive bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
              {state?.formError}
            </p>
          ) : null}
          <SubmitButton className="w-full">{t("signUp")}</SubmitButton>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#121212] px-2 text-muted-foreground">
            {t("or")}
          </span>
        </div>
      </div>
      <Button
        disabled={env.NEXT_PUBLIC_APP_VERSION !== "1.1.0"}
        variant="secondary"
        className="w-full"
      >
        <Image
          src="./google.svg"
          alt="Google icon"
          width={20}
          height={20}
          className="mr-1"
        />
        {env.NEXT_PUBLIC_APP_VERSION !== "1.1.0"
          ? t("loginWithGoogleCommingSoon")
          : t("loginWithGoogle")}
      </Button>
    </>
  );
}
