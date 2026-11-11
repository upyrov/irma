import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full rounded-[10px] border border-border-input bg-white px-3.5 text-[15px] text-ink outline-none placeholder:text-muted",
        "focus-visible:border-[#2F5BEA] focus-visible:shadow-[0_0_0_3px_rgba(47,91,234,0.18)]",
        "aria-invalid:border-[#C62828] aria-invalid:shadow-[0_0_0_3px_rgba(198,40,40,0.15)]",
        "disabled:cursor-not-allowed disabled:bg-page disabled:text-subtle",
        className
      )}
      {...props}
    />
  )
}

export { Input }
