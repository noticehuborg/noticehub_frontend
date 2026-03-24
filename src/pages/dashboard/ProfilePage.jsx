import { useState } from "react";
import { Icon } from "@iconify/react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: "Kwame Asante",
  email: "kwame.asante@knust.edu.gh",
  program: "Bsc. Computer Science",
  level: "Level 300",
  role: "Student",
  department: "CS",
  memberSince: "September 2022",
};

// ─── Config ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "personal", label: "Personal Info", icon: "fluent:person-20-regular" },
  {
    id: "security",
    label: "Security",
    icon: "fluent:shield-keyhole-16-regular",
  },
  { id: "level", label: "Level Correction", icon: "solar:chart-2-linear" },
];

const LEVEL_OPTIONS = ["Level 100", "Level 200", "Level 300", "Level 400"];
const LEVEL_PROGRESS = {
  "Level 100": 25,
  "Level 200": 50,
  "Level 300": 75,
  "Level 400": 100,
};

// ─── Helper ────────────────────────────────────────────────────────────────────
function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Shared read-only field ────────────────────────────────────────────────────
function ReadField({ label, value, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-gray-9">{label}</label>
      <div className="input-base bg-section-bg text-neutral-gray-5 cursor-default select-none">
        {value}
      </div>
      {hint && <p className="text-xs text-neutral-gray-5">{hint}</p>}
    </div>
  );
}

// ─── Personal Info Tab ─────────────────────────────────────────────────────────
function PersonalInfoTab({ user, onGoToLevel }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [draft, setDraft] = useState(user.name);

  function handleEdit() {
    setDraft(name);
    setEditing(true);
  }
  function handleSave() {
    setName(draft.trim() || name);
    setEditing(false);
  }
  function handleCancel() {
    setEditing(false);
  }

  const cardShadow =
    "bg-white rounded-2xl shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]";

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      {/* ── Profile banner ── */}
      <div className="rounded-2xl overflow-hidden bg-primary relative">
        {!editing && (
          <button
            onClick={handleEdit}
            className="cursor-pointer absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-colors"
          >
            <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 px-6 py-6 sm:py-8">
          <div className="relative shrink-0">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl lg:text-3xl font-bold select-none">
              {initials(name)}
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Icon
                icon="mdi:camera-outline"
                className="w-3.5 h-3.5 text-primary"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div>
              <p className="text-white text-lg lg:text-xl font-semibold leading-tight">
                {name}
              </p>
              <p className="text-white/70 text-sm">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium">
                {user.role}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium">
                {user.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium">
                {user.department}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Editable form ── */}
      <div className={`${cardShadow} p-5 lg:p-6 flex flex-col gap-5`}>
        <div>
          <h3 className="text-base font-semibold text-neutral-gray-10">
            Personal Information
          </h3>
          <p className="text-sm text-neutral-gray-6">
            Update your name and profile photo
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name — editable */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-gray-9">
              Full Name
            </label>
            {editing ? (
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Your full name"
              />
            ) : (
              <div className="input-base text-neutral-gray-8">{name}</div>
            )}
          </div>

          {/* Email — locked */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-gray-9">
              Email Address
            </label>
            <div className="input-base bg-section-bg text-neutral-gray-5 flex items-center gap-2">
              <Icon
                icon="mdi:email-lock-outline"
                className="w-4 h-4 shrink-0"
              />
              <span className="truncate">{user.email}</span>
            </div>
            <p className="text-xs text-neutral-gray-5">
              Email is locked. Contact your admin to update it.
            </p>
          </div>

          <ReadField label="Program" value={user.program} />

          {/* Current Level — shows "Request Change →" when editing */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-gray-9">
              Current Level
            </label>
            <div className="input-base bg-section-bg text-neutral-gray-5 flex items-center justify-between gap-2">
              <span>{user.level}</span>
              {editing && (
                <button
                  type="button"
                  onClick={onGoToLevel}
                  className="cursor-pointer text-xs font-medium text-primary hover:text-primary-hover whitespace-nowrap transition-colors"
                >
                  Request Change →
                </button>
              )}
            </div>
            {!editing && (
              <p className="text-xs text-neutral-gray-5">
                Use the Level Correction tab to request a change.
              </p>
            )}
          </div>

          <ReadField label="Member Since" value={user.memberSince} />
        </div>

        {editing && (
          <div className="flex items-center gap-3 pt-1 border-t border-neutral-gray-2">
            <Button variant="primary" onClick={handleSave}>
              <Icon icon="mdi:check" className="w-4 h-4" />
              Save Changes
            </Button>
            <button
              onClick={handleCancel}
              className="cursor-pointer text-sm text-neutral-gray-6 hover:text-neutral-gray-8 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ── Account Info (read-only) ── */}
      <div className={`${cardShadow} p-5 lg:p-6 flex flex-col gap-4`}>
        <div>
          <h3 className="text-base font-semibold text-neutral-gray-10">
            Account Info
          </h3>
          <p className="text-sm text-neutral-gray-6">
            Read-only account details
          </p>
        </div>
        <div className="flex flex-col divide-y divide-neutral-gray-2">
          {[
            { icon: "mdi:email-outline", label: "Email", value: user.email },
            {
              icon: "mdi:school-outline",
              label: "Program",
              value: user.program,
            },
            {
              icon: "solar:chart-2-linear",
              label: "Current Level",
              value: user.level,
            },
            {
              icon: "mdi:shield-account-outline",
              label: "Role",
              value: user.role,
            },
            {
              icon: "mdi:clock-outline",
              label: "Member Since",
              value: user.memberSince,
            },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="w-8 h-8 rounded-xl bg-section-bg flex items-center justify-center shrink-0">
                <Icon icon={icon} className="w-4 h-4 text-neutral-gray-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-gray-5">{label}</p>
                <p className="text-sm font-medium text-neutral-gray-9">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Status badges ── */}
      <div className="flex items-center gap-2.5 flex-wrap pb-2">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success-1 text-success-7 text-xs font-medium outline outline-1 outline-success-4">
          <Icon icon="mdi:check-circle-outline" className="w-3.5 h-3.5" />
          Account verified
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-1 text-primary text-xs font-medium outline outline-1 outline-blue-3">
          <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5" />
          Last login: Today
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warning-1 text-warning-7 text-xs font-medium outline outline-1 outline-warning-4">
          <Icon icon="mdi:auto-fix" className="w-3.5 h-3.5" />
          Auto-level active
        </span>
      </div>
    </div>
  );
}

// ─── Security Tab ──────────────────────────────────────────────────────────────
function SecurityTab() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.newPass.length < 8)
      return setError("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(form.newPass))
      return setError("Password must include at least one uppercase letter.");
    if (!/[0-9]/.test(form.newPass))
      return setError("Password must include at least one number.");
    if (form.newPass !== form.confirm)
      return setError("Passwords do not match.");
    setSaved(true);
    setForm({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setSaved(false), 4000);
  }

  const cardShadow =
    "bg-white rounded-2xl shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]";

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl lg:text-[28px] font-bold text-secondary leading-none">
          Security
        </h1>
        <p className="text-sm lg:text-base text-neutral-gray-8">
          Update your password and keep your account safe
        </p>
      </div>

      <div className={`${cardShadow} p-5 lg:p-6 flex flex-col gap-5`}>
        <h3 className="text-base font-semibold text-neutral-gray-10">
          Change Password
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={form.current}
            onChange={set("current")}
            required
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={form.newPass}
            onChange={set("newPass")}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={form.confirm}
            onChange={set("confirm")}
            required
          />

          <div className="px-4 py-3 bg-blue-1 rounded-xl text-xs text-primary leading-5">
            Password must be at least 8 characters and include one uppercase
            letter and one number.
          </div>

          {error && (
            <div className="px-4 py-3 bg-error-1 rounded-xl text-xs text-error-8 flex items-center gap-2">
              <Icon
                icon="mdi:alert-circle-outline"
                className="w-4 h-4 shrink-0"
              />
              {error}
            </div>
          )}

          {saved && (
            <div className="px-4 py-3 bg-success-1 rounded-xl text-xs text-success-7 flex items-center gap-2">
              <Icon
                icon="mdi:check-circle-outline"
                className="w-4 h-4 shrink-0"
              />
              Password updated successfully.
            </div>
          )}

          <Button variant="primary" type="submit">
            <Icon icon="mdi:check" className="w-4 h-4" />
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Level Correction Tab ──────────────────────────────────────────────────────
function LevelCorrectionTab({ user }) {
  const [requested, setRequested] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const progress = LEVEL_PROGRESS[user.level] ?? 75;

  function handleSubmit(e) {
    e.preventDefault();
    if (!requested || !reason.trim()) return;
    setSubmitted(true);
  }

  const cardShadow =
    "bg-white rounded-2xl shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]";

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl lg:text-[28px] font-bold text-secondary leading-none">
          Level Correction
        </h1>
        <p className="text-sm lg:text-base text-neutral-gray-8">
          Request a correction if your level was auto-progressed incorrectly
        </p>
      </div>

      {/* ── Info banner ── */}
      <div className="bg-blue-1 rounded-2xl p-4 lg:p-5 flex gap-3 items-start outline outline-1 outline-blue-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon icon="solar:chart-2-linear" className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">
            How level progression works
          </p>
          <p className="text-xs lg:text-sm text-primary/80 mt-1 leading-5">
            Your level is automatically updated every 12 months from the date
            you registered. If you repeated a year or your level is incorrect,
            submit a correction request below. An admin will review and update
            your account within 1–3 working days.
          </p>
        </div>
      </div>

      {/* ── Current Level card ── */}
      <div className={`${cardShadow} p-5 lg:p-6 flex flex-col gap-3`}>
        <p className="text-xs text-neutral-gray-5 font-medium uppercase tracking-wide">
          Your Current Level
        </p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Icon
                icon="solar:chart-2-linear"
                className="w-5 h-5 text-white"
              />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-gray-10">
                {user.level}
              </p>
              <p className="text-xs text-neutral-gray-6">{user.program}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 min-w-28 lg:min-w-40">
            <div className="w-full h-1.5 bg-neutral-gray-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-neutral-gray-5">{user.level} of 400</p>
          </div>
        </div>
      </div>

      {/* ── Form or Submitted state ── */}
      {submitted ? (
        <div className={`${cardShadow} p-5 lg:p-6 flex flex-col gap-4`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-warning-1 flex items-center justify-center shrink-0">
                <Icon
                  icon="mdi:clock-outline"
                  className="w-5 h-5 text-warning-7"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-gray-10">
                  Request Submitted
                </p>
                <p className="text-xs text-neutral-gray-5">
                  Awaiting admin review
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-warning-1 text-warning-7 text-xs font-medium outline outline-1 outline-warning-4 shrink-0">
              Pending
            </span>
          </div>
          <div className="bg-warning-1 rounded-xl px-4 py-3.5 text-xs lg:text-sm text-warning-8 leading-5">
            Your level correction request has been submitted. An admin will
            review your request and update your level within 1–3 working days.
            You will receive a notification once it has been actioned.
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-gray-5">
            <span className="w-2 h-2 rounded-full bg-warning-6 shrink-0" />
            Submitted today &nbsp;·&nbsp; Waiting for admin
          </div>
        </div>
      ) : (
        <div className={`${cardShadow} p-5 lg:p-6 flex flex-col gap-4`}>
          <div>
            <h3 className="text-base font-semibold text-neutral-gray-10">
              Submit a Level Correction Request
            </h3>
            <p className="text-sm text-neutral-gray-6">
              Fill the form below. Your request will be reviewed by the
              department admin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReadField label="Current Level" value={user.level} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-gray-9">
                  Requested Level <span className="text-error-7">*</span>
                </label>
                <div className="relative">
                  <select
                    value={requested}
                    onChange={(e) => setRequested(e.target.value)}
                    className="input-base appearance-none pr-8 text-neutral-gray-8 cursor-pointer w-full"
                    required
                  >
                    <option value="">Select level</option>
                    {LEVEL_OPTIONS.filter((l) => l !== user.level).map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <Icon
                    icon="mdi:chevron-down"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-gray-5 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-gray-9">
                Reason for Request <span className="text-error-7">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 500))}
                placeholder='Explain why your level needs to be corrected. For example: "I repeated Level 200 due to medical deferral. My current level should still be 200, not 300."'
                rows={4}
                className="input-base resize-none leading-6 text-sm"
                required
              />
              <p className="text-xs text-neutral-gray-5 text-right">
                {reason.length} / 500 characters
              </p>
            </div>

            <div className="flex items-start gap-2 px-3.5 py-3 bg-error-1 rounded-xl text-error-8 text-xs lg:text-sm outline outline-1 outline-error-3">
              <Icon
                icon="mdi:alert-outline"
                className="w-4 h-4 shrink-0 mt-0.5"
              />
              <span>
                You can only have <strong>one pending request</strong> at a
                time. Submitting this will prevent further requests until this
                one is resolved.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="primary" type="submit">
                <Icon icon="mdi:send-outline" className="w-4 h-4" />
                Submit Request
              </Button>
              <button
                type="button"
                onClick={() => {
                  setRequested("");
                  setReason("");
                }}
                className="cursor-pointer text-sm text-neutral-gray-6 hover:text-neutral-gray-8 transition-colors"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── Profile Page ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");

  const cardShadow =
    "bg-white rounded-2xl shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]";

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 h-full overflow-y-auto scrollbar-hide">
      {/* ── Sidebar ── */}
      <div className="lg:w-56 lg:shrink-0 flex flex-col gap-3 lg:gap-4 lg:h-full">
        {/* Profile summary — always card on both mobile and desktop */}
        <div
          className={`${cardShadow} flex flex-col items-center gap-3 px-4 py-5 text-center`}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold select-none">
            {initials(MOCK_USER.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-gray-10 leading-tight">
              {MOCK_USER.name}
            </p>
            <p className="text-xs text-neutral-gray-5 mt-0.5 truncate max-w-[180px]">
              {MOCK_USER.email}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="px-2 py-0.5 rounded-full bg-blue-1 text-primary text-[11px] font-medium">
              {MOCK_USER.role}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-section-bg text-neutral-gray-7 text-[11px] font-medium">
              {MOCK_USER.level}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-section-bg text-neutral-gray-7 text-[11px] font-medium">
              {MOCK_USER.department}
            </span>
          </div>
          <div className="w-full border-t border-neutral-gray-2 pt-3 flex flex-col gap-1">
            <p className="text-xs text-neutral-gray-5">
              Joined: {MOCK_USER.memberSince}
            </p>
          </div>
        </div>

        {/* Desktop nav tabs */}
        <div className={`hidden lg:flex flex-col ${cardShadow} p-2 gap-0.5`}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left
                ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-neutral-gray-7 hover:bg-section-bg hover:text-neutral-gray-9"
                }`}
            >
              <Icon icon={tab.icon} className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile tab pills — sticky, bg matches dashboard background ── */}
      <div className="sticky top-0 z-10 bg-section-bg pb-3 flex lg:hidden items-center gap-2 overflow-x-auto scrollbar-hide shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0
              ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-neutral-gray-7 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]"
              }`}
          >
            <Icon icon={tab.icon} className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 pb-6 lg:pb-8">
          {activeTab === "personal" && (
            <PersonalInfoTab
              user={MOCK_USER}
              onGoToLevel={() => setActiveTab("level")}
            />
          )}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "level" && <LevelCorrectionTab user={MOCK_USER} />}
        </div>
    </div>
  );
}
