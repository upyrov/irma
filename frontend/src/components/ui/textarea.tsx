import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-y rounded-[10px] border border-border-input px-3.5 py-3 text-[15px] text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
