const exact: Record<string, string> = {
  "Attempted to perform an unauthorized operation.": "Сесія завершилась — увійдіть знову",
  "You are not a member of this project.": "Ви не учасник цього проєкту",
  "You are not a member of this team.": "Ви не учасник цієї команди",
  "Viewers cannot modify the project.": "Переглядач не може змінювати проєкт",
  "Only the project owner or admins can do this.": "Це можуть лише Owner та Admin проєкту",
  "Members can only change the status of issues assigned to them.":
    "Статус чужої задачі може змінити лише її виконавець або адміністратор",
  "Members cannot reassign issues assigned to other users.":
    "Перепризначити чужу задачу може лише адміністратор",
  "User with this username already exists.": "Користувач з таким username уже існує",
  "Username and password are required.": "Вкажіть username і пароль",
  "Username is required.": "Вкажіть username",
  "Username cannot be blank.": "Username не може бути порожнім",
  "Username must be at least 3 characters long.": "Username має містити щонайменше 3 символи",
  "Username must not exceed 50 characters.": "Username — до 50 символів",
  "Password is required.": "Вкажіть пароль",
  "Password must be at least 8 characters long.": "Пароль має містити щонайменше 8 символів",
  "Password must not exceed 128 characters.": "Пароль — до 128 символів",
  "Team name is required.": "Вкажіть назву команди",
  "Team name must not exceed 100 characters.": "Назва команди — до 100 символів",
  "Team not found.": "Команду не знайдено",
  "User not found.": "Користувача не знайдено",
  "User is already a member of this team.": "Користувач уже в команді",
  "Project name is required.": "Вкажіть назву проєкту",
  "Project name must not exceed 100 characters.": "Назва проєкту — до 100 символів",
  "Project not found.": "Проєкт не знайдено",
  "TeamId is required.": "Оберіть команду",
  "ProjectId is required.": "Не вказано проєкт",
  "Owner role cannot be assigned to a new project member.": "Роль Owner не можна призначити новому учаснику",
  "Owner role cannot be changed.": "Роль власника проєкту змінити не можна",
  "User is not a member of the project's team.": "Користувача немає в команді проєкту — спершу додайте його на сторінці «Команди»",
  "Target user was not found.": "Користувача не знайдено",
  "Sprint name is required.": "Вкажіть назву спринту",
  "Sprint name must not exceed 100 characters.": "Назва спринту — до 100 символів",
  "Sprint was not found.": "Спринт не знайдено",
  "Only a planned sprint can be started.": "Запустити можна лише запланований спринт",
  "The project already has an active sprint.": "У проєкті вже є активний спринт — спершу завершіть його",
  "Only an active sprint can be completed.": "Завершити можна лише активний спринт",
  "EndDate must be greater than or equal to StartDate.": "Дата завершення не може бути раніше за дату початку",
  "Issue title is required.": "Вкажіть назву задачі",
  "Issue title must not exceed 200 characters.": "Назва задачі — до 200 символів",
  "Title cannot be empty.": "Назва не може бути порожньою",
  "Title must not exceed 200 characters.": "Назва — до 200 символів",
  "Description must not exceed 4000 characters.": "Опис — до 4000 символів",
  "Story points must be between 1 and 100.": "Story points — від 1 до 100",
  "Issue was not found.": "Задачу не знайдено",
  "Issue cannot be its own epic.": "Задача не може бути власним епіком",
  "An epic cannot belong to another epic.": "Епік не може входити в інший епік",
  "Cannot add an issue to a closed sprint.": "Не можна додати задачу в закритий спринт",
  "Stage was not found.": "Колонку не знайдено",
  "StageId is required.": "Не вказано колонку",
  "StageId cannot be empty.": "Не вказано колонку",
  "Stage does not belong to this project.": "Колонка не з цього проєкту",
  "Sprint does not belong to this project.": "Спринт не з цього проєкту",
  "Epic does not belong to this project.": "Епік не з цього проєкту",
  "Assignee is not a member of this project.": "Виконавець не є учасником проєкту",
  "Comment text is required.": "Коментар не може бути порожнім",
  "Comment text must not exceed 2000 characters.": "Коментар — до 2000 символів",
}

const byStatus: Record<number, string> = {
  401: "Сесія завершилась — увійдіть знову",
  403: "Недостатньо прав для цієї дії",
  404: "Не знайдено",
  409: "Конфлікт: дані вже змінились — оновіть сторінку",
}

export const translateServerMessage = (message: string | undefined, status: number) => {
  const text = message?.trim()
  if (text && exact[text]) return exact[text]
  if (!text || text === `HTTP ${status}` || /^One or more validation errors/i.test(text)) {
    return byStatus[status] ?? "Не вдалося виконати дію"
  }
  return text
}
