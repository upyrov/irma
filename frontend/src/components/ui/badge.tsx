import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva("inline-flex items-center whitespace-nowrap", {
  variants: {
    variant: {
      blue: "bg-primary-tint text-primary-hover",
      green: "bg-success-bg text-success-text",
      red: "bg-danger-bg text-danger-text",
      orange: "bg-orange-bg text-orange-text",
      purple: "bg-epic-bg text-epic-text",
      yellow: "bg-warning-bg text-warning-text",
      gray: "bg-hover text-text-2",
      success: "bg-success text-white",
      dark: "bg-ink text-white",
    },
    size: {
      // Шаблон проєкту
      pill: "rounded-full px-2.5 py-1 text-xs font-semibold",
      // Епік
      tag: "rounded-md px-2 py-[3px] text-xs font-semibold",
      // Колонка
      chip: "rounded-md px-2 py-[3px] text-[11px] font-semibold",
      // Статус спринту
      status:
        "rounded-md px-2 py-[3px] text-[11px] font-bold uppercase tracking-[.04em]",
      // Лічильник
      count:
        "h-[22px] min-w-[26px] justify-center rounded-full px-1.5 text-xs font-bold",
      // 3 / 3
      ratio: "h-5 rounded-full px-2 text-xs font-bold",
    },
  },
  defaultVariants: {
    variant: "gray",
    size: "chip",
  },
})

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  )
}

type ProjectTemplate = "scrum" | "kanban" | "bug-tracking"

const templateConfig: Record<
  ProjectTemplate,
  { label: string; variant: VariantProps<typeof badgeVariants>["variant"] }
> = {
  scrum: { label: "Scrum", variant: "blue" },
  kanban: { label: "Kanban", variant: "green" },
  "bug-tracking": { label: "Bug Tracking", variant: "red" },
}

function TemplateBadge({
  template,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Badge>, "variant" | "size"> & {
  template: ProjectTemplate
}) {
  const { label, variant } = templateConfig[template]
  return (
    <Badge variant={variant} size="pill" {...props}>
      {children ?? label}
    </Badge>
  )
}

type SprintStatus = "active" | "planned" | "closed"

const sprintStatusVariant: Record<
  SprintStatus,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  active: "success",
  planned: "gray",
  closed: "dark",
}

function SprintStatusBadge({
  status,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Badge>, "variant" | "size"> & {
  status: SprintStatus
}) {
  return (
    <Badge variant={sprintStatusVariant[status]} size="status" {...props}>
      {children ?? status}
    </Badge>
  )
}

const roleBadgeVariants = cva(
  "inline-flex h-[30px] items-center whitespace-nowrap rounded-lg px-2.5 text-[13px] font-semibold",
  {
    variants: {
      role: {
        owner: "bg-ink text-white",
        admin: "border border-border-input bg-primary-tint text-primary-hover",
        member: "border border-border-input bg-white text-ink",
        viewer: "border border-border-input bg-page text-text-2",
      },
    },
    defaultVariants: {
      role: "member",
    },
  }
)

const roleLabel = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
} as const

function RoleBadge({
  className,
  role = "member",
  children,
  ...props
}: Omit<React.ComponentProps<"span">, "role"> &
  VariantProps<typeof roleBadgeVariants>) {
  return (
    <span
      data-slot="role-badge"
      className={cn(roleBadgeVariants({ role, className }))}
      {...props}
    >
      {children ?? roleLabel[role ?? "member"]}
    </span>
  )
}

function IssueKey({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="issue-key"
      className={cn("font-mono text-[13px] text-muted", className)}
      {...props}
    />
  )
}

export {
  Badge,
  badgeVariants,
  TemplateBadge,
  SprintStatusBadge,
  RoleBadge,
  roleBadgeVariants,
  IssueKey,
}
export type { ProjectTemplate, SprintStatus }
