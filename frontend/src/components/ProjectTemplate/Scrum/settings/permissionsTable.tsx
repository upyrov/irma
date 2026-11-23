import { Check, X } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"
import { allRoles, type ProjectRole, roleLabels } from "./types"

type Permission = { name: string; roles: ProjectRole[] }

const permissions: Permission[] = [
  { name: "Перегляд дошки та беклогу", roles: ["owner", "admin", "member", "viewer"] },
  { name: "Створення та редагування задач", roles: ["owner", "admin", "member"] },
  { name: "Зміна статусу та виконавця своїх задач", roles: ["owner", "admin", "member"] },
  { name: "Зміна статусу та виконавця чужих задач", roles: ["owner", "admin"] },
  { name: "Коментування задач", roles: ["owner", "admin", "member"] },
  { name: "Керування спринтами", roles: ["owner", "admin"] },
  { name: "Додавання учасників і зміна ролей", roles: ["owner", "admin"] },
  { name: "Видалення проєкту", roles: ["owner"] },
]

const PermissionMark = ({ allowed }: { allowed: boolean }) =>
  allowed ? (
    <Check
      role="img"
      aria-label="Дозволено"
      strokeWidth={2.4}
      className="mx-auto size-[18px] text-success"
    />
  ) : (
    <X
      role="img"
      aria-label="Заборонено"
      strokeWidth={2.4}
      className="mx-auto size-[18px] text-subtle"
    />
  )

export const PermissionsTable = () => {
  return (
    <section
      aria-labelledby="perm-h"
      className="overflow-x-auto rounded-[14px] border border-border bg-white"
    >
      <h2
        id="perm-h"
        className="m-0 border-b border-border px-[18px] py-4 text-[15px] font-bold"
      >
        Що може кожна роль
      </h2>
      <Table>
        <TableHeader className="[&_tr]:border-hover">
          <TableRow>
            <TableHead className="py-3">Дія</TableHead>
            {allRoles.map((r) => (
              <TableHead key={r} className="py-3 text-center">
                {roleLabels[r]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((p) => (
            <TableRow key={p.name}>
              <th scope="row" className="px-[18px] py-3 text-left font-medium">
                {p.name}
              </th>
              {allRoles.map((r) => (
                <TableCell key={r} className="text-center">
                  <PermissionMark allowed={p.roles.includes(r)} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
