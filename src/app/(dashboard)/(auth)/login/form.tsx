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
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export const loginFormScheme = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password is required.",
    })
    .max(255),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginFormScheme>>({
    resolver: zodResolver(loginFormScheme),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const { mutate: login, isPending: isLoading } = api.auth.login.useMutation({
    onSuccess: () => router.push("/"),
  });

  function onSubmit(formData: z.infer<typeof loginFormScheme>) {
    login(formData);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading && (
              <>
                <Loader2 className="mr-2 animate-spin" />
                <span>Processing...</span>
              </>
            )}
            {!isLoading && "Login"}
          </Button>
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
      <Button disabled={isLoading} variant="secondary" className="w-full">
        <Image
          src="./google.svg"
          alt="Google icon"
          width={20}
          height={20}
          className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
        />
        {isLoading ? "Processing..." : "Login with Google"}
      </Button>
    </>
  );
}
