import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import { useAuthStore } from "./store/useAuthStore.js"
import { useThemeStore } from "./store/useThemeStore.js"
import { useEffect, lazy, Suspense } from "react"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
import { TranslationProvider } from "./locales/TranslationContext.jsx"

// 懒加载页面组件
const HomePage = lazy(() => import("./pages/HomePage.jsx"))
const SignUpPage = lazy(() => import("./pages/SignUpPage.jsx"))
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"))
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"))
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"))

// 加载中组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader className="size-10 animate-spin" />
  </div>
)

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore()

  useEffect(() => {
    checkAuth()
  },[checkAuth])

  console.log('在线人数', {onlineUsers})

  if(isCheckingAuth && !authUser) {
    return <LoadingSpinner />
  }

  return (
    <TranslationProvider>
      <div data-theme={theme}>
        <Navbar />

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        <Toaster />
      </div>
    </TranslationProvider>
  )
}

export default App
