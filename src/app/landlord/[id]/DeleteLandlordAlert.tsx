"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
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
  const router = useRouter();
  const utils = api.useUtils();
  const { toast } = useToast();
  const { setSelectedLandlord } = useSelectedLandlord();
  const { setSelectedQuery } = useSelectedQuery();

  const { mutate: deleteLandlord, isPending } = api.landlord.delete.useMutation(
    {
      onSuccess: () => {
        utils.landlord.getAll.invalidate();
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
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            landlord and all associated reviews.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <CustomAlertDialogAction
            disabled={isPending}
            onClick={() => deleteLandlord({ id: landlordId })}
          >
            {isPending ? (
              <span className="flex items-center">
                <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Deleting...
              </span>
            ) : (
              <span>Delete</span>
            )}
          </CustomAlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
