import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => (
  <label className="inline-flex items-center gap-3 text-sm font-medium text-foreground">
    <div className="relative inline-flex h-6 w-11 items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        ref={ref}
        {...props}
      />
      <div
        className={cn(
          "h-full w-full rounded-full border border-border bg-muted transition peer-checked:bg-primary",
          className
        )}
      />
      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card shadow transition peer-checked:translate-x-5 peer-checked:bg-white" />
    </div>
    {props.children}
  </label>
));
Switch.displayName = "Switch";
