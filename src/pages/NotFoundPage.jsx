import { useEffect, useRef } from "react"
import Lottie from "lottie-web"
import animation404 from '../assets/Animation-404.json'


const NotFoundPage = () => {
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
        animationData: animation404
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
    <>
      <div className="h-screen">
        <div className="flex flex-col items-center justify-center pt-20">
          NotFoundPage
          <div
          ref={lottieContainer}
          >
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage