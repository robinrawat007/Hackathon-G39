import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-6 w-fit items-center justify-center gap-1 rounded-sm border px-2 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-heading",
        secondary: "border-border bg-surface text-text",
        destructive: "border-transparent bg-error text-heading",
        outline: "border-border bg-transparent text-text",
        ghost: "border-transparent bg-transparent text-text",
        link: "border-transparent bg-transparent text-primary underline underline-offset-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
