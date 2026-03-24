import { useState } from "react";
import { Icon } from "@iconify/react";
import { timeAgo, initials, splitFilename } from "../../utils/helpers";
import { CATEGORY, ATTACH_ICONS } from "../../utils/noticeConstants";
import CountdownBadge from "./CountdownBadge";
import CommentBubble from "./CommentBubble";
import LinkCard from "./LinkCard";
import readingIllustration from "../../assets/svg/Reading a letter-pana.svg";

export default function NoticePreview({ notice, inModal = false }) {
  const [commentInput, setCommentInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyInput, setReplyInput] = useState("");
  const cat = notice ? CATEGORY[notice.type] : null;

  function handleReply(id) { setReplyingTo(id); setReplyInput(""); }
  function handleReplySubmit() { setReplyingTo(null); setReplyInput(""); }

  if (!notice) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 border-l border-neutral-gray-3 overflow-hidden pb-8">
        <img src={readingIllustration} alt="" className="w-72 h-72 object-contain" />
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-medium text-neutral-gray-10">Notice Preview</p>
          <p className="text-base text-neutral-gray-7">Click a notice to see its content here</p>
        </div>
      </div>
    );
  }

  const hasAttachments = notice.attachments?.length > 0;
  const hasLinks = notice.links?.length > 0;
  const hasComments = notice.comments?.length > 0;

  const contentCls = inModal
    ? "overflow-y-auto scrollbar-hide px-5 pt-6 pb-4 flex flex-col gap-5 max-h-[calc(85vh-5rem)]"
    : "flex-1 min-h-0 overflow-y-auto scrollbar-hide px-8 py-6 flex flex-col gap-8";

  return (
    <div className={inModal ? "flex flex-col" : "flex-1 border-l border-neutral-gray-3 overflow-hidden flex flex-col"}>
      {!inModal && (
        <div className="px-8 py-4 border-b border-neutral-gray-3">
          <h2 className="text-[15px] lg:text-base text-center font-medium text-neutral-gray-7">Preview</h2>
        </div>
      )}
      <div className={contentCls}>
        <div className="flex flex-col gap-5 items-start w-full">
          <div className="w-full flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-1 text-primary text-xs md:text-sm">
              <Icon icon={cat.icon} className="w-3.5 h-3.5" />
              {cat.label}
            </span>
            <span className="text-xs md:text-sm text-neutral-gray-6">{timeAgo(notice.date)}</span>
          </div>
          <h2 className="text-xl font-semibold text-secondary max-w-[85%] leading-normal">{notice.title}</h2>
          <div className="flex items-center gap-3 justify-between w-full">
            {notice.authorAvatar ? (
              <img src={notice.authorAvatar} className="w-14 h-14 rounded-full object-cover shrink-0" alt="" />
            ) : (
              <div className="w-14 h-14 rounded-full text-neutral-gray-1 bg-linear-to-b from-blue-8 to-blue-7 flex items-center justify-center text-xl font-bold shrink-0">
                {initials(notice.author)}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <p className="text-sm lg:text-base font-semibold text-secondary">{notice.author}</p>
              <p className="text-xs lg:text-sm text-neutral-gray-6 font-medium">{notice.authorRole}</p>
            </div>
            <div className="ml-auto flex items-center gap-3 text-xs md:text-sm text-neutral-gray-6">
              {hasAttachments && (
                <span className="flex items-center gap-1">
                  <Icon icon="iconamoon:attachment" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {notice.attachments.length}
                </span>
              )}
              {hasLinks && (
                <span className="flex items-center gap-1">
                  <Icon icon="solar:link-bold" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  {notice.links.length}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Icon icon="iconamoon:comment" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {notice.commentCount ?? 0}
              </span>
            </div>
          </div>
        </div>

        {notice.dueDate && <CountdownBadge dueDate={notice.dueDate} type={notice.type} />}

        <p className="text-sm text-neutral-gray-7 leading-[1.75] whitespace-pre-wrap max-w-[540px]">{notice.body}</p>

        {hasAttachments && (
          <div className="flex flex-col gap-3 md:gap-3.5">
            <p className="text-xs md:text-sm font-medium text-dashboard-heading">Attachments</p>
            <div className="flex flex-row flex-wrap gap-2">
              {notice.attachments.map((att) => {
                const ai = ATTACH_ICONS[att.type] || { icon: "mdi:file-document-outline" };
                return (
                  <a key={att.id} href="#" className="relative w-full md:w-[250px] h-14 pl-2 py-2 bg-zinc-100 rounded-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] border border-neutral-gray-3 flex justify-between items-center gap-1.5 hover:bg-neutral-gray-3 transition-colors group">
                    <div className="flex items-center gap-1.5 w-full">
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        <Icon icon={ai.icon} className="w-7 h-7 text-neutral-gray-7" />
                      </div>
                      <div className="flex flex-col gap-0.5 w-full">
                        <span className="text-xs font-medium text-secondary flex items-center max-w-[75%]">
                          <span className="truncate">{splitFilename(att.name).base}</span>
                          <span className="shrink-0">{splitFilename(att.name).ext}</span>
                        </span>
                        <span className="text-xs text-neutral-gray-6">{att.size}</span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-[0px_1px_2px_0px_rgba(10,13,18,0.10)] flex items-center justify-center shrink-0">
                      <Icon icon="mage:download" className="w-3.5 h-3.5 text-neutral-gray-7" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {hasLinks && (
          <div className="flex flex-col gap-3 md:gap-3.5">
            <p className="text-xs md:text-sm font-medium text-dashboard-heading">Related Links</p>
            <div className="flex flex-row flex-wrap gap-1.5">
              {notice.links.map((lnk) => <LinkCard key={lnk.id} lnk={lnk} />)}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center gap-2 text-dashboard-heading">
            <Icon icon="iconamoon:comment" className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <p className="text-xs md:text-sm font-medium">Comments ({notice.commentCount ?? 0})</p>
          </div>
          {hasComments ? (
            <div className="flex flex-col gap-4">
              {notice.comments.map((c) => (
                <CommentBubble
                  key={c.id}
                  comment={c}
                  replyingTo={replyingTo}
                  onReply={handleReply}
                  replyInput={replyInput}
                  onReplyInputChange={setReplyInput}
                  onReplySubmit={handleReplySubmit}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs md:text-sm text-neutral-gray-5">No comments yet.</p>
          )}
        </div>
      </div>

      <div className={`shrink-0 flex items-center gap-2 border-t border-neutral-gray-3 ${inModal ? "px-5 py-3" : "px-8 py-4"}`}>
        <div className="w-7 h-7 rounded-full bg-blue-1 flex items-center justify-center text-xs font-semibold text-primary shrink-0">Y</div>
        <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-full outline outline-1 outline-neutral-gray-4 focus-within:outline-primary transition-colors">
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 bg-transparent text-xs text-neutral-gray-9 placeholder:text-neutral-gray-5 outline-none min-w-0"
          />
          <button disabled={!commentInput.trim()} className="shrink-0 disabled:opacity-40">
            <Icon icon="mdi:send" className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
