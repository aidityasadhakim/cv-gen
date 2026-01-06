import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border-2 border-border bg-warm-white px-4 py-3 text-base text-charcoal shadow-subtle transition-all duration-200 ease-default",
          "placeholder:text-light-gray",
          "focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/20 focus:shadow-medium",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-off-white",
          "hover:border-charcoal/30",
          "resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
