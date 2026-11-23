const dateFormat = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "short",
})

export const formatDate = (iso: string) => dateFormat.format(new Date(iso))

export const formatRange = (start: string | null, end: string | null) =>
  start && end ? `${formatDate(start)} – ${formatDate(end)}` : "дати не задано"

export const plural = (n: number, [one, few, many]: [string, string, string]) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export const issuesCount = (n: number) =>
  `${n} ${plural(n, ["задача", "задачі", "задач"])}`

export const daysLeft = (end: string | null) => {
  if (!end) return 0
  const ms = new Date(end).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

export const timeAgo = (iso: string) => {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (minutes < 1) return "щойно"
  if (minutes < 60) return `${minutes} хв тому`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} год тому`
  const days = Math.floor(hours / 24)
  return `${days} ${plural(days, ["день", "дні", "днів"])} тому`
}
