import { Icon } from "@iconify/react";
import { initials, timeAgo } from "../../utils/helpers";

const BADGE_ROLES = new Set(["Lecturer", "Course Rep", "Administration", "Department"]);

export default function CommentBubble({
  comment,
  isReply = false,
  replyingTo,
  onReply,
  replyInput,
  onReplyInputChange,
  onReplySubmit,
}) {
  const isReplying = replyingTo === comment.id;
  const showBadge = BADGE_ROLES.has(comment.authorRole);

  return (
    <div className="flex flex-col">
      <div className="flex-1 px-4 py-3 bg-neutral-100 rounded-2xl flex flex-col gap-2.5 overflow-hidden">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="w-6 h-6 rounded-full bg-linear-to-b from-blue-8 to-blue-7 shadow-[0px_5px_10px_-3px_rgba(79,70,229,0.20)] flex items-center justify-center text-[8px] font-medium text-white shrink-0">
              {initials(comment.author)}
            </div>
            <span className={`font-medium text-neutral-gray-10 ${isReply ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"}`}>
              {comment.author}
            </span>
            {showBadge && (
              <span className="px-2.5 bg-blue-1 rounded-full outline-[0.63px] outline-offset-[-0.63px] outline-primary text-primary-hover text-[8px] leading-4 shrink-0">
                {comment.authorRole}
              </span>
            )}
          </div>
          <span className={`text-neutral-gray-6 shrink-0 ${isReply ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"}`}>
            {timeAgo(comment.date)}
          </span>
        </div>
        <p className={`text-neutral-gray-8 leading-normal ${isReply ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"}`}>
          {comment.body}
        </p>
        <button
          onClick={() => onReply(isReplying ? null : comment.id)}
          className={`text-primary py-0.5 inline-flex items-center gap-1.5 w-fit rounded-2xl ${isReply ? "text-[10px]" : "text-xs"}`}
        >
          {isReplying ? "Cancel" : "Reply"}
          <Icon icon="solar:reply-linear" className={`text-primary ${isReply ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
        </button>
      </div>

      {isReplying && (
        <div className="ml-9 mt-2 flex items-center gap-2 px-3.5 py-2 rounded-full outline outline-1 outline-primary bg-white">
          <input
            autoFocus
            value={replyInput}
            onChange={(e) => onReplyInputChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && replyInput.trim()) onReplySubmit(comment.id); }}
            placeholder={`Replying to ${comment.author}…`}
            className="flex-1 bg-transparent text-xs text-neutral-gray-9 placeholder:text-neutral-gray-5 outline-none min-w-0"
          />
          <button onClick={() => onReplySubmit(comment.id)} disabled={!replyInput.trim()} className="shrink-0 disabled:opacity-40">
            <Icon icon="mdi:send" className="w-4 h-4 text-primary" />
          </button>
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="ml-3 flex gap-5 mt-2">
          <div className="w-px bg-slate-200 self-stretch shrink-0" />
          <div className="flex-1 pt-3.5 flex flex-col gap-6">
            {comment.replies.map((r) => (
              <CommentBubble
                key={r.id}
                comment={r}
                isReply
                replyingTo={replyingTo}
                onReply={onReply}
                replyInput={replyInput}
                onReplyInputChange={onReplyInputChange}
                onReplySubmit={onReplySubmit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
