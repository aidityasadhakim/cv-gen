import * as React from "react"
import { cn } from "@/lib/utils"

function Hero({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "font-display text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[0.95] tracking-[-0.03em] text-charcoal",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

function H1({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-charcoal",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

function H2({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-charcoal",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

function H3({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-[1.2] tracking-[-0.01em] text-charcoal",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

function H4({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(
        "font-display text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-[1.3] tracking-[0] text-charcoal",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  )
}

function Body({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-body text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.6] tracking-[0] text-charcoal",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function Small({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-body text-sm leading-[1.5] tracking-[0.01em] text-charcoal",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function Caption({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-body text-xs uppercase leading-[1.4] tracking-[0.02em] text-mid-gray",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function Code({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <code
      className={cn(
        "font-mono text-sm bg-off-white px-1.5 py-0.5 rounded text-charcoal",
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

function Lead({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-body text-xl leading-[1.6] text-charcoal/80",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function Blockquote({
  className,
  children,
  ...props
}: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        "font-body text-lg leading-[1.6] border-l-4 border-amber pl-4 italic text-charcoal/80",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  )
}

export {
  Hero,
  H1,
  H2,
  H3,
  H4,
  Body,
  Small,
  Caption,
  Code,
  Lead,
  Blockquote,
}
