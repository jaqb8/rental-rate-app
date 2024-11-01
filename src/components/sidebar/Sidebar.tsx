"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  ChevronLeftIcon,
  ChevronRightIcon,
  Home,
  Info,
  Loader2,
  LogInIcon,
  LogOutIcon,
  MapPin,
  MapPinIcon,
  MessageSquare,
  Plus,
  SearchIcon,
  Star,
  User,
  UserIcon,
  UserPlus2,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { useSession } from "@/context";
import { logout } from "@/auth/actions";
import { useDialogStore } from "@/stores/dialog";
import { Skeleton } from "../ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useScopedI18n } from "locales/client";
import { LanguageSwitcher } from "../language-switcher";
import Image from "next/image";

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
  const t = useScopedI18n("Sidebar");
  const { user, clearSessionContext } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { selectedQuery, setSelectedQuery } = useSelectedQuery();
  const { toast } = useToast();
  const router = useRouter();
  const { selectedLandlord } = useSelectedLandlord();
  const { setDialogOpen, isOpen: isDialogOpen } = useDialogStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: selectedQuery?.address.road ?? "",
      streetNumber: selectedQuery?.address.house_number ?? "",
      flatNumber: "",
      city: selectedQuery?.address.city ?? "",
      zipCode: selectedQuery?.address.postcode ?? "",
    },
  });

  const handleOpenDialog = () => {
    form.reset();
    form.setValue("street", selectedQuery?.address.road ?? "");
    form.setValue("streetNumber", selectedQuery?.address.house_number ?? "");
    form.setValue("city", selectedQuery?.address.city ?? "");
    form.setValue("zipCode", selectedQuery?.address.postcode ?? "");
    setDialogOpen(true);
  };

  const { data: avgRatingData, isLoading: isAvgRatingLoading } =
    api.review.getAvgRatingByLandlordId.useQuery({
      landlordId: selectedLandlord?.id ?? "",
    });

  const { mutate: createLandlord, isPending: isPendingLandlord } =
    api.landlord.create.useMutation({
      onSuccess: (data) => {
        router.push(`/landlord/${data.id}?created=true`);
        setDialogOpen(false);
        setSelectedQuery(null);
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
    const payload = {
      street: values.street,
      streetNumber: values.streetNumber,
      flatNumber: values.flatNumber,
      city: values.city,
      zip: values.zipCode,
      country: selectedQuery?.address.country ?? "",
    };
    createLandlord(payload);
  }

  useEffect(() => {
    if (!!selectedLandlord) {
      setIsSidebarOpen(true);
    }
  }, [selectedLandlord]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onOpenChange = (open: boolean) => {
    setIsSidebarOpen(!open);
    setDialogOpen(open);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast({
        title: "Success",
        description: "You have been logged out.",
        duration: 3000,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
      }
    } finally {
      clearSessionContext();
      setIsLoading(false);
    }
  };

  return (
    <>
      {isDialogOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black bg-opacity-50"
          aria-hidden="true"
        />
      )}
      <div className="flex h-[100vh] w-full flex-col md:flex-row">
        <aside
          className={`${
            isSidebarOpen ? "w-[25rem]" : "w-16"
          } hidden transform bg-secondary-foreground text-secondary transition-all duration-300 ease-in-out md:block`}
        >
          <div className="flex h-full w-inherit flex-col">
            <div className="mb-4 flex h-16 items-center justify-between border-b border-cyan-500/20 bg-gray-900/80 px-4">
              {isSidebarOpen ? (
                <div className="flex w-full items-center justify-between gap-2">
                  <Link
                    href="/"
                    className="flex items-center gap-1 text-xl font-bold text-cyan-500"
                  >
                    <Image
                      src="/rental_logo.svg"
                      width={40}
                      height={40}
                      alt="logo"
                    />
                    {t("title")}
                  </Link>
                  <LanguageSwitcher />
                </div>
              ) : (
                <Link href="/" className="flex w-full justify-center">
                  <Image
                    alt="logo"
                    width={40}
                    height={40}
                    src="/rental_logo.svg"
                    className="text-cyan-500"
                  />
                </Link>
              )}
            </div>
            <ScrollArea className="flex-grow">
              <div className="p-4">
                <div className="mb-4">
                  {isSidebarOpen ? (
                    <div className="flex w-full max-w-[100%] items-start space-x-2">
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
                      {selectedLandlord && isAvgRatingLoading && (
                        <Skeleton className="flex h-72 w-full flex-col justify-between rounded-xl border border-primary px-6 py-4">
                          <MapPinIcon className="h-8 w-8 text-primary/50" />
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </Skeleton>
                      )}

                      {selectedLandlord && !isAvgRatingLoading && (
                        <Card className="mt-4 border-primary bg-primary/10 text-primary">
                          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                            <MapPinIcon className="h-8 w-8 text-primary" />
                            <CardTitle className="text-xl text-secondary">
                              {t("landlordInformation")}
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
                                  {avgRatingData?.avgRating.toFixed(1)}
                                </span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-5 w-5 ${
                                      star <=
                                      Math.floor(avgRatingData?.avgRating ?? 0)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 font-medium">
                                  ({avgRatingData?.count})
                                </span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-col justify-between gap-2 rounded-b-md bg-primary/40 px-6 py-4">
                            <Link
                              href={`landlord/${selectedLandlord.id}`}
                              className="w-full"
                            >
                              <Button variant="secondary" className="w-full">
                                <Info className="mr-1 h-4 w-4" />
                                {t("showDetails")}
                              </Button>
                            </Link>
                            <Button className="w-full" asChild>
                              {user ? (
                                <Link
                                  href={`landlord/${selectedLandlord.id}/reviews/new`}
                                  className="w-full"
                                >
                                  <MessageSquare className="mr-1 h-4 w-4" />{" "}
                                  {t("addNewOpinion")}
                                </Link>
                              ) : (
                                <Link
                                  href={`/login?redirect=landlord/${selectedLandlord.id}/reviews/new`}
                                >
                                  <LogInIcon className="mr-2 h-4 w-4" />
                                  {t("loginToAddOpinion")}
                                </Link>
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      )}
                      {selectedQuery && !selectedLandlord && (
                        <Card className="max-w-[100%] border-primary bg-primary/10 text-white">
                          <CardContent className="p-6">
                            <div className="mb-4 flex items-center gap-2">
                              <MapPin className="h-8 w-8 text-primary" />
                              <h2 className="text-xl font-semibold">
                                {t("selectedAddress")}
                              </h2>
                            </div>
                            <p className="mb-2 text-lg font-medium">
                              {selectedQuery.display_name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Building2 className="h-4 w-4" />
                              <span>
                                {capitalizeFirstLetter(selectedQuery.type) ??
                                  capitalizeFirstLetter(
                                    selectedQuery.addresstype,
                                  )}
                              </span>
                            </div>
                          </CardContent>
                          <CardFooter className="rounded-b-md bg-primary/40 px-6 py-4">
                            {user ? (
                              <Button
                                onClick={handleOpenDialog}
                                variant="secondary"
                                className="w-full"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                {t("addNewLandlord")}
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                asChild
                                className="w-full"
                              >
                                <Link href="/login?dialog=true">
                                  <LogInIcon className="mr-2 h-4 w-4" />
                                  {t("loginToAddLandlord")}
                                </Link>
                              </Button>
                            )}
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
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    {user ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex w-[19.5rem] items-center justify-start space-x-2 bg-secondary-foreground hover:bg-secondary/20 hover:text-secondary"
                          >
                            <UserIcon className="h-6 w-6" />
                            <span>{user.email}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[19.5rem]">
                          <DropdownMenuItem className="cursor-pointer">
                            <Link href="/profile">
                              <div className="flex">
                                <User className="mr-2 h-4 w-4" />
                                {t("profile")}
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleLogout}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("processing")}
                              </>
                            ) : (
                              <>
                                <LogOutIcon className="mr-2 h-4 w-4" />
                                {t("logout")}
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button
                        variant="default"
                        className="mr-4 w-full justify-center"
                        asChild
                      >
                        <Link href="/login">
                          <LogInIcon className="mr-2 h-4 w-4" />
                          {t("signIn")}
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={toggleSidebar}
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex justify-center text-xs text-gray-400">
                    {t("version")} {process.env.NEXT_PUBLIC_APP_VERSION}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleSidebar}
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </Button>
                  <div className="text-xs text-gray-400">
                    v{process.env.NEXT_PUBLIC_APP_VERSION}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
        <Map sidebarOpen={isSidebarOpen} />

        {/* mobile menu */}
        <div className="fixed bottom-0 left-0 right-0 z-[500] md:hidden">
          <Collapsible
            className="rounded-t-xl bg-secondary-foreground"
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
          >
            <div className="flex items-center justify-center gap-4 px-12 py-4">
              <Button
                variant="secondary"
                className={cn("rounded-full px-6 py-4", !user && "hidden")}
                asChild
              >
                <Link href="/profile">
                  <UserIcon className="mr-1 h-4 w-4" />{" "}
                  {!isSidebarOpen && t("profile")}
                </Link>
              </Button>
              <Button
                variant="secondary"
                className={cn("rounded-full py-4", user && "hidden")}
                asChild
              >
                <Link href="/login">
                  <User /> {t("signIn")}
                </Link>
              </Button>
              <CollapsibleTrigger asChild>
                <Button
                  size={isSidebarOpen ? "default" : "icon"}
                  className={cn("h-12 rounded-full", !isSidebarOpen && "w-12")}
                >
                  <SearchIcon className={cn(isSidebarOpen && "mr-1")} />
                  {isSidebarOpen && t("search")}
                </Button>
              </CollapsibleTrigger>
              <Button
                className={cn("rounded-full py-4", user && "hidden")}
                variant="secondary"
                asChild
              >
                <Link href="/register">
                  <UserPlus2 />
                  {t("signUp")}
                </Link>
              </Button>
              <Button
                onClick={handleLogout}
                disabled={isLoading}
                variant="secondary"
                className={cn("rounded-full px-6 py-4", !user && "hidden")}
              >
                {!isLoading ? (
                  <LogOutIcon className="mr-1 h-4 w-4" />
                ) : (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                )}
                {!isSidebarOpen && t("logout")}
              </Button>
            </div>
            <CollapsibleContent className="CollapsibleContent flex flex-col gap-4">
              <div className="flex flex-col gap-3 px-4 pb-4">
                <AutosuggestInput isSidebarOpen={isSidebarOpen} />
                {selectedLandlord && isAvgRatingLoading && (
                  <Skeleton className="flex h-80 w-full flex-col justify-between rounded-xl border border-primary px-6 py-4">
                    <MapPinIcon className="h-8 w-8 text-primary/50" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </Skeleton>
                )}
                {selectedLandlord && !isAvgRatingLoading && (
                  <Card className="border-primary bg-primary/10 text-primary">
                    <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                      <MapPinIcon className="h-8 w-8 text-primary" />
                      <CardTitle className="text-xl text-secondary">
                        {t("landlordInformation")}
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
                          <span className="">{selectedLandlord.country}</span>
                        </div>
                        <div className="mt-2 flex items-center space-x-1">
                          <span className="ml-2 font-medium">
                            {avgRatingData?.avgRating.toFixed(1)}
                          </span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <=
                                Math.floor(avgRatingData?.avgRating ?? 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-2 font-medium">
                            ({avgRatingData?.count})
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col justify-between gap-2 rounded-b-md bg-primary/40 px-6 py-4">
                      <Link
                        href={`landlord/${selectedLandlord.id}`}
                        className="w-full"
                      >
                        <Button variant="secondary" className="w-full">
                          <Info className="mr-1 h-4 w-4" />
                          {t("showDetails")}
                        </Button>
                      </Link>
                      <Button className="w-full" asChild>
                        {user ? (
                          <Link
                            href={`landlord/${selectedLandlord.id}/reviews/new`}
                            className="w-full"
                          >
                            <MessageSquare className="mr-1 h-4 w-4" />{" "}
                            {t("addNewOpinion")}
                          </Link>
                        ) : (
                          <Link
                            href={`/login?redirect=landlord/${selectedLandlord.id}/reviews/new`}
                          >
                            <LogInIcon className="mr-2 h-4 w-4" />
                            {t("loginToAddOpinion")}
                          </Link>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                {selectedQuery && !selectedLandlord && (
                  <Card className="max-w-[100%] border-primary bg-primary/10 text-white">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center gap-2">
                        <MapPin className="h-8 w-8 text-primary" />
                        <h2 className="text-xl font-semibold">
                          {t("selectedAddress")}
                        </h2>
                      </div>
                      <p className="mb-2 text-lg font-medium">
                        {selectedQuery.display_name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Building2 className="h-4 w-4" />
                        <span>
                          {capitalizeFirstLetter(selectedQuery.type) ??
                            capitalizeFirstLetter(selectedQuery.addresstype)}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="rounded-b-md bg-primary/40 px-6 py-4">
                      {user ? (
                        <Button
                          onClick={() => {
                            setIsSidebarOpen(false);
                            handleOpenDialog();
                          }}
                          variant="secondary"
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {t("addNewLandlord")}
                        </Button>
                      ) : (
                        <Button variant="secondary" asChild className="w-full">
                          <Link href="/login?dialog=true">
                            <LogInIcon className="mr-2 h-4 w-4" />
                            {t("loginToAddLandlord")}
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )}
                <div className="flex justify-center text-xs text-gray-400">
                  v{process.env.NEXT_PUBLIC_APP_VERSION}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="absolute right-4 top-4 z-[1000]">
          <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
            <DialogContent className="z-[1000] border-0 border-primary bg-secondary-foreground p-0">
              <DialogHeader className="rounded-t-md bg-primary/40 px-8 py-5">
                <DialogTitle>{t("addNewLandlord")}</DialogTitle>
                <DialogDescription className="text-muted">
                  {t("addNewLandlordDescription")}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 px-8 pb-5"
                >
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem className="w-2/5 flex-grow md:w-3/5">
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
                          <FormLabel>{t("streetNumber")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("streetNumber")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="flatNumber"
                      render={({ field }) => (
                        <FormItem className="w-2/5 flex-grow">
                          <FormLabel>{t("flatNumber")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("flatNumber")} {...field} />
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
                          <FormLabel>{t("city")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("city")} {...field} />
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
                          <FormLabel>{t("zipCode")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("zipCode")} {...field} />
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
                      {isPendingLandlord
                        ? t("processing")
                        : t("addNewLandlord")}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
