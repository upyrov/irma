import { Lock, Trash2 } from "lucide-react"
import { Avatar } from "#/components/ui/avatar"
import { RoleBadge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"
import { RoleSelect } from "./roleSelect"
import type { ProjectMember, ProjectRole } from "./types"

type RowProps = {
  member: ProjectMember
  taskCount: number
  onRoleChange: (role: ProjectRole) => void
  onRemove: () => void
}

const MemberRow = ({ member, taskCount, onRoleChange, onRemove }: RowProps) => {
  const isOwner = member.role === "owner"
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar
            initials={member.initials}
            color={member.color}
            className="size-9 text-xs"
          />
          <div>
            <div className="font-semibold">{member.name}</div>
            <div className="text-[13px] text-muted">@{member.username}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-text-2">{taskCount}</TableCell>
      <TableCell>
        {isOwner ? (
          // biome-ignore lint/a11y/useValidAriaRole: це проп RoleBadge, а не ARIA-роль
          <RoleBadge role="owner" className="h-[34px] gap-1.5 px-3">
            <Lock aria-hidden="true" className="size-3.5" />
            Owner
          </RoleBadge>
        ) : (
          <RoleSelect value={member.role} onChange={onRoleChange} />
        )}
      </TableCell>
      <TableCell className="text-right">
        {!isOwner && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Видалити ${member.name} з проєкту`}
            onClick={onRemove}
            className="ml-auto rounded-lg px-0 text-danger-text hover:bg-danger-bg hover:text-danger-text"
          >
            <Trash2 className="size-[18px]" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

type Props = {
  members: ProjectMember[]
  taskCounts: Record<string, number>
  onRoleChange: (memberId: string, role: ProjectRole) => void
  onRemove: (memberId: string) => void
}

export const MembersTable = ({
  members,
  taskCounts,
  onRoleChange,
  onRemove,
}: Props) => {
  return (
    <section
      aria-label="Список учасників"
      className="overflow-x-auto rounded-[14px] border border-border bg-white"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Учасник</TableHead>
            <TableHead>Задач</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>
              <span className="sr-only">Дії</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <MemberRow
              key={m.id}
              member={m}
              taskCount={taskCounts[m.id] ?? 0}
              onRoleChange={(role) => onRoleChange(m.id, role)}
              onRemove={() => onRemove(m.id)}
            />
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
