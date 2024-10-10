import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAverageRating(reviews: { rating: number }[]) {
  const ratings = reviews
    .map((review) => review.rating)
    .filter((rating) => rating !== null);
  if (ratings.length === 0) {
    return 0;
  }
  return ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
}

export function capitalizeFirstLetter(string?: string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}
