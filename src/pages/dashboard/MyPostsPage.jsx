import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { initials, timeAgo, isRecent, matchesDate, splitFilename } from "../../utils/helpers";
import { CATEGORY, DATE_FILTERS, getAttachIcon } from "../../utils/noticeConstants";
import CountdownBadge from "../../components/dashboard/CountdownBadge";
import FilterPills from "../../components/dashboard/FilterPills";
import readingIllustration from "../../assets/svg/Reading a letter-pana.svg";
import { postsService } from "../../services/posts.service";
import { normalizeNotice } from "../../services/notices.service";
import { commentsService } from "../../services/comments.service";
import { useAuth } from "../../hooks/useAuth";
import { useNotices } from "../../hooks/useNotices";
import CommentBubble from "../../components/dashboard/CommentBubble";
import LinkCard from "../../components/dashboard/LinkCard";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ROLE_MAP = { student: "Student", course_rep: "Course Rep", lecturer: "Lecturer", admin: "Admin" };
function normalizeComment(c) {
  return {
    id: c.id,
    body: c.body,
    author: c.author?.full_name ?? "Unknown",
    authorRole: ROLE_MAP[c.author?.role] ?? "",
    date: c.createdAt ?? c.created_at ?? null,
    replies: (c.replies ?? []).map(normalizeComment),
  };
}

// ─── Config ───────────────────────────────────────────────────────────────────
const FILTERS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "pinned", label: "Pinned" },
];


// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, pinned }) {
  return (
    <div className="flex items-center gap-2">
      {status === "published" ? (
        <span className="px-3 py-1 bg-success-1 rounded-full outline-[0.80px] outline-offset-[-0.80px] outline-success-4 text-success-7 text-xs lg:text-sm">
          Published
        </span>
      ) : (
        <span className="px-3 py-1 bg-warning-1 rounded-full outline-[0.80px] outline-offset-[-0.80px] outline-warning-4 text-warning-7 text-xs lg:text-sm">
          Draft
        </span>
      )}
      {pinned && (
        <span className="px-3 py-1 bg-error-1 rounded-full outline-[0.80px] outline-offset-[-0.80px] outline-error-4 text-error-7 text-xs lg:text-sm">
          Pinned
        </span>
      )}
    </div>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────
function PostCard({ post, isSelected, onClick, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const cat = CATEGORY[post.type] || CATEGORY.general;
  const recent = isRecent(post.date);

  return (
    <>
      {/* Card — untouched */}
      <div
        onClick={onClick}
        className={`group select-none cursor-pointer w-full text-left px-3 py-3.5 md:px-5 lg:px-8 lg:py-5 rounded-2xl flex flex-col gap-2.5 lg:gap-3 transition-all relative
          ${
            isSelected
              ? "bg-white shadow-sm shadow-secondary/5 border border-neutral-gray-3"
              : "bg-white border border-transparent hover:bg-section-bg hover:border-neutral-gray-3"
          }`}
      >
        {/* Edit / Delete action buttons — visible on hover */}
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(post); }}
            title="Edit post"
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-neutral-gray-6 hover:text-primary hover:bg-blue-1 transition-colors"
          >
            <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmingDelete(true); }}
            title="Delete post"
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-sm text-neutral-gray-6 hover:text-error-7 hover:bg-error-1 transition-colors"
          >
            <Icon icon="mdi:trash-can-outline" className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-4 lg:gap-6 flex-wrap">
            <span className="flex items-center gap-1 text-xs lg:text-sm text-primary-hover">
              <Icon
                icon={cat.icon}
                className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0"
              />
              {cat.label}
            </span>
            <StatusBadge status={post.status} pinned={post.pinned} />
          </div>
          <span className="flex items-center gap-1 lg:gap-1.5 text-xs lg:text-sm text-neutral-gray-6 shrink-0 group-hover:mr-12">
            {recent && (
              <Icon
                icon="mdi:clock-outline"
                className="w-3.5 h-3.5 lg:w-4 lg:h-4"
              />
            )}
            {timeAgo(post.date)}
          </span>
        </div>
        <div className="flex flex-col gap-1 lg:gap-1.5">
          <p className="text-xs lg:text-base font-medium text-neutral-gray-10 leading-5 lg:leading-6">
            {post.title}
          </p>
          <p className="text-xs lg:text-sm text-neutral-gray-7 leading-5 line-clamp-1">
            {post.body}
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-blue-1 flex items-center justify-center text-[10px] lg:text-xs font-semibold text-primary">
              {initials(post.author)}
            </div>
            <span className="text-xs font-medium text-neutral-gray-9">
              {post.author}
            </span>
            <span className="w-[3px] h-[3px] lg:w-1 lg:h-1 rounded-full bg-stone-300 shrink-0" />
            <span className="text-xs text-neutral-gray-6">{post.authorRole}</span>
          </div>
          <div className="flex items-center gap-2 text-xs lg:text-sm text-neutral-gray-6">
            {post.editedAt && (
              <span className="flex items-center gap-1 text-neutral-gray-5 italic">
                <Icon icon="mdi:pencil-outline" className="w-3 h-3" />
                Edited
              </span>
            )}
            <span className="flex items-center gap-1">
              <Icon icon="iconamoon:comment" className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              {post.commentCount ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmingDelete && (
        <Modal onClose={() => setConfirmingDelete(false)} className="max-w-sm" xIcon={false} dragHandle={false}>
          <div className="flex flex-col items-center gap-5 p-4">
            <div className="w-14 h-14 rounded-full bg-error-1 flex items-center justify-center">
              <Icon icon="mdi:trash-can-outline" className="w-7 h-7 text-error-8" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h3 className="text-base font-semibold text-neutral-gray-10">Delete this post?</h3>
              <p className="text-sm text-neutral-gray-6">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl border border-neutral-gray-4 text-sm font-medium text-neutral-gray-8 hover:bg-neutral-gray-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(post.id);
                  setConfirmingDelete(false);
                }}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-error-7 text-sm font-medium text-white hover:bg-error-8 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── Link card ────────────────────────────────────────────────────────────────
// function LinkCard({ lnk }) {
//   const [copied, setCopied] = useState(false);
//   function handleCopy(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     navigator.clipboard.writeText(lnk.url).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1500);
//     });
//   }
//   return (
//     <a
//       href={lnk.url}
//       target="_blank"
//       rel="noreferrer"
//       className="w-full md:w-[250px] relative bg-zinc-100 rounded-xl px-4 py-2.5 overflow-hidden flex flex-col gap-0.5 hover:bg-neutral-gray-3 transition-colors group"
//     >
//       <p className="text-xs font-medium text-secondary leading-5 pr-8 max-w-[88%] w-full truncate">
//         {lnk.label || lnk.desc}
//       </p>
//       <p className="text-xs text-neutral-gray-6 truncate pr-8">{lnk.url}</p>
//       <button
//         onClick={handleCopy}
//         title={copied ? "Copied!" : "Copy URL"}
//         className="cursor-pointer absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.20)] flex items-center justify-center hover:bg-neutral-gray-2 transition-colors shrink-0"
//       >
//         <Icon
//           icon={copied ? "mdi:check" : "solar:copy-linear"}
//           className={`w-3.5 h-3.5 transition-colors ${copied ? "text-green-600" : "text-neutral-gray-7"}`}
//         />
//       </button>
//     </a>
//   );
// }

// ─── Post preview panel ───────────────────────────────────────────────────────
function PostPreview({ post, inModal = false, createMode = false, onEdit, onDelete, onPublishDraft }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyInput, setReplyInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const cat = post ? CATEGORY[post.type] || CATEGORY.general : null;

  const fetchComments = useCallback(async (id) => {
    try {
      const { data } = await commentsService.getByNotice(id);
      setComments((data?.data ?? []).map(normalizeComment));
    } catch { setComments([]); }
  }, []);

  useEffect(() => {
    if (!post?.id || createMode) { setComments([]); setCommentCount(0); return; }
    setCommentCount(post.commentCount ?? 0);
    setCommentInput(""); setReplyingTo(null); setReplyInput("");
    fetchComments(post.id);
  }, [post?.id, createMode, fetchComments]);

  async function handleCommentSubmit() {
    if (!commentInput.trim() || submitting) return;
    setSubmitting(true);
    try {
      await commentsService.create(post.id, { body: commentInput.trim() });
      setCommentInput("");
      setCommentCount((n) => n + 1);
      fetchComments(post.id);
    } catch { } finally { setSubmitting(false); }
  }

  async function handleReplySubmit(parentId) {
    if (!replyInput.trim() || submitting) return;
    setSubmitting(true);
    try {
      await commentsService.create(post.id, { body: replyInput.trim(), parentId });
      setReplyInput(""); setReplyingTo(null);
      setCommentCount((n) => n + 1);
      fetchComments(post.id);
    } catch { } finally { setSubmitting(false); }
  }

  function handleReply(id) { setReplyingTo(id); setReplyInput(""); }

  if (!post || (!post.title && !createMode)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 border-l border-neutral-gray-3 overflow-hidden pb-8">
        <img
          src={readingIllustration}
          alt=""
          className="w-72 h-72 object-contain"
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-2xl font-medium text-neutral-gray-10">
            Notice Preview
          </p>
          <p className="text-base text-neutral-gray-7">
            {createMode
              ? "Fill in the form to see a live preview"
              : "Click a notice to see its content here"}
          </p>
        </div>
      </div>
    );
  }

  const hasAttachments = post.attachments?.length > 0;
  const hasLinks = post.links?.length > 0;

  const contentCls = inModal
    ? "overflow-y-auto scrollbar-hide px-5 pt-6 pb-4 flex flex-col gap-5 max-h-[calc(85vh-5rem)]"
    : "flex-1 min-h-0 overflow-y-auto scrollbar-hide px-8 py-6 flex flex-col gap-8";

  return (
    <div
      className={
        inModal
          ? "flex flex-col"
          : "flex-1 border-l border-neutral-gray-3 overflow-hidden flex flex-col"
      }
    >
      {!inModal && (
        <div className="px-8 py-4 border-b border-neutral-gray-3">
          <h2 className="text-[15px] lg:text-base text-center font-medium text-neutral-gray-7">
            Preview
          </h2>
        </div>
      )}
      <div className={contentCls}>
        <div className="flex flex-col gap-5 items-start w-full">
          {/* Category pill + status + date */}
          <div className="w-full flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-1 text-primary text-xs md:text-sm">
                <Icon icon={cat.icon} className="w-3.5 h-3.5" />
                {cat.label}
              </span>
              {!createMode && (
                <StatusBadge status={post.status} pinned={post.pinned} />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-neutral-gray-6">
                {timeAgo(post.date)}
              </span>
              {!createMode && (
                <div className="flex items-center gap-1.5">
                  {post.status === "draft" && onPublishDraft && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onPublishDraft(post.id); }}
                      title="Publish this draft"
                      className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-[10px] bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit?.(post); }}
                    title="Edit post"
                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-neutral-gray-2 text-neutral-gray-6 hover:text-primary hover:bg-blue-1 transition-colors"
                  >
                    <Icon icon="mdi:pencil-outline" className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmingDelete(true); }}
                    title="Delete post"
                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-neutral-gray-2 text-neutral-gray-6 hover:text-error-7 hover:bg-error-1 transition-colors"
                  >
                    <Icon icon="mdi:trash-can-outline" className="w-4.5 h-4.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-secondary max-w-[85%] leading-normal">
            {post.title || (
              <span className="text-neutral-gray-4 italic">
                Your title will appear here…
              </span>
            )}
          </h2>

          {/* Author row */}
          <div className="flex items-center gap-3 justify-between w-full">
            <div className="w-14 h-14 rounded-full text-neutral-gray-1 bg-linear-to-b from-blue-8 to-blue-7 flex items-center justify-center text-xl font-bold shrink-0">
              {initials(post.author)}
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm lg:text-base font-semibold text-secondary">
                {post.author}
              </p>
              <p className="text-xs lg:text-sm text-neutral-gray-6 font-medium">
                {post.authorRole}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3 text-xs md:text-sm text-neutral-gray-6">
              {hasAttachments && (
                <span className="flex items-center gap-1">
                  <Icon
                    icon="iconamoon:attachment"
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                  />
                  {post.attachments.length}
                </span>
              )}
              {hasLinks && (
                <span className="flex items-center gap-1">
                  <Icon
                    icon="solar:link-bold"
                    className="w-3.5 h-3.5 md:w-4 md:h-4"
                  />
                  {post.links.length}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Icon
                  icon="iconamoon:comment"
                  className="w-3.5 h-3.5 md:w-4 md:h-4"
                />
                {commentCount}
              </span>
            </div>
          </div>
        </div>

        {/* Countdown badge */}
        {post.dueDate && (
          <CountdownBadge dueDate={post.dueDate} type={post.type} />
        )}

        {/* Body */}
        <p className="text-sm text-neutral-gray-7 leading-[1.75] whitespace-pre-wrap max-w-[540px]">
          {post.body || (
            <span className="italic text-neutral-gray-4">
              Your content will appear here…
            </span>
          )}
        </p>

        {/* Attachments */}
        {hasAttachments && (
          <div className="flex flex-col gap-3 md:gap-3.5">
            <p className="text-xs md:text-sm font-medium text-dashboard-heading">
              Attachments
            </p>
            <div className="flex flex-row flex-wrap gap-2">
              {post.attachments.map((att) => {
                const ai = getAttachIcon(att.type);
                return (
                  <a
                    key={att.id}
                    href={att.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="relative w-full md:w-[250px] h-14 pl-2 py-2 bg-zinc-100 rounded-[10px] border border-neutral-gray-3 flex justify-between items-center gap-1.5 hover:bg-neutral-gray-3 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 w-full">
                      <Icon
                        icon={ai.icon}
                        className="w-7 h-7 text-neutral-gray-7 shrink-0"
                      />
                      <div className="flex flex-col gap-0.5 w-full">
                        <span className="text-xs font-medium text-secondary flex items-center max-w-[75%]">
                          <span className="truncate">
                            {splitFilename(att.name).base}
                          </span>
                          <span className="shrink-0">
                            {splitFilename(att.name).ext}
                          </span>
                        </span>
                        <span className="text-xs text-neutral-gray-6">
                          {att.size}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shrink-0">
                      <Icon
                        icon="mage:download"
                        className="w-3.5 h-3.5 text-neutral-gray-7"
                      />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Related links */}
        {hasLinks && (
          <div className="flex flex-col gap-3 md:gap-3.5">
            <p className="text-xs md:text-sm font-medium text-dashboard-heading">
              Related Links
            </p>
            <div className="flex flex-row flex-wrap gap-1.5">
              {post.links.map((lnk, i) => (
                <LinkCard key={lnk.id ?? i} lnk={lnk} />
              ))}
            </div>
          </div>
        )}

        {/* Comments — hide in create mode */}
        {!createMode && (
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center gap-2 text-dashboard-heading">
              <Icon
                icon="iconamoon:comment"
                className="w-3.5 h-3.5 md:w-4 md:h-4"
              />
              <p className="text-xs md:text-sm font-medium">
                Comments ({commentCount})
              </p>
            </div>
            {comments.length > 0 ? (
              <div className="flex flex-col gap-4">
                {comments.map((c) => (
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
              <p className="text-xs md:text-sm text-neutral-gray-5">
                No comments yet.
              </p>
            )}
          </div>
        )}

        {/* Delete confirmation modal */}
        {!createMode && confirmingDelete && (
          <Modal onClose={() => setConfirmingDelete(false)} className="max-w-sm" xIcon={false} dragHandle={false}>
            <div className="flex flex-col items-center gap-5 p-4">
              <div className="w-14 h-14 rounded-full bg-error-1 flex items-center justify-center">
                <Icon icon="mdi:trash-can-outline" className="w-7 h-7 text-error-8" />
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <h3 className="text-base font-semibold text-neutral-gray-10">Delete this post?</h3>
                <p className="text-sm text-neutral-gray-6">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl border border-neutral-gray-4 text-sm font-medium text-neutral-gray-8 hover:bg-neutral-gray-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete?.(post.id);
                    setConfirmingDelete(false);
                  }}
                  className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-error-7 text-sm font-medium text-white hover:bg-error-8 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>

      {/* Comment input — hide in create mode */}
      {!createMode && (
        <div
          className={`shrink-0 flex items-center gap-2 border-t border-neutral-gray-3 ${inModal ? "px-5 py-3" : "px-8 py-4"}`}
        >
          <div className="w-7 h-7 rounded-full bg-blue-1 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
            {initials(user?.name ?? "?")}
          </div>
          <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-full outline outline-1 outline-neutral-gray-4 focus-within:outline-primary transition-colors">
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && commentInput.trim()) handleCommentSubmit(); }}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent text-xs text-neutral-gray-9 placeholder:text-neutral-gray-5 outline-none min-w-0"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!commentInput.trim() || submitting}
              className="shrink-0 disabled:opacity-40"
            >
              <Icon icon="mdi:send" className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Date filter dropdown ─────────────────────────────────────────────────────
function DateFilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const activeLabel =
    DATE_FILTERS.find((f) => f.value === value)?.label ?? "Date";

  useEffect(() => {
    if (!open) return;
    function onOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`cursor-pointer flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-full outline-1 transition-colors
          ${value !== "none" ? "bg-primary text-blue-1 outline-primary" : "outline-neutral-gray-3 text-neutral-gray-6 hover:bg-neutral-gray-2"}`}
      >
        <Icon
          icon="mdi:calendar-blank-outline"
          className="w-4 h-4 lg:w-5 lg:h-5"
        />
        <span className="text-sm whitespace-nowrap">{activeLabel}</span>
        <Icon
          icon={open ? "mdi:chevron-up" : "mdi:chevron-down"}
          className="w-3 h-3 lg:w-3.5 lg:h-3.5"
        />
      </button>
      {open && (
        <div className="flex flex-col p-2 absolute right-0 top-full mt-1.5 z-20 bg-white rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)] outline-1 outline-neutral-gray-3 overflow-hidden min-w-40 lg:min-w-48">
          <button
            onClick={() => {
              onChange("none");
              setOpen(false);
            }}
            className={`rounded-xl w-full text-left px-3.5 lg:px-4 py-2 lg:py-2.5 text-[13px] lg:text-sm transition-colors
              ${value === "none" ? "bg-primary text-blue-1 font-medium" : "text-neutral-gray-5 hover:bg-neutral-gray-2"}`}
          >
            --None--
          </button>
          <div className="my-1 border-t border-neutral-gray-2" />
          {DATE_FILTERS.filter((f) => f.value !== "none").map((f) => (
            <button
              key={f.value}
              onClick={() => {
                onChange(f.value);
                setOpen(false);
              }}
              className={`rounded-xl w-full text-left px-3.5 lg:px-4 py-2 lg:py-2.5 text-[13px] lg:text-sm transition-colors
                ${value === f.value ? "bg-primary text-blue-1 font-medium" : "text-neutral-gray-8 hover:bg-neutral-gray-2"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Create Announcement Form ─────────────────────────────────────────────────
const FORM_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "assignment", label: "Assignments" },
  { value: "exam", label: "Exams" },
];

function CreateAnnouncementForm({
  editMode = false,
  isLecturer = false,
  courses = [],
  courseId,
  setCourseId,
  category,
  setCategory,
  title,
  setTitle,
  body,
  setBody,
  dueDate,
  setDueDate,
  pinned,
  setPinned,
  links,
  setLinks,
  formFiles = [],
  setFormFiles,
  existingAttachments = [],
  onRemoveExistingAttachment,
  onPublish,
  onSaveDraft,
  onCancel,
}) {
  const fileInputRef = useRef(null);

  function handleFilesChange(newFiles) {
    const list = Array.from(newFiles);
    setFormFiles((prev) => [...prev, ...list]);
  }

  function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFilesChange(e.dataTransfer.files);
  }

  function removeFile(idx) {
    setFormFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function addLink() {
    setLinks((prev) => [...prev, { id: Date.now(), desc: "", url: "" }]);
  }
  function updateLink(id, field, val) {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: val } : l)),
    );
  }
  function removeLink(id) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden lg:pr-8">
      <div className="flex flex-col gap-3">
        {/* Back nav */}
        <button
          onClick={onCancel}
          className="cursor-pointer flex items-center gap-1 text-neutral-gray-6 hover:text-neutral-gray-9 transition-colors w-fit"
        >
          <Icon icon="ci:chevron-left" className="w-4 h-4" />
          <span className="text-sm md:text-base">My posts</span>
        </button>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl lg:text-4xl font-bold text-secondary leading-tight">
            {editMode ? "Edit Announcement" : "Create Announcement"}
          </h1>
          <p className="text-sm lg:text-base text-neutral-gray-8">
            {editMode ? "Update your announcement details" : "Share important information with students"}
          </p>
        </div>
      </div>

      {/* scrollable Content*/}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto overflow-hidden scrollbar-hide pb-6">
        {/* Course selector — lecturers only */}
        {isLecturer && (
          <div className="flex flex-col gap-3">
            <p className="text-base font-medium text-secondary">
              Target Course <span className="text-error-7">*</span>
            </p>
            {courses.length === 0 ? (
              <p className="text-sm text-neutral-gray-5 italic">
                You have no courses assigned. Contact an admin to get courses added to your profile.
              </p>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCourseId(c.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-1.5
                      ${courseId === c.id
                        ? "bg-primary text-blue-1 border-primary"
                        : "border-neutral-gray-6 text-neutral-gray-6 hover:bg-neutral-gray-2"
                      }`}
                  >
                    <span className="font-semibold">{c.code}</span>
                    <span className="hidden sm:inline">— {c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-medium text-secondary">Category</p>
          <div className="flex items-center gap-1.5 lg:gap-2 flex-wrap">
            {FORM_CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border
                ${
                  category === c.value
                    ? "bg-primary text-blue-1 outline-primary"
                    : "border-neutral-gray-6 text-neutral-gray-6 hover:bg-neutral-gray-2"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-medium text-secondary">Title</p>
          <Input
            placeholder="Enter announcement title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-medium text-secondary">Content</p>
          <textarea
            rows={6}
            placeholder="Write your announcement content here…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input-base resize-none leading-5"
          />
        </div>

        {/* Add deadline */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-base font-medium text-secondary">Add deadline</p>
          <div className=" w-36 flex items-center gap-2 px-4 py-3.5 bg-zinc-100 rounded-xl outline-[0.80px] outline-offset-[-0.80px] outline-black/0 hover:bg-zinc-200 transition-colors cursor-pointer">
            <Icon
              icon="mdi:calendar-blank-outline"
              className="w-4 h-4 text-neutral-gray-6 shrink-0"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-fit bg-transparent text-sm text-neutral-gray-6 outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
            />
          </div>
        </div>

        {/* Attachments */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-medium text-secondary">Attachments</p>
          {/* Existing attachments (edit mode) */}
          {editMode && existingAttachments.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-neutral-gray-5 font-medium">Current attachments:</p>
              {existingAttachments.map((att) => (
                <div key={att.id} className="flex items-center gap-2 px-3 py-2 bg-blue-1/60 rounded-xl border border-blue-3/40">
                  <Icon icon="mdi:file-document-outline" className="w-4 h-4 text-primary shrink-0" />
                  <span className="flex-1 text-xs text-neutral-gray-8 truncate">{att.name}</span>
                  <span className="text-xs text-neutral-gray-5 shrink-0">{att.size}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveExistingAttachment?.(att.id)}
                    title="Remove attachment"
                    className="shrink-0 text-neutral-gray-4 hover:text-error-7 transition-colors"
                  >
                    <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => { if (e.target.files?.length) handleFilesChange(e.target.files); e.target.value = ""; }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="px-4 py-6 bg-zinc-100 rounded-2xl flex justify-center items-center cursor-pointer hover:bg-zinc-200 transition-colors"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23a1a1aa' stroke-width='2.2' stroke-dasharray='5%2c 12' stroke-linecap='square'/%3e%3c/svg%3e")`,
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <Icon icon="lucide:upload" className="w-8 h-8 text-neutral-gray-8" />
              <p className="text-sm text-neutral-gray-8 text-center">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-neutral-gray-6">PDF, DOC, DOCX, images up to 10MB</p>
            </div>
          </div>
          {formFiles.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {formFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-zinc-100 rounded-xl">
                  <Icon icon="mdi:file-document-outline" className="w-4 h-4 text-neutral-gray-6 shrink-0" />
                  <span className="flex-1 text-xs text-neutral-gray-8 truncate">{file.name}</span>
                  <span className="text-xs text-neutral-gray-5 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="shrink-0 text-neutral-gray-4 hover:text-error-7 transition-colors"
                  >
                    <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Links */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-medium text-secondary">Related Links</p>
          {links.map((lnk) => (
            <div key={lnk.id} className="flex items-center gap-3">
              <div className="w-44 shrink-0">
                <Input
                  placeholder="Description"
                  value={lnk.desc}
                  onChange={(e) => updateLink(lnk.id, "desc", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Paste URL (e.g. https://…)"
                  value={lnk.url}
                  onChange={(e) => updateLink(lnk.id, "url", e.target.value)}
                />
              </div>
              <button
                onClick={() => removeLink(lnk.id)}
                className="shrink-0 w-8 h-8 flex items-center justify-center text-neutral-gray-5 hover:text-error-7 transition-colors"
              >
                <Icon icon="mdi:close" className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addLink}
            className="flex items-center gap-1 text-primary text-sm font-medium hover:text-primary-hover transition-colors w-fit"
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            Add Link
          </button>
        </div>

        {/* Pin toggle */}
        <div className="px-4 py-3 bg-error-2 rounded-xl flex justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-error-8">
              Pin this announcement
            </p>
            <p className="text-xs text-stone-500">
              Pinned announcements appear at the top of the feed
            </p>
          </div>
          <button
            onClick={() => setPinned((v) => !v)}
            className={`cursor-pointer relative w-8.5 h-5 rounded-full transition-colors shrink-0 ${pinned ? "bg-primary" : "bg-neutral-gray-4"}`}
          >
            <span
              className={`absolute top-[1.73px] w-4 h-4 bg-white rounded-full shadow transition-all ${pinned ? "left-4.2" : "left-0.5"}`}
            />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={onPublish}
            className="font-medium rounded-[10px]! px-4! py-2!"
          >
            {editMode ? "Save Changes" : "Publish"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            className="font-medium rounded-[10px]! px-4! py-2!"
          >
            Save as Draft
          </Button>
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 rounded-[10px] text-sm font-medium text-neutral-gray-8 hover:bg-neutral-gray-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Maps backend announcement → MyPostsPage shape
function normalizePost(a) {
  const n = normalizeNotice(a);
  const isEdited = n.publishedAt && n.updatedAt && n.updatedAt > n.publishedAt;
  return {
    ...n,
    // Show the edit time as date so edited posts display "Just now" etc.
    date: isEdited ? n.updatedAt : n.createdAt,
    editedAt: isEdited ? n.updatedAt : null,
    pinned: n.is_pinned ?? false,
    commentCount: n.commentCount,
    links: n.links ?? [],        // n.links already has id field added
    dueDate: n.dueDate ?? null,
    comments: [],
    courseId: a.course_id ?? null,
  };
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MyPostsPage() {
  const { user } = useAuth();
  // List state
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("none");
  const [selectedPost, setSelectedPost] = useState(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Create / Edit form state
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null); // the post being edited, or null
  const [formCategory, setFormCategory] = useState("general");
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formPinned, setFormPinned] = useState(false);
  const [formLinks, setFormLinks] = useState([]);
  const [formCourseId, setFormCourseId] = useState("");
  const [formFiles, setFormFiles] = useState([]);

  const { refetch: refetchFeed } = useNotices();
  const isLecturer = user?.role === 'lecturer';
  const lecturerCourses = user?.courses ?? [];

  // Track existing attachments when editing (to display them and allow removal)
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [removeAttachmentIds, setRemoveAttachmentIds] = useState([]);

  const fetchPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const { data } = await postsService.getMyPosts();
      setPosts((data?.data?.announcements ?? []).map(normalizePost));
    } catch {
      // leave empty on error
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function resetForm() {
    setFormCategory("general");
    setFormTitle("");
    setFormBody("");
    setFormDueDate("");
    setFormPinned(false);
    setFormLinks([]);
    setFormCourseId(lecturerCourses[0]?.id ?? "");
    setFormFiles([]);
  }

  function handleCreateNew() {
    resetForm();
    setEditing(null);
    setCreating(true);
  }

  function handleEditPost(post) {
    setFormCategory(post.type);
    setFormTitle(post.title);
    setFormBody(post.body);
    setFormDueDate(post.dueDate ? post.dueDate.slice(0, 10) : "");
    setFormPinned(post.pinned);
    setFormLinks(post.links?.length ? post.links : []);
    // Pre-select the course this post was originally targeting (if lecturer)
    setFormCourseId(post.courseId ?? lecturerCourses[0]?.id ?? "");
    setFormFiles([]);
    // Store current attachments so they can be shown and optionally removed
    setExistingAttachments(post.attachments ?? []);
    setRemoveAttachmentIds([]);
    setEditing(post);
    setCreating(true);
  }

  async function handleDeletePost(id) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (selectedPost?.id === id) setSelectedPost(null);
    try {
      await postsService.delete(id);
    } catch {
      fetchPosts();
    }
  }

  async function handlePublishDraft(id) {
    try {
      await postsService.publish(id);
      fetchPosts();
      setSelectedPost(null);
    } catch { /* ignore */ }
  }

  function buildFormData(status) {
    const formData = new FormData();
    formData.append('title', formTitle);
    formData.append('body', formBody);
    // Backend ENUM uses 'exams' (plural); frontend uses 'exam' — remap on send
    formData.append('category', formCategory === 'exam' ? 'exams' : formCategory);
    formData.append('status', status);
    if (formDueDate) formData.append('deadline', new Date(formDueDate + 'T23:59:00').toISOString());
    formData.append('useful_links', JSON.stringify(
      formLinks.filter((l) => l.url.trim()).map(({ desc, url }) => ({ desc, url }))
    ));
    if (isLecturer && formCourseId) formData.append('course_id', formCourseId);
    formFiles.forEach((file) => formData.append('attachments', file));
    // Tell backend which existing attachments to remove
    removeAttachmentIds.forEach((id) => formData.append('remove_attachment_ids', id));
    return formData;
  }

  async function handlePublish() {
    try {
      if (editing) {
        await postsService.update(editing.id, buildFormData('published'));
        if (formPinned !== editing.pinned) await postsService.togglePin(editing.id);
      } else {
        const { data } = await postsService.create(buildFormData('published'));
        if (formPinned && data?.data?.id) await postsService.togglePin(data.data.id);
      }
    } catch { /* ignore */ }
    fetchPosts();
    refetchFeed(); // sync to the main feed
    setSelectedPost(null);
    setEditing(null);
    setCreating(false);
    setExistingAttachments([]);
    setRemoveAttachmentIds([]);
  }

  async function handleSaveDraft() {
    try {
      if (editing) {
        await postsService.update(editing.id, buildFormData('draft'));
        if (formPinned !== editing.pinned) await postsService.togglePin(editing.id);
      } else {
        await postsService.create(buildFormData('draft'));
      }
    } catch { /* ignore */ }
    fetchPosts();
    refetchFeed(); // sync to the main feed (drafts won't show in feed, but published edits will)
    setSelectedPost(null);
    setEditing(null);
    setCreating(false);
    setExistingAttachments([]);
    setRemoveAttachmentIds([]);
  }

  // Role display map for preview
  const ROLE_DISPLAY = { student: "Student", course_rep: "Course Rep", lecturer: "Lecturer", admin: "Admin" };

  // Live preview post built from form state (including files and existing attachments)
  const draftPreview = useMemo(
    () => ({
      id: "draft",
      type: formCategory,
      status: editing ? editing.status : "draft",
      pinned: formPinned,
      title: formTitle,
      body: formBody,
      date: new Date().toISOString(),
      editedAt: editing ? new Date().toISOString() : null,
      author: user?.name ?? "",
      authorRole: ROLE_DISPLAY[user?.role] ?? user?.role ?? "Course Rep",
      commentCount: editing?.commentCount ?? 0,
      // Existing attachments (minus any removed) + newly added local files
      attachments: [
        ...(editing
          ? existingAttachments.filter((a) => !removeAttachmentIds.includes(a.id))
          : []
        ),
        ...formFiles.map((f, i) => ({
          id: `new-${i}`,
          name: f.name,
          size: `${(f.size / 1024).toFixed(0)} KB`,
          type: f.type,
          url: null, // not uploaded yet
        })),
      ],
      links: formLinks.filter((l) => l.url.trim()).map((l, i) => ({ ...l, id: l.id ?? i })),
      comments: [],
      dueDate: formDueDate
        ? new Date(formDueDate + "T23:59:00").toISOString()
        : null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formCategory, formTitle, formBody, formDueDate, formPinned, formLinks, formFiles, editing, existingAttachments, removeAttachmentIds, user],
  );

  // Filtered list
  const filtered = useMemo(() => {
    let list = posts;
    if (activeFilter === "published")
      list = list.filter((p) => p.status === "published");
    else if (activeFilter === "draft")
      list = list.filter((p) => p.status === "draft");
    else if (activeFilter === "pinned") list = list.filter((p) => p.pinned);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q) ||
          p.author?.toLowerCase().includes(q),
      );
    }
    if (dateFilter !== "none")
      list = list.filter((p) => matchesDate(p.date, dateFilter));
    return [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [posts, activeFilter, searchQuery, dateFilter]);

  const mobileCard =
    "bg-white rounded-[20px] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] lg:bg-transparent lg:shadow-none lg:rounded-none";

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-0  h-full">
      {/* ── Left column ── */}
      <div
        className={`flex flex-col lg:min-h-0 gap-3 lg:gap-6 lg:w-1/2 ${creating ? "" : "lg:pr-8"} h-full scrollbar-hide ${creating ? "overflow-hidden" : "overflow-y-auto lg:overflow-visible"}`}
      >
        {creating ? (
          /* ── Create form ── */
          <div
            className={`flex-1 h-full overflow-hidden px-3.5 py-5 lg:p-0 ${mobileCard}`}
          >
            <CreateAnnouncementForm
              editMode={editing !== null}
              isLecturer={isLecturer}
              courses={lecturerCourses}
              courseId={formCourseId}
              setCourseId={setFormCourseId}
              category={formCategory}
              setCategory={setFormCategory}
              title={formTitle}
              setTitle={setFormTitle}
              body={formBody}
              setBody={setFormBody}
              dueDate={formDueDate}
              setDueDate={setFormDueDate}
              pinned={formPinned}
              setPinned={setFormPinned}
              links={formLinks}
              setLinks={setFormLinks}
              formFiles={formFiles}
              existingAttachments={existingAttachments}
              onRemoveExistingAttachment={(id) => {
                setExistingAttachments((prev) => prev.filter((a) => a.id !== id));
                setRemoveAttachmentIds((prev) => [...prev, id]);
              }}
              setFormFiles={setFormFiles}
              onPublish={handlePublish}
              onSaveDraft={handleSaveDraft}
              onCancel={async () => {
                const hasContent = formTitle.trim() || formBody.trim();
                if (hasContent || editing) {
                  // Auto-save as draft before leaving
                  await handleSaveDraft();
                } else {
                  setEditing(null);
                  setCreating(false);
                }
              }}
            />
          </div>
        ) : (
          /* ── Post list ── */
          <>
            {/* Header */}
            <div
              className={`shrink-0 flex flex-col gap-4 lg:gap-5 px-3.5 py-5 lg:p-0 ${mobileCard}`}
            >
              <div className="flex flex-col gap-1 lg:gap-2">
                <h1 className="text-xl lg:text-[32px] font-bold text-secondary leading-none">
                  My Posts
                </h1>
                <p className="text-sm lg:text-base text-neutral-gray-8">
                  Manage all your posted announcements
                </p>
              </div>
              {/* Filter pills + Create New */}
              <div className="flex items-center justify-between gap-3">
                <FilterPills filters={FILTERS} active={activeFilter} onChange={setActiveFilter} />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCreateNew}
                  className="text-white rounded-full! xsm:rounded-xl! sm:px-4! p-2.25! sm:py-2.5!"
                >
                  <Icon icon="lucide:plus" className="w-4.5 h-4.5" />
                  <span className="hidden xsm:flex text-sm">Create New</span>
                </Button>
              </div>
            </div>

            {/* Desktop search + date filter */}
            <div
              className={`hidden lg:flex shrink-0 justify-between items-center gap-3 lg:gap-4 px-3.5 py-3 lg:p-0 ${mobileCard}`}
            >
              <div className="group flex-1 lg:max-w-70 xl:max-w-80 flex items-center justify-between pl-3 lg:pl-5 pr-1 lg:pr-1.5 py-1.5 rounded-full border-[0.67px] border-neutral-gray-5 focus-within:outline-secondary bg-white">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="bg-transparent text-xs lg:text-sm text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
                />
                <button className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
                  <Icon
                    icon="lucide:search"
                    className="w-3 h-3 lg:w-4 lg:h-4 text-white"
                  />
                </button>
              </div>
              <DateFilterDropdown value={dateFilter} onChange={setDateFilter} />
            </div>

            {/* Post list */}
            <div
              className={`sticky top-0 z-10 lg:static lg:z-auto lg:flex-1 lg:min-h-0 flex flex-col gap-2.5 p-3.5 lg:p-0 ${mobileCard}`}
            >
              {/* Mobile search */}
              <div className="lg:hidden py-2.5 bg-white sticky top-0 z-5 shrink-0 flex justify-between items-center gap-3">
                <div className="group flex-1 flex items-center justify-between pl-3 pr-1 py-1.5 rounded-full border-[0.67px] border-neutral-gray-5 focus-within:outline-secondary bg-white">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search anything..."
                    className="bg-transparent text-xs lg:text-sm text-neutral-gray-9 placeholder:text-neutral-gray-6 outline-none flex-1 min-w-0"
                  />
                  <button className="cursor-pointer w-8 h-8 bg-secondary hover:bg-secondary/90 rounded-full flex items-center justify-center shrink-0">
                    <Icon icon="lucide:search" className="w-4 h-4 text-white" />
                  </button>
                </div>
                <DateFilterDropdown
                  value={dateFilter}
                  onChange={setDateFilter}
                />
              </div>

              <div className="relative z-0 flex flex-col gap-2 lg:gap-2.5 lg:overflow-y-auto scrollbar-hide">
                {postsLoading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="h-24 lg:h-32 rounded-2xl bg-neutral-gray-2 animate-pulse" />
                  ))
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-12 lg:py-16 text-center">
                    <Icon
                      icon="iconoir:info-empty"
                      className="w-16 h-16 lg:w-20 lg:h-20 text-neutral-gray-4"
                    />
                    <div className="flex flex-col items-center">
                      <p className="text-base lg:text-lg font-semibold text-secondary">
                        No posts found
                      </p>
                      <p className="text-sm lg:text-base text-neutral-gray-8">
                        Create a new post to get started
                      </p>
                    </div>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <PostCard
                      key={p.id}
                      post={p}
                      isSelected={selectedPost?.id === p.id}
                      onClick={() => {
                        setSelectedPost(p);
                        if (window.innerWidth < 1024)
                          setMobilePreviewOpen(true);
                      }}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Right column — preview panel, desktop only ── */}
      <div className="hidden lg:flex lg:w-1/2 h-full">
        {creating ? (
          <PostPreview post={draftPreview} createMode />
        ) : (
          <PostPreview post={selectedPost} onEdit={handleEditPost} onDelete={handleDeletePost} onPublishDraft={handlePublishDraft} />
        )}
      </div>

      {/* ── Mobile preview modal ── */}
      {mobilePreviewOpen && selectedPost && !creating && (
        <Modal
          onClose={() => setMobilePreviewOpen(false)}
          xIcon={false}
          className="md:max-w-xl overflow-hidden !p-0"
          portalClassName="lg:hidden p-0! items-end md:items-center md:p-6!"
        >
          <PostPreview post={selectedPost} inModal onEdit={handleEditPost} onDelete={handleDeletePost} onPublishDraft={handlePublishDraft} />
        </Modal>
      )}
    </div>
  );
}
