import { cn } from "cn"
import { roleBadgeVariants } from "#/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { assignableRoles, type ProjectRole, roleLabels } from "./types"

type Props = {
  value: ProjectRole
  onChange: (role: ProjectRole) => void
}

export const RoleSelect = ({ value, onChange }: Props) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ProjectRole)}>
      <SelectTrigger
        aria-label={`Змінити роль: ${roleLabels[value]}`}
        className={cn(
          roleBadgeVariants({ role: value }),
          "h-[34px] w-auto cursor-pointer gap-2 pr-2.5 pl-3"
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-40">
        {assignableRoles.map((r) => (
          <SelectItem key={r} value={r}>
            {roleLabels[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
