"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SubmitButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} ref={ref} {...props} className={className}>
        {pending && (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Processing...</span>
          </>
        )}
        {!pending && <>{children}</>}
      </Button>
    );
  },
);
SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
