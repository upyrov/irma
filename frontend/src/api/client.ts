import type { ProblemDetails } from "#/types/api"

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5050").replace(/\/$/, "")

type ErrorBody = ProblemDetails & { message?: string; errorCode?: string }

export class ApiError extends Error {
  constructor(
    public status: number,
    public problem: ErrorBody = {}
  ) {
    super(problem.message ?? problem.detail ?? problem.title ?? `HTTP ${status}`)
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
    credentials: "include",
    headers: opts.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  })

  if (!res.ok) {
    const problem = await res.json().catch(() => ({}))
    throw new ApiError(res.status, problem)
  }

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
