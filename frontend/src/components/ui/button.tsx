import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "px-5 text-sm font-semibold flex flex-wrap items-center justify-center gap-2 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-hover",
        secondary:
          "border border-border-input bg-white text-ink hover:bg-[#F8F9FB]",
        dark:
          "bg-[#16181D] text-white hover:bg-[#000]",  
        danger:
          "bg-danger text-white hover:bg-[#BD0000]",  
        ghost:
          "text-primary hover:text-primary-hover",
        disabled:
          "bg-[#EEF0F4] text-[#9AA1AE] pointer-events-none",
      },
      size: {
        default: "h-11 rounded-[10px] py-2 has-[>svg]:px-3",
        xs: "h-8.5 gap-1 rounded-[8px] has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 rounded-[10px] py-2 has-[>svg]:px-3 ",
        lg: "h-10.5 rounded-md px-6 has-[>svg]:px-3",
        xl: "h-11.5 rounded-md px-6 has-[>svg]:px-3",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
