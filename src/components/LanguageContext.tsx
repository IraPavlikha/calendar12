import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  uk: {
    tasksFor: 'Завдання на',
    newTask: 'Нове завдання',
    add: 'Додати',
    close: 'Закрити',
    edit: 'Редагування',
    save: 'Зберегти',
    cancel: 'Скасувати',
    noTasks: 'Завдань немає',
    editTask: 'Редагувати завдання',
    save: 'Зберегти',
    delete: 'Видалити',
  },
  en: {
    tasksFor: 'Tasks for',
    newTask: 'New task',
    add: 'Add',
    close: 'Close',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    noTasks: 'No tasks',
    editTask: 'Edit Task',
    save: 'Save',
    delete: 'Delete',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'uk',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uk');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
