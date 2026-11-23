import { UserRound } from "lucide-react"
import type { UserDto } from "#/types/api"

type Props = {
  user: UserDto | null | undefined
}

export const User = ({ user }: Props) => {
  if (user === undefined) {
    return (
      <>
        <span className="size-[34px] shrink-0 animate-pulse rounded-full bg-hover" />
        <span className="h-4 flex-1 animate-pulse rounded bg-hover" />
      </>
    )
  }

  return (
    <>
      {user ? (
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold uppercase text-white">
          {user.username.slice(0, 2)}
        </span>
      ) : (
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-hover text-muted">
          <UserRound aria-hidden="true" className="size-[18px]" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{user ? user.username : "Гість"}</div>
        {user && <div className="truncate text-xs text-muted">@{user.username}</div>}
      </div>
    </>
  )
}
