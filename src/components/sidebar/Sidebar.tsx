"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  House,
  Info,
  Loader2,
  MapPinIcon,
  MenuIcon,
  MessageSquare,
  Plus,
  SearchIcon,
  SettingsIcon,
  Star,
  UserIcon,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import Map from "@/components/map";
import AutosuggestInput from "../autosuggest-input";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { useSelectedQuery, useSelectedLandlord } from "@/stores";

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
  zipCode: z.string().min(2, {
    message: "Zip code must be at least 2 characters.",
  }),
});

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: "",
      streetNumber: "",
      flatNumber: "",
      city: "",
      zipCode: "",
    },
  });
  const { toast } = useToast();
  const router = useRouter();
  const { setSelectedQuery, selectedQuery } = useSelectedQuery();
  const { selectedLandlord } = useSelectedLandlord();

  const [{ avgRating, count: reviewCount }, avgRatingQuery] =
    api.review.getAvgRatingByLandlordId.useSuspenseQuery({
      landlordId: selectedLandlord?.id ?? "",
    });

  const { mutate: createLandlord, isPending: isPendingLandlord } =
    api.landlord.create.useMutation({
      onSuccess: (data) => {
        void router.push(`/landlord/${data.id}?created=true`);
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Error",
          description: "Address not found. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let payload = {
      street: values.street,
      streetNumber: values.streetNumber,
      flatNumber: values.flatNumber,
      city: values.city,
      zip: values.zipCode,
      country: selectedQuery?.address.country ?? "",
      lat: "",
      lng: "",
    };

    if (
      selectedQuery?.address.road &&
      selectedQuery?.address.house_number &&
      selectedQuery?.address.city &&
      selectedQuery?.address.postcode
    ) {
      payload = {
        ...payload,
        lat: selectedQuery?.lat ?? "",
        lng: selectedQuery?.lon ?? "",
      };
    }

    createLandlord(payload);
  }

  useEffect(() => {
    if (!!selectedLandlord) {
      setIsSidebarOpen(true);
    }
  }, [selectedLandlord]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedQuery(null);
    }

    setIsSidebarOpen(!open);
    setIsDialogOpen(open);
  };

  const handleOpenDialog = () => {
    form.reset();
    form.setValue("street", selectedQuery?.address.road ?? "");
    form.setValue("streetNumber", selectedQuery?.address.house_number ?? "");
    form.setValue("city", selectedQuery?.address.city ?? "");
    form.setValue("zipCode", selectedQuery?.address.postcode ?? "");

    setIsSidebarOpen(false);
    setIsDialogOpen(true);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isDialogOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black bg-opacity-50"
          aria-hidden="true"
        />
      )}
      <div className="flex max-h-[100vh] w-full">
        <aside
          className={`${
            isSidebarOpen ? "w-[32rem]" : "w-16"
          } bg-secondary-foreground text-secondary transition-all duration-300 ease-in-out ${
            isMobile && !isSidebarOpen ? "hidden" : ""
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="mb-4 flex h-16 items-center justify-between border-b border-primary bg-primary/30 px-4">
              {isSidebarOpen ? (
                <Link
                  href="/"
                  className="flex items-center gap-1 text-2xl font-thin text-secondary"
                >
                  <House /> Rate Your Landlord
                </Link>
              ) : (
                <Link href="/" className="flex w-full justify-center">
                  <House />
                </Link>
              )}
            </div>
            <ScrollArea className="flex-grow">
              <div className="p-4">
                <div className="mb-4">
                  {isSidebarOpen ? (
                    <div className="flex w-full max-w-sm items-start space-x-2">
                      <AutosuggestInput isSidebarOpen={isSidebarOpen} />
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="w-full"
                      onClick={toggleSidebar}
                    >
                      <SearchIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="mb-4">
                  {isSidebarOpen && (
                    <>
                      <Button
                        variant="default"
                        className="w-full"
                        disabled={!selectedQuery}
                        onClick={handleOpenDialog}
                      >
                        <Plus />
                        Add New Landlord
                      </Button>
                      {selectedLandlord && (
                        <Card className="mt-4 border-primary bg-primary/30 text-primary">
                          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                            <MapPinIcon className="h-8 w-8 text-primary" />
                            <CardTitle className="text-xl">
                              Landlord Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-primary-foreground">
                            <div className="grid gap-2">
                              <div className="flex flex-col">
                                <span className="text-lg font-bold">
                                  {selectedLandlord.street}{" "}
                                  {selectedLandlord.streetNumber}
                                  {selectedLandlord.flatNumber &&
                                    ` / ${selectedLandlord.flatNumber}`}
                                </span>
                                <span className="font-semibold">
                                  {selectedLandlord.zip} {selectedLandlord.city}
                                </span>
                                <span className="">
                                  {selectedLandlord.country}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center space-x-1">
                                <span className="ml-2 font-medium">
                                  {avgRating.toFixed(1)}
                                </span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-5 w-5 ${
                                      star <= Math.floor(avgRating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 font-medium">
                                  ({reviewCount})
                                </span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-col justify-between gap-2">
                            <Link
                              href={`landlord/${selectedLandlord.id}`}
                              className="w-full"
                            >
                              <Button variant="secondary" className="w-full">
                                <Info className="mr-1 h-4 w-4" />
                                Show Details
                              </Button>
                            </Link>
                            <Link
                              href={`landlord/${selectedLandlord.id}/reviews/new`}
                              className="w-full"
                            >
                              <Button className="w-full">
                                <MessageSquare className="mr-1 h-4 w-4" /> Write
                                an opinion
                              </Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      )}
                    </>
                  )}
                </div>
              </div>
            </ScrollArea>
            <div className="border-t border-muted-foreground p-4">
              {isSidebarOpen ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-6 w-6" />
                    <span>John Doe</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleSidebar}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button variant="secondary" size="icon" onClick={toggleSidebar}>
                  <ChevronRightIcon className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
        </aside>
        <Map sidebarOpen={isSidebarOpen} />
        <div className="absolute right-4 top-4 z-[1000]">
          <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
            <DialogContent className="z-[1000] border border-primary bg-card-foreground">
              <DialogHeader>
                <DialogTitle>Add New Landlord</DialogTitle>
                <DialogDescription className="text-muted">
                  Enter the details for the new landlord here.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem className="w-3/5 flex-grow">
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder="Street" {...field} />
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
                            <Input placeholder="Street Number" {...field} />
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
                            <Input placeholder="Flat Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="w-2/3 flex-grow">
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem className="w-1/3 flex-grow">
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Zip Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="pt-4">
                    <Button disabled={isPendingLandlord} type="submit">
                      {isPendingLandlord ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      {isPendingLandlord ? "Processing..." : "Add Landlord"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Suspense>
  );
}
