const dateFormat = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "short",
})

export const formatDate = (iso: string) => dateFormat.format(new Date(iso))

export const formatRange = (start: string, end: string) =>
  `${formatDate(start)} – ${formatDate(end)}`

/** plural(3, ["задача", "задачі", "задач"]) → "задачі" */
export const plural = (n: number, [one, few, many]: [string, string, string]) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export const issuesCount = (n: number) =>
  `${n} ${plural(n, ["задача", "задачі", "задач"])}`

export const daysLeft = (end: string) => {
  const ms = new Date(end).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}
