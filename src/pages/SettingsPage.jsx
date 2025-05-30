import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore.js";
import { Send } from "lucide-react";
import Lottie from "lottie-web";
import animationData from '../assets/Animation-rotate.json'
import { useEffect, useRef } from "react";
import useLanguageStore from "../locales/useLanguageStore.js";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { setLanguage, t, language } = useLanguageStore()

  const lottieContainer = useRef(null)
  const lottieInstance = useRef(null)

  useEffect(() => {
    if(lottieContainer.current) {
      // 销毁旧的Lottie实例，防止组件重复渲染导致多个动画实例
      if(lottieInstance.current) {
        lottieInstance.current.destroy()
      }
      //
      lottieInstance.current = Lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData
      })
    };

    // 清理函数：组件卸载时销毁Lottie实例，防止内存泄漏
    return () => {
      if (lottieInstance.current) {
        lottieInstance.current.destroy();
        lottieInstance.current = null; // 清除引用
      }
    };
  }, [])

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold mb-4">{t('toggleLang')}</h2>
          <div className="grid grid-cols-2">
            <button
              onClick={() => setLanguage('zh')}
              className={`btn ${language === 'zh' ? 'btn-primary' : 'btn-ghost'}`}
            >中文</button>
            <button
              onClick={() => setLanguage('en')}
              className={`btn ${language === 'en' ? 'btn-primary' : 'btn-ghost'}`}
            >English</button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">{t('theme')}</h2>
          <p className="text-sm text-base-content/70">{t('themedesc')}</p>
        </div>
          {/* sm:grid-cols-8 md:grid-cols-8  */}
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">{t('preview')}</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-xs overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{t('prename')}</h3>
                      <p className="text-xs text-base-content/70">{t('online')}</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-xs
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          <div
            ref={lottieContainer}
            style={{ width: '100px', height: '100px', margin: '0 auto' }}
          ></div>
      </div>
    </div>
  );
};
export default SettingsPage;
