import type * as React from "react"
import { cn } from "cn"

function Avatar({
  initials,
  color,
  className,
  style,
  ...props
}: React.ComponentProps<"span"> & { initials: string; color: string }) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        "flex size-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
        className
      )}
      style={{ background: color, ...style }}
      {...props}
    >
      {initials}
    </span>
  )
}

/** Порожній аватар для непризначених задач */
function AvatarEmpty({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-empty"
      role="img"
      aria-label="Не призначено"
      className={cn(
        "flex size-[26px] shrink-0 rounded-full border border-dashed border-subtle",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarEmpty }
