import type { ProblemDetails } from "#/types/api"

/**
 * Поки бекенд не готовий — усі функції API працюють із заглушкою в пам'яті (`mock/`).
 * Щоб перейти на справжній бекенд, задай у `.env.local`:
 *   VITE_USE_MOCKS=false
 *   VITE_API_URL=http://localhost:5172
 */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false"

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5172").replace(/\/$/, "")

export class ApiError extends Error {
  constructor(
    public status: number,
    public problem: ProblemDetails = {}
  ) {
    super(problem.detail ?? problem.title ?? `HTTP ${status}`)
    this.name = "ApiError"
  }
}

type Query = Record<string, string | number | boolean | null | undefined>

type RequestOptions = {
  query?: Query
  body?: unknown
  signal?: AbortSignal
}

const buildUrl = (path: string, query?: Query) => {
  const url = new URL(`${API_URL}${path}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
  }
  return url
}

async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
  const res = await fetch(buildUrl(path, opts.query), {
    method,
    // JWT лежить у HttpOnly cookie — браузер має надсилати її сам
    credentials: "include",
    headers: opts.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  })

  if (!res.ok) {
    const problem = await res.json().catch(() => ({}))
    throw new ApiError(res.status, problem)
  }

  // 204 No Content / порожнє тіло
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const http = {
  get: <T>(path: string, opts?: Omit<RequestOptions, "body">) => request<T>("GET", path, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("POST", path, { ...opts, body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("PUT", path, { ...opts, body }),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>("DELETE", path, opts),
}
