"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { type Landlord } from "@prisma/client";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  rating: z.number().min(1).max(5),
});

export default function AddReviewForm({ landlord }: { landlord: Landlord }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      rating: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send this data to your API
    console.log(values);
  }

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-lg bg-card-foreground border border-primary shadow-2xl shadow-primary/80">
      <div className="border-b border-primary bg-primary/10 p-6">
        <h1 className="mb-2 text-2xl font-bold text-primary-foreground">
          Add Review
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a title for your review"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief title summarizing your experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience with this landlord"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about your experience with the landlord.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${
                            star <= (hoveredRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => {
                            setRating(star);
                            field.onChange(star);
                          }}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Rate your landlord from 1 to 5 stars.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Review</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
