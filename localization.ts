export type Language = 'uk' | 'en';

export const translations = {
  uk: {
    editTask: 'Редагувати завдання',
    save: 'Зберегти',
    delete: 'Видалити',
    newTask: 'Нове завдання',
    noTasks: 'Завдань немає',
    today: 'Сьогодні',
    tasksFor: 'Завдання на',
  },
  en: {
    editTask: 'Edit Task',
    save: 'Save',
    delete: 'Delete',
    newTask: 'New Task',
    noTasks: 'No tasks',
    today: 'Today',
    tasksFor: 'Tasks for',
  },
};

export const getLocalizedString = (lang: Language, key: keyof typeof translations.uk) =>
  translations[lang][key];
