import { create } from "zustand";
import en from '../locales/en.json'
import zh from '../locales/zh.json'

const allLanguages = {
  en: en,
  zh: zh
}

const getInitialLanguage = () => {
  const storedLang = localStorage.getItem('language')

  if (storedLang && (storedLang === 'en' || storedLang === 'zh')) {
    return storedLang;
  }
  return 'zh';
}

const useLanguageStore = create((set, get) => ({
  //当前语言
  language: getInitialLanguage(),
  //所有语言
  allLanguages: allLanguages,

  //切换方法
  setLanguage: (newLanguage) => {
    if(Object.keys(allLanguages).includes(newLanguage)) {
      set({ language: newLanguage })
      localStorage.setItem('language', newLanguage)
    } else {
      console.warn(`invalid language: ${newLanguage}`);
    }
  },
  //获取当前翻译
  t: (key) => {
    const currentLanguage = get().language
    return allLanguages[currentLanguage][key]
  }
}))

export default useLanguageStore