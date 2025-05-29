import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { BASE_URL } from '../config/index.js'

export const useAuthStore = create((set, get) => ({
  //用户的各种状态
  authUser: null,
  isSigningUp: false,
  isLogginging: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  //是否正在检查
  isCheckingAuth: true,
  //正在存在的连接实例
  socket: null,
  //检查方法 后端jwt中间件
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check')

      set({ authUser: res.data })

      get().connectSocket()

    } catch (error) {
      set({ authUser: null })
      console.log('error in checkauth:', error)
    } finally {
      set({ isCheckingAuth: false })
    }
  },
  //注册方法
  signUp: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post('/auth/signup', data)
      toast.success('Account created successfully')

      set({ authUser: res.data })

      get().connectSocket()

    } catch (error) {
      console.log('signup catch:', error)
      toast.error(`signup catch:${error.response.data.message}`)
    } finally {
      set({ isSigningUp: false })

    }
  },
  //退出方法
  logOut: async () => {
    try {
      await axiosInstance.post('/auth/logout')
      set({ authUser: null })
      toast.success('Account logout successfully')

      //断开socket.io
      get().disconnectSocket()

    } catch (error) {
      console.log('signup catch:', error)
      toast.error(`signup catch:${error.response.data.message}`)
    }
  },
  //登录方法
  login: async (data) => {
    set({ isLogginging: true })
    try {
      const res = await axiosInstance.post('/auth/login', data)
      toast.success('登陆成功')

      set({ authUser: res.data })

      //连接socket.io
      get().connectSocket()

    } catch (error) {
      console.log('login catch:', error)
      toast.error(`login catch:${error.response.data.message}`)
    } finally {
      set({ isLogginging: false })
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put('/auth/update-profile', data)
      set({ authUser: res.data })
      toast.success('Profile updated successfully')

    } catch (error) {
      console.log('updateProfile catch:', error)
      toast.error(`updateProfile catch:${error.response.data.message}`)
    } finally {
      set({ isUpdatingProfile: false })
    }
  },
  connectSocket: () => {
    const { authUser } = get()
    if(!authUser || get().socket?.connected) return
    //创建实例=>连接服务器=>向服务器传递userId
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    })
    socket.connect()

    set({ socket: socket })
    //接收广播,并保存信息到本地onlineUsers
    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds })
    })
  },
  disconnectSocket: () => {
    if(get().socket?.connected) return get().socket.disconnect();

  },
}))