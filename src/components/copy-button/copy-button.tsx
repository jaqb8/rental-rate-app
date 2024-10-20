"use client";

import React from "react";
import { Button, type ButtonProps } from "../ui/button";
import { copyToClipboardWithMeta } from "@/lib/utils";
import { Check, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface CopyButtonProps extends ButtonProps {
  value: string;
  message: string;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ children, ...props }, ref) => {
    const [hasCopied, setHasCopied] = React.useState(false);
    const { toast } = useToast();

    const handleCopy = () => {
      setHasCopied(true);
      void copyToClipboardWithMeta(props.value);
      toast({
        title: props.message,
        variant: "default",
        duration: 2000,
      });
      setTimeout(() => setHasCopied(false), 2000);
    };

    return (
      <div
        key={hasCopied ? "copied" : "not-copied"}
        className={props.className}
      >
        <Button onClick={handleCopy} ref={ref} {...props}>
          {hasCopied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Share2 className="mr-2 h-4 w-4" />
          )}
          {children}
        </Button>
      </div>
    );
  },
);
CopyButton.displayName = "CopyButton";
