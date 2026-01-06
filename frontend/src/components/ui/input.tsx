import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border-2 bg-warm-white px-4 py-3 text-base text-charcoal shadow-subtle transition-all duration-200 ease-default",
            "placeholder:text-light-gray",
            "focus:outline-none focus:ring-2 focus:shadow-medium",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-warm-white",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-off-white",
            error
              ? "border-error focus:border-error focus:ring-error/20"
              : "border-border focus:border-amber focus:ring-amber/20 hover:border-charcoal/30",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
        {error && errorMessage && (
          <p className="mt-1.5 text-sm text-error">{errorMessage}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
