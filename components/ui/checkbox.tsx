import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "h-5 w-5 rounded-lg border border-border bg-background text-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
          className
        )}
        {...props}
      />
      {props.children}
    </label>
  )
);
Checkbox.displayName = "Checkbox";
