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
import React from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { login } from "@/auth/actions";
import { type z } from "zod";
import { useFormState, useFormStatus } from "react-dom";
import { loginFormSchema } from "@/lib/schemas/login";
import { Sub } from "@radix-ui/react-dropdown-menu";
import { SubmitButton } from "./submitButton";

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [state, formAction] = useFormState(login, null);
  const { pending } = useFormStatus();

  // function onSubmit(formData: z.infer<typeof loginFormSchema>) {
  //   formAction(formData);
  // }

  return (
    <>
      <Form {...form}>
        <form
          action={formAction}
          // onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
      <Button variant="secondary" className="w-full">
        <Image
          src="./google.svg"
          alt="Google icon"
          width={20}
          height={20}
          className="mr-2"
        />
        Login with Google
      </Button>
    </>
  );
}
