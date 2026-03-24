import { Icon } from "@iconify/react";
import { CATEGORY } from "../../utils/noticeConstants";
import { initials, isRecent, timeAgo } from "../../utils/helpers";

// Notice card for the dashboard feed list (not the public-facing NoticeCard)
export default function DashNoticeCard({ notice, isSelected, onClick }) {
  const cat = CATEGORY[notice.type] || CATEGORY.general;
  const recent = isRecent(notice.date);

  return (
    <button
      onClick={onClick}
      className={`select-none outline-0 cursor-pointer w-full text-left px-3 py-3.5 md:px-5 lg:px-8 lg:py-5 rounded-2xl flex flex-col gap-2.5 lg:gap-3 transition-all relative
        ${
          notice.pinned
            ? "bg-linear-to-r from-stone-50 to-zinc-100 border border-gray-200 hover:from-white hover:to-blue-1/60 hover:border-blue-4/30"
            : isSelected
              ? "bg-white shadow-sm shadow-secondary/5 border border-neutral-gray-3"
              : "bg-white border border-transparent hover:bg-section-bg hover:border-neutral-gray-3"
        }`}
    >
      {notice.pinned && (
        <span className="hidden lg:flex absolute top-3 right-3 lg:top-4 lg:right-4 text-neutral-gray-5">
          <Icon icon="mdi:pin" className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
        </span>
      )}

      <div className="flex items-center justify-between w-full">
        <span className="flex items-center gap-1 text-xs lg:text-sm text-primary-hover">
          <Icon icon={cat.icon} className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
          {cat.label}
        </span>
        <div className="flex justify-center gap-2">
          <span className="flex items-center gap-1 lg:gap-1.5 text-xs lg:text-sm text-neutral-gray-6">
            {recent && <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5 lg:w-4 lg:h-4" />}
            {timeAgo(notice.date)}
          </span>
          {notice.pinned && (
            <span className="text-neutral-gray-5 lg:hidden">
              <Icon icon="mdi:pin" className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 lg:gap-1.5">
        <p className="text-xs lg:text-base font-medium text-neutral-gray-10 leading-5 lg:leading-6">
          {notice.title}
        </p>
        <p className="text-xs lg:text-sm text-neutral-gray-7 leading-5 line-clamp-1">
          {notice.body}
        </p>
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5">
          {notice.authorAvatar ? (
            <img src={notice.authorAvatar} className="w-6 h-6 lg:w-7 lg:h-7 rounded-full object-cover" alt="" />
          ) : (
            <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-blue-1 flex items-center justify-center text-[10px] lg:text-xs font-semibold text-primary">
              {initials(notice.author)}
            </div>
          )}
          <span className="text-xs font-medium text-neutral-gray-9">{notice.author}</span>
          <span className="w-[3px] h-[3px] lg:w-1 lg:h-1 rounded-full bg-stone-300 shrink-0" />
          <span className="text-xs text-neutral-gray-6">{notice.authorRole}</span>
        </div>
        <div className="flex items-center gap-1 text-xs lg:text-sm text-neutral-gray-6">
          <Icon icon="iconamoon:comment" className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          <span>{notice.commentCount ?? 0}</span>
        </div>
      </div>
    </button>
  );
}
