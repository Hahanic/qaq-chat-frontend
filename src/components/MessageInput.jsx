import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "../locales/TranslationContext"


const MessageInput = () => {
  const { t } = useTranslation()
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false)
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  
  //读取图片
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  //删除图片
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  //发送信息
  const handleSendMessage = async (e) => {
    e.preventDefault();
    toast.dismiss()

    if (!text.trim() && !imagePreview) return;
    // 如果消息正在发送
    if(isSending) {
      toast(t('sending'), {
        icon: '🕒',
      });
      return
    }
    setIsSending(true)
    try {

      await toast.promise(
        sendMessage({
          text: text.trim(),
          image: imagePreview,
        }),
        {
          loading: t('sending'),
          success: <b>{t('sendture')}</b>,
          error: <b>{t('sendfalse')}</b>,
        }
      );
      //清除
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error("fontend Failed to send message:", error);
    } finally {
      setIsSending(false)
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            className="
            w-full input rounded-lg input-sm sm:input-md
            focus:outline-none          {/* 移除默认的浏览器焦点轮廓 */}
            focus:border-blue-600       {/* 焦点时边框变为蓝色 */}
            "
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
