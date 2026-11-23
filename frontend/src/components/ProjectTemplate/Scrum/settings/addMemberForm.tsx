import { useState } from "react"
import { Label } from "#/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { Spinner } from "#/components/ui/spinner"
import { UserSearch } from "#/components/userSearch"
import type { Guid, UserDto } from "#/types/api"
import { assignableRoles, type ProjectRole, roleLabels } from "./types"

type Props = {
  /** Учасники команди проєкту — додати в проєкт можна лише їх */
  teamMembers: UserDto[]
  existingUserIds: Guid[]
  pending?: boolean
  addedUsername?: string | null
  onAdd: (data: { user: UserDto; role: ProjectRole }) => void
}

export const AddMemberForm = ({ teamMembers, existingUserIds, pending, addedUsername, onAdd }: Props) => {
  const [role, setRole] = useState<ProjectRole>("member")
  const available = teamMembers.filter((u) => !existingUserIds.includes(u.id))

  return (
    <div className="flex flex-wrap items-start gap-3 rounded-[14px] border border-border bg-white p-[18px]">
      <div className="flex flex-[1_1_280px] flex-col gap-1.5">
        <Label>Додати учасника</Label>
        <UserSearch
          candidates={teamMembers}
          excludeIds={existingUserIds}
          disabled={pending}
          label="Знайти учасника команди, щоб додати в проєкт"
          onPick={(user) => onAdd({ user, role })}
        />
        {pending && (
          <p className="m-0 flex items-center gap-1.5 text-xs text-muted">
            <Spinner className="size-3" label="Додаємо" /> Додаємо…
          </p>
        )}
        {!pending && addedUsername && (
          <p className="m-0 text-xs text-success-text" aria-live="polite">
            @{addedUsername} тепер у проєкті
          </p>
        )}
        {!pending && !addedUsername && available.length === 0 && (
          <p className="m-0 text-xs text-muted">
            Усі учасники команди вже в проєкті. Нових людей спершу додайте в команду.
          </p>
        )}
      </div>

      <div className="flex flex-[0_1_180px] flex-col gap-1.5">
        <Label htmlFor="add-role">Роль</Label>
        <Select value={role} onValueChange={(v) => setRole(v as ProjectRole)}>
          <SelectTrigger id="add-role" className="h-10 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {assignableRoles.map((r) => (
              <SelectItem key={r} value={r}>
                {roleLabels[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
