import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageDeleting: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  //信息订阅
  subscribeToMessages: () => {
    const { selectedUser } = get()
    if(!selectedUser) return

    //从useAuthStore拿到socket连接信息
    const socket = useAuthStore.getState().socket;

    socket.on('getNewMessage', (newMessage) => {
      //这个很重要 is message sent from selectId 
      if(newMessage.senderId !== selectedUser._id) return

      set({messages: [...get().messages, newMessage]})
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('getNewMessage')

  },
  //消息删除
  deleteMessage : async (messageId) => {
    toast.dismiss()
    if(get().isMessageDeleting) {
      toast('Message is deleting, please wait', {
        icon: '🕒',
      });
      return
    }
    set({ isMessageDeleting: true })
    try {
      await toast.promise(
        axiosInstance.delete(`/message/delete/${messageId}`).then(res => {
          if(res.data.success === true) {
            set((state) => ({
              messages: state.messages.filter((msg) => msg._id !== messageId)
            }))
          }
          console.log('后端：删除信息res', res.data)
          return res.data
        }),
        {
          loading: '删除中...',
          success: '消息删除成功！',
          error: '再试一次吧'
        }
      )
    } catch (error) {
      console.log('消息删除问题', error)
      toast.error('删除出错');
    } finally {
      set({ isMessageDeleting: false })
    }
  },
  subscribeToMessageDeletions: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get()
    if(!selectedUser) return

    if(socket) {
      socket.on('messageDeleted', ({ messageId }) => {
        set((state) => ({
          messages: state.messages.filter((msg) => msg._id !== messageId),
        }));
      });
    }
  },
  unsubscribeFromMessageDeletions: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('messageDeleted')
  },

  setSelectedUser: (selectedUser) => set({selectedUser}),
}))