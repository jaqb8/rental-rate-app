"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  House,
  Loader2,
  MenuIcon,
  Plus,
  SearchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Map from "@/components/map";
import AutosuggestInput from "../autosuggest-input";
import { type AddressSuggestion } from "../autosuggest-input/AutosuggestInput";
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
  const [selectedQuery, setSelectedQuery] = useState<AddressSuggestion | null>(
    null,
  );
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
    console.log(values, selectedQuery);
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

    // console.log(payload);
    createLandlord(payload);
  }

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

  const handleSelect = (suggestion: AddressSuggestion): void => {
    setSelectedQuery(suggestion);
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
    <>
      {isDialogOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black bg-opacity-50"
          aria-hidden="true"
        />
      )}
      <div className="flex w-full">
        <aside
          className={`${
            isSidebarOpen ? "w-[30rem]" : "w-16"
          } bg-gray-800 text-white transition-all duration-300 ease-in-out ${
            isMobile && !isSidebarOpen ? "hidden" : ""
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between px-4">
              {isSidebarOpen && (
                <h2 className="flex items-center gap-1 text-xl font-bold">
                  <House />
                  Rate Your Landlord
                </h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-white hover:bg-gray-700"
              >
                {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </Button>
            </div>

            <ScrollArea className="flex-grow">
              <div className="p-4">
                <div className="mb-4">
                  {isSidebarOpen ? (
                    <div className="flex w-full max-w-sm items-start space-x-2">
                      <AutosuggestInput onSelect={handleSelect} />
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full text-white hover:bg-gray-700"
                      onClick={toggleSidebar}
                    >
                      <SearchIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="mb-4">
                  {isSidebarOpen ? (
                    <Button
                      variant="outline"
                      className="w-full text-primary"
                      disabled={!selectedQuery}
                      onClick={handleOpenDialog}
                    >
                      <Plus />
                      Add New Landlord
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full text-white hover:bg-gray-700"
                      onClick={toggleSidebar}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* <div className="mb-4">
                  {isSidebarOpen ? (
                    <Button variant="outline" className="w-full text-primary">
                      Add New Review
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full text-white hover:bg-gray-700"
                      onClick={toggleSidebar}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div> */}
              </div>
            </ScrollArea>
          </div>
        </aside>
        <Map sidebarOpen={isSidebarOpen} selectedQuery={selectedQuery} />
        <div className="absolute right-4 top-4 z-[1000]">
          <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
            <DialogContent className="z-[1000]">
              <DialogHeader>
                <DialogTitle>Add New Landlord</DialogTitle>
                <DialogDescription>
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

        <main className="flex-grow bg-gray-100">
          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="mb-4 md:hidden"
            >
              <MenuIcon />
            </Button>
          )}
        </main>
      </div>
    </>
  );
}
