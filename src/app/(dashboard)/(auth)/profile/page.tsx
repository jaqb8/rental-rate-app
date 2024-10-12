"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UploadUserAvatarButton from "@/components/upload-file-button/UploadUserAvatarButton";
import { useSession } from "@/context";
import { api } from "@/trpc/react";
import { type User } from "lucia";
import { Check, Loader2, Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import React, { useState } from "react";

export default function ProfilePage() {
  const [isEditingName, setIsEditingName] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const { user, updateUserData } = useSession();
  const { mutate: updateUser, isPending: isUsernamePending } =
    api.auth.updateUser.useMutation({
      onSuccess: (data) => {
        updateUserData(data as unknown as User);
        setIsEditingName(false);
      },
    });

  if (!user) {
    notFound();
  }

  const onAvatarUploadComplete = () => {
    console.log("Avatar upload complete");
  };

  return (
    <Card className="border-primary bg-card-foreground text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
      </CardHeader>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 space-x-4 border-y border-primary bg-primary/30 p-4 md:flex-row">
        <div className="flex items-center gap-2 text-xl md:gap-4">
          <Avatar className="h-12 w-12 md:h-20 md:w-20">
            <AvatarImage src={user?.image ?? ""} alt="User avatar" />
            <AvatarFallback className="bg-muted-foreground text-sm md:text-2xl">
              {user?.email.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{user?.email}</span>
        </div>
        <div>
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="flex items-center space-x-2 text-sm text-blue-500 hover:text-blue-600">
              <UploadUserAvatarButton
                userId={user.id}
                onUploadComplete={onAvatarUploadComplete}
              >
                Change Avatar
              </UploadUserAvatarButton>
            </div>
          </Label>
          <Input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Username</Label>
          {isEditingName ? (
            <div className="flex flex-col gap-2 md:flex-row md:gap-0 md:space-x-2">
              <Input
                id="name"
                value={usernameInput}
                placeholder="Enter your username"
                onChange={(e) => setUsernameInput(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  className="w-full"
                  disabled={isUsernamePending}
                  onClick={() => updateUser({ name: usernameInput })}
                >
                  {isUsernamePending ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Save</>
                  )}
                </Button>
                <Button
                  className="w-full"
                  disabled={isUsernamePending}
                  variant="secondary"
                  onClick={() => {
                    setIsEditingName(false);
                    setUsernameInput("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {user?.name ? (
                <span>{user?.name}</span>
              ) : (
                <span className="text-muted-foreground">
                  You have not name set yet.
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingName(true)}
              >
                <Pencil size={16} />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Account Status</Label>
          <div className="flex items-center space-x-2 text-green-600">
            <Check size={20} />
            <span className="font-medium">Verified Account</span>
            {user?.emailVerified && (
              <span className="text-sm text-gray-500">
                ({user.emailVerified})
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
