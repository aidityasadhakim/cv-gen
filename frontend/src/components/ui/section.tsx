import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "dark" | "gradient" | "warmFade"
  spacing?: "sm" | "md" | "lg"
}

function Section({
  className,
  variant = "default",
  spacing = "lg",
  children,
  ...props
}: SectionProps) {
  const variantStyles = {
    default: "bg-warm-white",
    dark: "bg-charcoal text-warm-white",
    gradient: "bg-dark-section",
    warmFade: "bg-warm-fade",
  }

  const spacingStyles = {
    sm: "py-12 lg:py-16",
    md: "py-16 lg:py-24",
    lg: "py-[clamp(4rem,10vw,8rem)]",
  }

  return (
    <section
      className={cn(
        "w-full",
        variantStyles[variant],
        spacingStyles[spacing],
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export { Section }
