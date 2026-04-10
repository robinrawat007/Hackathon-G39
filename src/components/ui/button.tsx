import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] hover:scale-[1.02] focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary:
          "rounded-md bg-primary font-semibold text-[#080b14] shadow-card hover:bg-gradient-to-br hover:from-[#63B3ED] hover:to-[#9F7AEA] hover:text-[#080b14] hover:shadow-primary-glow",
        secondary:
          "rounded-md border border-border bg-surface/80 text-text backdrop-blur-sm hover:border-primary/40 hover:bg-surface-hover",
        ghost: "rounded-md bg-transparent text-text hover:bg-surface-hover/80",
        destructive: "rounded-md bg-error text-heading hover:brightness-95",
        link: "rounded-sm bg-transparent text-primary underline underline-offset-4 hover:text-primary-hover",
      },
      size: {
        sm: "h-9 gap-2 rounded-md px-3 text-sm",
        md: "h-11 gap-2 rounded-md px-4 text-sm",
        lg: "h-12 gap-2 rounded-lg px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, disabled, leftIcon, rightIcon, fullWidth, children, ...props },
    ref
  ) => {
    const isDisabled = disabled ?? loading ?? false
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), fullWidth ? "w-full" : undefined, className)}
        disabled={isDisabled}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : leftIcon}
        <span className="inline-flex items-center">{children}</span>
        {rightIcon}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
