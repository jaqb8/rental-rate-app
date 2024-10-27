import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useScopedI18n } from "locales/client";

export const useReviewFormSchema = () => {
  const t = useScopedI18n("AddReviewPage");

  return z.object({
    content: z.string().min(10, {
      message: t("contentMessage"),
    }),
    rating: z
      .number()
      .min(1, {
        message: t("pickRating"),
      })
      .max(5),
  });
};

export type ReviewFormSchema = z.infer<ReturnType<typeof useReviewFormSchema>>;

export default function ReviewForm({
  onSubmit,
  isLoading,
  defaultValues,
}: {
  onSubmit: (data: z.infer<ReturnType<typeof useReviewFormSchema>>) => void;
  isLoading: boolean;
  defaultValues?: z.infer<ReturnType<typeof useReviewFormSchema>>;
}) {
  const reviewFormSchema = useReviewFormSchema();

  const form = useForm<z.infer<ReturnType<typeof useReviewFormSchema>>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          content: "",
          rating: 0,
        },
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [rating, setRating] = useState(defaultValues?.rating ?? 0);
  const t = useScopedI18n("AddReviewPage");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("reviewContent")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("reviewContentDescription")}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("reviewContentDescription2")}
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
              <FormLabel>{t("rating")}</FormLabel>
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
              <FormDescription>{t("ratingDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? t("processing") : t("submit")}
        </Button>
      </form>
    </Form>
  );
}
