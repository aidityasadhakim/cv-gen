import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200 ease-default focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-amber/15 text-amber-dark",
        secondary: "bg-off-white text-charcoal border border-border",
        destructive: "bg-coral text-white",
        outline: "border-2 border-border text-charcoal bg-transparent",
        success: "bg-success/15 text-success",
        warning: "bg-amber/15 text-amber-dark",
        info: "bg-info/15 text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
