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
  onCreate: (data: { type: TaskType; title: string }) => Promise<unknown>
  formatError: (error: unknown) => string
}

export const QuickCreateForm = ({ onCreate, formatError }: Props) => {
  const [type, setType] = useState<TaskType>("task")
  const [title, setTitle] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || pending) return
    setPending(true)
    setError(null)
    try {
      await onCreate({ type, title: trimmed })
      setTitle("")
    } catch (err) {
      setError(formatError(err))
    } finally {
      setPending(false)
    }
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
        maxLength={300}
        disabled={pending}
        onChange={(e) => {
          setTitle(e.target.value)
          setError(null)
        }}
        aria-invalid={!!error}
        aria-describedby={error ? "qc-error" : undefined}
        placeholder="Що потрібно зробити? Enter — створити"
        className="h-10 min-w-[200px] flex-1 rounded-lg px-3 text-sm"
      />

      <Button
        type="submit"
        variant="dark"
        size="sm"
        disabled={!title.trim() || pending}
        className="rounded-lg px-4 disabled:opacity-50"
      >
        {pending ? "Додаємо…" : "Додати"}
      </Button>

      {error && (
        <p id="qc-error" role="alert" className="m-0 basis-full text-[13px] text-danger-text">
          {error}
        </p>
      )}
    </form>
  )
}
