import { type DragEvent, useState } from "react"

export const ISSUE_MIME = "text/plain"

export const useDropTarget = (
  canDrop: boolean,
  onDrop: (issueId: string) => void
) => {
  const [isOver, setIsOver] = useState(false)

  const handlers = {
    onDragOver: (e: DragEvent<HTMLElement>) => {
      if (!canDrop) return
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      if (!isOver) setIsOver(true)
    },
    onDragLeave: (e: DragEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
        setIsOver(false)
      }
    },
    onDrop: (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      setIsOver(false)
      const id = e.dataTransfer.getData(ISSUE_MIME)
      if (canDrop && id) onDrop(id)
    },
  }

  return { isOver: canDrop && isOver, handlers }
}
