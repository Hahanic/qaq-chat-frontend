import { useEffect, useRef } from "react"
import { useChatStore } from "../store/useChatStore"
import MessageInput from "./MessageInput"
import ChatHeader from "./ChatHeader"
import MessageSkeleton from "./skeletons/MessageSkeleton"
import { useAuthStore } from "../store/useAuthStore"
import { formatMessageTime } from "../lib/utils"
import toast from "react-hot-toast"
import { useTranslation } from "../locales/TranslationContext"

const ChatContainer = () => {
  const { t } = useTranslation()

  const { authUser } = useAuthStore()
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages, subscribeToMessageDeletions, unsubscribeFromMessageDeletions, deleteMessage } = useChatStore()

  useEffect(() => {
    console.log('点击头像获取聊天记录')
    getMessages(selectedUser._id)
    subscribeToMessages()
    subscribeToMessageDeletions()

    return () => {
      unsubscribeFromMessages()
      unsubscribeFromMessageDeletions()
    }
  },[selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages, unsubscribeFromMessageDeletions, subscribeToMessageDeletions])

  //用于消息更新 自动滑到最底部
  const messageRef = useRef(null)

  useEffect(() => {
    if(messageRef.current && messages) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  //删除按钮
  const handleDeleteMessage = (messageId, senderId, t) => {
    toast.dismiss()

    console.log(messageId, senderId)
    if(senderId !== authUser._id) return
    toast(() => (
      <span>
        <b>{t('deletemes')}？ 🗑️</b>
        <button onClick={() => deleteMessage(messageId, t)}>
          {t('confirm')}🗑️
        </button>
      </span>
    ), {
      duration: 1000
    });
  }


  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageRef}
          >
            {/* 头像 */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            {/* message */}
            <div
              className={`
                chat-bubble flex flex-col
                ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}
              `}
              onClick={() => handleDeleteMessage(message._id, message.senderId, t)}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                  loading="lazy"
                />
              )}
              {message.text && <p className="text-sm">{message.text}</p>}
              {/* 时间日期 */}
              <div className="chat-header mb-1">
                <time className={`text-xs opacity-50 ${message.senderId !== authUser._id ? 'float-left' : 'float-right' }`}>
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            </div>
          </div>
        ))}
        </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer