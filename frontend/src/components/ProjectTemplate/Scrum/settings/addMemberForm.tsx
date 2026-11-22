import { type FormEvent, useState } from "react"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { assignableRoles, type ProjectRole, roleLabels } from "./types"

type Props = {
  existingUsernames: string[]
  onAdd: (data: { username: string; role: ProjectRole }) => void
}

export const AddMemberForm = ({ existingUsernames, onAdd }: Props) => {
  const [username, setUsername] = useState("")
  const [role, setRole] = useState<ProjectRole>("member")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = username.trim().replace(/^@/, "")
    if (!name) return setError("Вкажіть ім'я користувача")
    if (existingUsernames.includes(name.toLowerCase()))
      return setError("Цей користувач уже є в проєкті")
    onAdd({ username: name, role })
    setUsername("")
    setError(null)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-[14px] border border-border bg-white p-[18px]"
    >
      <div className="flex flex-[1_1_280px] flex-col gap-1.5">
        <Label htmlFor="add-user">Додати учасника</Label>
        <Input
          id="add-user"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setError(null)
          }}
          placeholder="Ім'я користувача з команди"
          aria-invalid={!!error}
          aria-describedby={error ? "add-user-error" : undefined}
          className="h-[42px] px-3 text-sm"
        />
      </div>

      <div className="flex flex-[0_1_180px] flex-col gap-1.5">
        <Label htmlFor="add-role">Роль</Label>
        <Select value={role} onValueChange={(v) => setRole(v as ProjectRole)}>
          <SelectTrigger id="add-role" className="h-[42px] w-full text-sm">
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

      <Button type="submit" size="sm" className="h-[42px] px-[18px]">
        Додати
      </Button>

      {error && (
        <p
          id="add-user-error"
          role="alert"
          className="m-0 basis-full text-[13px] text-danger-text"
        >
          {error}
        </p>
      )}
    </form>
  )
}
