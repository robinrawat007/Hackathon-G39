import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "h-11 w-full min-w-0 rounded-xl border border-input-border bg-input-bg px-4 py-2 font-sans text-base text-heading shadow-[inset_0_2px_6px_rgba(139,90,43,0.06)] backdrop-blur-md outline-none transition-all duration-200",
          "placeholder:text-input-placeholder placeholder:opacity-100",
          "hover:border-input-border-hover hover:shadow-[inset_0_2px_8px_rgba(139,90,43,0.08),0_0_0_1px_rgba(139,90,43,0.1)]",
          "focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(139,90,43,0.18),inset_0_2px_6px_rgba(139,90,43,0.08)]",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
