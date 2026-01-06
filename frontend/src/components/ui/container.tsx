import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: boolean
  center?: boolean
}

function Container({
  className,
  maxWidth = "2xl",
  padding = true,
  center = true,
  children,
  ...props
}: ContainerProps) {
  const maxWidthMap = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1440px",
    full: "100%",
  }

  return (
    <div
      className={cn(
        center && "mx-auto",
        padding && "px-[clamp(1rem,3vw,2rem)]",
        className
      )}
      style={{ maxWidth: maxWidthMap[maxWidth] }}
      {...props}
    >
      {children}
    </div>
  )
}

export { Container }
