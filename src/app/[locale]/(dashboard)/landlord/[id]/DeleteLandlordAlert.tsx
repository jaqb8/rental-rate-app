"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSelectedLandlord, useSelectedQuery } from "@/stores";
import { useScopedI18n } from "locales/client";

const CustomAlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>
>(({ children, ...props }, ref) => (
  <Button ref={ref} {...props}>
    {children}
  </Button>
));
CustomAlertDialogAction.displayName = "CustomAlertDialogAction";

export default function DeleteLandlordAlert({
  landlordId,
}: {
  landlordId: string;
}) {
  const t = useScopedI18n("LandlordPage");
  const router = useRouter();
  const utils = api.useUtils();
  const { toast } = useToast();
  const { setSelectedLandlord } = useSelectedLandlord();
  const { setSelectedQuery } = useSelectedQuery();

  const { mutate: deleteLandlord, isPending } = api.landlord.delete.useMutation(
    {
      onSuccess: async () => {
        await utils.landlord.getAll.invalidate();
        setSelectedLandlord(null);
        setSelectedQuery(null);
        router.push("/");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash className="mr-2 h-4 w-4" /> {t("delete")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteAlert.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteAlert.message")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("cancel")}
          </AlertDialogCancel>
          <CustomAlertDialogAction
            disabled={isPending}
            onClick={() => deleteLandlord({ id: landlordId })}
          >
            {isPending ? (
              <span className="flex items-center">
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />{" "}
                {t("deleting")}
              </span>
            ) : (
              <span>{t("delete")}</span>
            )}
          </CustomAlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
