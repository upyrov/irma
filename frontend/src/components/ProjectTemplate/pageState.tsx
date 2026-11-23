import { errorMessage } from "#/api/hooks/useAuth"

/** Заглушка сторінки проєкту: завантаження / помилка / немає доступу */
export const PageState = ({ loading, error }: { loading?: boolean; error?: unknown }) => (
  <div className="flex flex-col gap-2 px-8 py-7">
    {loading ? (
      <p className="m-0 text-sm text-muted">Завантаження…</p>
    ) : (
      <>
        <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.02em]">
          Не вдалося відкрити проєкт
        </h1>
        <p className="m-0 text-sm text-danger-text">
          {error ? errorMessage(error) : "Проєкт не знайдено або у вас немає доступу."}
        </p>
      </>
    )}
  </div>
)

/** Помилка запиту над вмістом сторінки (напр. сервер відхилив переміщення задачі) */
export const ErrorBanner = ({ error }: { error: unknown }) =>
  error ? (
    <div role="alert" className="mx-8 mt-4 rounded-lg bg-danger-bg px-4 py-2.5 text-sm text-danger-text">
      {errorMessage(error)}
    </div>
  ) : null
