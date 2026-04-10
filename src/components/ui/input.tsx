import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-input-border bg-input-bg px-4 py-2 text-base text-heading shadow-[inset_0_2px_8px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md outline-none transition-all duration-200",
        "placeholder:text-input-placeholder placeholder:opacity-100",
        "hover:border-input-border-hover hover:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_0_0_1px_rgba(99,179,237,0.12)]",
        "focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(99,179,237,0.22),inset_0_2px_8px_rgba(0,0,0,0.4),inset_0_0_20px_rgba(99,179,237,0.06)]",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
