"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Star } from "lucide-react";
import { type Landlord } from "@prisma/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  street: z.string().min(2, {
    message: "Street must be at least 2 characters.",
  }),
  streetNumber: z.string().min(1, {
    message: "Street number is required.",
  }),
  flatNumber: z.string().optional(),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  zip: z.string().min(2, {
    message: "Zip code must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
});

export default function EditLandlordForm({
  landlord,
  onAddComplete,
}: {
  landlord: Landlord;
  onAddComplete: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const utils = api.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: "",
      streetNumber: "",
      flatNumber: "",
      city: "",
      zip: "",
      country: "",
    },
  });

  useEffect(() => {
    form.reset({
      street: landlord.street,
      streetNumber: landlord.streetNumber,
      flatNumber: landlord?.flatNumber ?? "",
      city: landlord.city,
      zip: landlord.zip,
      country: landlord.country,
    });
  }, []);

  const { mutate: updateLandlord, isPending: isUpdatePending } =
    api.landlord.update.useMutation({
      onSuccess: async (data) => {
        await utils.landlord.getById.invalidate({
          id: landlord.id,
        });
        router.push(`/landlord/${landlord.id}/`);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateLandlord({
      data: values,
      id: landlord.id,
    });
    onAddComplete();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-primary bg-card-foreground">
      <div className="border-b border-primary bg-primary/10 p-6">
        <h1 className="mb-2 text-2xl font-bold text-primary-foreground">
          Edit Landlord
        </h1>
        <p className="text-lg font-semibold text-primary-foreground">
          {landlord.street} {landlord.streetNumber}
          {landlord.flatNumber && ` / ${landlord.flatNumber}`}
        </p>
        <div className="flex flex-col">
          <span className="text-primary-foreground">
            {landlord.zip} {landlord.city}
          </span>
          <span className="text-primary-foreground/80">{landlord.country}</span>
        </div>
      </div>
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="w-3/5 flex-grow">
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="streetNumber"
                render={({ field }) => (
                  <FormItem className="w-1/5 flex-grow">
                    <FormLabel>Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flatNumber"
                render={({ field }) => (
                  <FormItem className="w-1/5 flex-grow">
                    <FormLabel>Flat Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem className="w-1/3 flex-grow">
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-2/3 flex-grow">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isUpdatePending} type="submit">
              {isUpdatePending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUpdatePending ? "Processing..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
