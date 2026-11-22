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
import { type TaskType, TaskTypeLabel, taskTypes } from "#/components/ui/task-type"

const typeOptions = Object.keys(taskTypes) as TaskType[]

type Props = {
  onCreate: (data: { type: TaskType; title: string }) => void
}

export const QuickCreateForm = ({ onCreate }: Props) => {
  const [type, setType] = useState<TaskType>("task")
  const [title, setTitle] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onCreate({ type, title: trimmed })
    setTitle("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-2.5 bg-[#FAFBFC] px-[18px] py-3"
    >
      <Label htmlFor="qc-type" className="sr-only">
        Тип задачі
      </Label>
      <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
        <SelectTrigger id="qc-type" className="h-10 w-32 rounded-lg text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map((t) => (
            <SelectItem key={t} value={t}>
              <TaskTypeLabel type={t} className="text-sm text-ink" />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label htmlFor="qc-title" className="sr-only">
        Назва задачі
      </Label>
      <Input
        id="qc-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Що потрібно зробити? Enter — створити"
        className="h-10 min-w-[200px] flex-1 rounded-lg px-3 text-sm"
      />

      <Button
        type="submit"
        variant="dark"
        size="sm"
        disabled={!title.trim()}
        className="rounded-lg px-4 disabled:opacity-50"
      >
        Додати
      </Button>
    </form>
  )
}
