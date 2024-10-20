"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { login } from "@/auth/actions";
import { type z } from "zod";
import { useFormState } from "react-dom";
import { loginFormSchema } from "@/lib/schemas/auth";
import { SubmitButton } from "../components/submit-button";
import { useSearchParams } from "next/navigation";
import { useDialogStore } from "@/stores/dialog";
import { env } from "@/env";

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const { setDialogOpen } = useDialogStore();
  useEffect(() => {
    if (searchParams.get("dialog")) {
      setDialogOpen(searchParams.get("dialog") === "true");
    }
  }, [setDialogOpen, searchParams]);

  const loginWithRedirect = login.bind(
    null,
    searchParams.get("redirect") ?? "/",
  );
  const [state, formAction] = useFormState(loginWithRedirect, null);

  return (
    <>
      <Form {...form}>
        <form action={formAction} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Your email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your password"
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
          <SubmitButton className="w-full">Login</SubmitButton>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#121212] px-2 text-muted-foreground">
            Or continue with
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
          className="mr-2"
        />
        Login with Google coming soon!
      </Button>
    </>
  );
}
