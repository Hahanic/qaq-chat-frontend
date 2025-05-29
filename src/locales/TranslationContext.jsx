import { createContext, useContext } from "react";
import useLanguageStore from "./useLanguageStore";
//context对象
const TranslationContext = createContext(null)
//provider组件
export const TranslationProvider = ({ children }) => {
  const { t, language, setLanguage } = useLanguageStore()
  //把共享数据打包成一个对象
  const valueToShare = { t, language, setLanguage }

  return (
    <TranslationContext.Provider value={valueToShare}>
      {children}
    </TranslationContext.Provider>
  )
}

// 3. 创建自定义 Hook：方便组件消费 Context
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === null) {
    // 如果没有被 TranslationProvider 包裹，就抛出错误，帮助调试
    throw new Error('useTranslation 必须在 TranslationProvider 内部使用');
  }
  return context;
};