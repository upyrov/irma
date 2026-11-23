import { errorMessage } from "#/api/hooks/useAuth"
import { PageSpinner } from "#/components/ui/spinner"

export const PageState = ({ loading, error }: { loading?: boolean; error?: unknown }) => (
  <div className="flex flex-col gap-2 px-8 py-7">
    {loading ? (
      <PageSpinner label="Завантаження проєкту" className="min-h-[60vh]" />
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

export const ErrorBanner = ({ error }: { error: unknown }) =>
  error ? (
    <div role="alert" className="mx-8 mt-4 rounded-lg bg-danger-bg px-4 py-2.5 text-sm text-danger-text">
      {errorMessage(error)}
    </div>
  ) : null
