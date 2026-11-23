import { useMe } from "#/api/hooks/useAuth"

export const User = () => {
  const { data: user, isPending } = useMe()

  if (isPending) {
    return (
      <>
        <span className="size-[34px] shrink-0 animate-pulse rounded-full bg-hover" />
        <span className="h-4 flex-1 animate-pulse rounded bg-hover" />
      </>
    )
  }

  const name = user?.username ?? "Гість"
  return (
    <>
      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold uppercase text-white">
        {name.slice(0, 2)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{name}</div>
        {user && <div className="truncate text-xs text-muted">@{user.username}</div>}
      </div>
    </>
  )
}
