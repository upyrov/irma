import { teams } from "#/tempData";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

type Props = {
    setIsOpenNewProject: (value: boolean) => void,
}

export const NewProject = ({setIsOpenNewProject}: Props) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/55 p-4">
            <form
    role="dialog"
    aria-modal="true"
    aria-labelledby="cp-title"
    className="flex w-full max-w-[760px] flex-col rounded-[18px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
  >
    <div className="flex items-start justify-between gap-4 px-7 pt-6">
      <div>
        <h2 id="cp-title" className="mb-1.5 font-['Manrope',sans-serif] text-2xl font-extrabold tracking-[-0.02em]">
          Новий проєкт
        </h2>
        <p className="text-sm text-muted">Колонки дошки створяться автоматично за обраним шаблоном.</p>
      </div>
      <button
        type="button"
        aria-label="Закрити"
        className="flex h-10 w-10 items-center justify-center rounded-[10px] text-muted hover:bg-hover"
        onClick={() => setIsOpenNewProject(false)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>

    <div className="flex flex-col gap-5 px-7 py-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        <div className="flex flex-col gap-1.5">
          {/* <label htmlFor="cp-name" className="text-sm font-semibold">Назва проєкту</label> */}
          <Label >Назва проєкту</Label>
          <input
            id="cp-name"
            type="text"
            className="h-11 rounded-[10px] border border-border-input px-3.5 text-[15px] text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cp-team" className="text-sm font-semibold">Команда</label>
            <Select>                       
          <SelectTrigger>             
            <SelectValue placeholder="Оберіть команду" /> 
          </SelectTrigger>
          <SelectContent>
            {teams.map((t) => (
                <SelectItem value={t.name}>{t.name}</SelectItem>
            ))}           
          </SelectContent>
        </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cp-desc" className="text-sm font-semibold">
          Опис <span className="font-normal text-muted">— необов'язково</span>
        </label>
        <Textarea placeholder="Коротко: що робимо і для кого" rows={3}/>
      </div>

      <fieldset className="m-0 flex flex-col gap-2.5 border-none p-0">
        <legend className="mb-2.5 p-0 text-sm font-semibold">Шаблон</legend>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
          {[
            { value: 'Scrum', title: 'Scrum', text: 'Спринти, беклог і планування. Дошка показує лише активний спринт.', columns: ['To Do', 'In Progress', 'Done'] },
            { value: 'Kanban', title: 'Kanban', text: 'Безперервний потік без спринтів. На дошці — всі неархівні задачі.', columns: ['Backlog', 'Selected', 'In Progress', 'Done'] },
            { value: 'BugTracking', title: 'Bug Tracking', text: 'Тріаж і виправлення багів. Без спринтів, баги сортуються за пріоритетом.', columns: ['New', 'Triage', 'In Progress', 'Fixed', 'Verified'] },
          ].map((tpl) => (
            <label
              key={tpl.value}
              className="flex cursor-pointer flex-col gap-3 rounded-[14px] border border-border-input bg-white p-4 has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:ring-1 has-[:checked]:ring-primary has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-primary/35"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold">{tpl.title}</span>
                <input
                  type="radio"
                  name="template"
                  value={tpl.value}
                  defaultChecked={tpl.value === 'Scrum'}
                  className="m-0 h-[18px] w-[18px] accent-primary"
                />
              </div>
              <span className="text-[13px] leading-normal text-text-2">{tpl.text}</span>
              <div aria-hidden="true" className="flex flex-wrap gap-1">
                {tpl.columns.map((c) => (
                  <span key={c} className="rounded-md bg-hover px-2 py-[3px] text-[11px] font-semibold text-text-2">
                    {c}
                  </span>
                ))}
              </div>
            </label>
          ))}
        </div>
      </fieldset>
    </div>


    <div className="flex flex-wrap justify-end gap-2.5 rounded-b-[18px] border-t border-border bg-[#FAFBFC] px-7 py-4">
        <Button variant={"secondary"} onClick={() => setIsOpenNewProject(false)}>
            Скасувати
        </Button>
        <Button type="submit">
            Створити проєкт
        </Button>
    </div>
  </form>
        </div>
  
);
}