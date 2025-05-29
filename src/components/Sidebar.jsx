import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useTranslation } from "../locales/TranslationContext";

const Sidebar = () => {
  const { t } = useTranslation()

  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  //用filteredUsers来  showOnlineOnly
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  //消息列表加载中
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className={`h-full w-40 lg:w-72 flex flex-col border-r border-base-300 transition-all duration-200 ${selectedUser ? 'sm:flex hidden' : '' }`}>
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 sm:justify-start justify-center">
          <Users className="size-6" />
          <span className="font-medium hidden sm:inline">{t('contacts')}</span>
        </div>
        {/* 在线 */}
        <div className="mt-3 flex items-center gap-2 sm:justify-start justify-center">
          {/* 点 */}
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm hidden lg:inline">{t('showstate')}</span>
          </label>
          {/* 数 */}
          <span className="text-xs text-zinc-500  hidden sm:inline">({onlineUsers.length - 1} {t('online')})</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 min-w-12 min-h-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden sm:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? t('online') : t('offline')}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">{t('noonline')}</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
