import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useModal, MODAL } from "../../context/ModalContext";
import { useToast } from "../../context/ToastContext";
import { authService } from "../../services/auth.service";
import { getApiError, getErrorStatus } from "../../utils/apiError";
import logo from "../../assets/img/logo.png";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterModal() {
  const { register, status } = useAuth();
  const { closeModal, openModal } = useModal();
  const { addToast } = useToast();

  // ── Programs & levels (fetched from backend) ──────────────────────────────
  const [programsList, setProgramsList] = useState([]);
  const [levelsList, setLevelsList] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);

  useEffect(() => {
    authService
      .getPrograms()
      .then(({ data }) => setProgramsList(data.data.programs))
      .catch(() => {
        // If the fetch fails, dropdowns stay empty; user will see "No programs available"
      })
      .finally(() => setProgramsLoading(false));
  }, []);

  // ── Form state ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    program: "",
    level: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  // When program changes → derive available levels + reset level selection
  useEffect(() => {
    if (!form.program) {
      setLevelsList([]);
      return;
    }
    const selected = programsList.find((p) => p.value === form.program);
    if (selected) {
      setLevelsList(
        selected.levels.map((l) => ({ value: l, label: `Level ${l}` }))
      );
    } else {
      setLevelsList([]);
    }
    // Reset level when program changes so an invalid combo can't be submitted
    setForm((f) => ({ ...f, level: "" }));
    setErrors((e) => ({ ...e, level: "" }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.program, programsList]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((e2) => ({ ...e2, [e.target.name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      errs.email = "Enter a valid email address.";
    }
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match.";
    if (!form.program) errs.program = "Select a program.";
    if (!form.level) errs.level = "Select a level.";
    if (!agreed) errs.terms = "You must agree to the terms.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      await register(form.name.trim(), form.email.trim(), form.password, form.program, form.level);
      openModal(MODAL.OTP, { email: form.email.trim() });
    } catch (err) {
      const httpStatus = getErrorStatus(err);
      if (httpStatus === 409) {
        setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
      } else if (httpStatus === 400) {
        // Program or level rejected by backend
        const msg = err?.response?.data?.message ?? "Invalid program or level selected.";
        if (msg.toLowerCase().includes("level")) {
          setErrors((prev) => ({ ...prev, level: msg }));
        } else {
          setErrors((prev) => ({ ...prev, program: msg }));
        }
      } else {
        addToast(getApiError(err));
      }
    }
  }

  return (
    <Modal
      onClose={closeModal}
      portalClassName="p-0! items-end md:items-center md:p-6!"
      className="max-w-270 h-[min(700px,85vh)] rounded-none rounded-t-[20px]! overflow-hidden md:rounded-[20px]"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Desktop left brand panel */}
        <div className="relative h-full hidden md:flex w-[47%] shrink-0 flex-col gap-8 px-5 py-8 lg:px-6 lg:py-8 bg-linear-to-b from-primary to-[#6366F1] rounded-2xl">
          <div className="flex flex-col gap-3">
            <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
              Join NoticeHub
            </h2>
            <p className="text-indigo-100 text-[15px] lg:text-base leading-normal">
              Create your account and never miss an important announcement
              again.
            </p>
          </div>
          <div className="p-4 lg:p-5 bg-white/10 rounded-2xl flex flex-col gap-5">
            {[
              {
                icon: "qlementine-icons:newspaper-16",
                title: "Personalized Feed",
                desc: "See only what matters to your level and program.",
              },
              {
                icon: "iconoir:bell",
                title: "Real-time Alerts",
                desc: "Get notified instantly about new announcements.",
              },
              {
                icon: "mdi:calendar-check-outline",
                title: "Never Miss Deadlines",
                desc: "Track all your deadlines in one place.",
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Icon icon={f.icon} width={20} className="text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm xl:text-base font-medium leading-6 tracking-wide">
                    {f.title}
                  </p>
                  <p className="text-indigo-100 text-xs xl:text-sm leading-normal">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute -left-20 -bottom-28 rotate-[20deg] opacity-10 pointer-events-none">
            <img
              src={logo}
              alt="NoticeHub Logo"
              className="w-64 h-64 brightness-0 invert"
            />
          </div>
        </div>

        {/* Right panel */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-4.5 overflow-hidden py-0 md:px-6 md:pt-6 lg:px-10"
        >
          {/* Scrollable area */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-3">
            <div className="flex flex-col gap-4 pt-1 md:pt-0">
              {/* Mobile gradient banner */}
              <div className="md:hidden px-5 py-7 bg-linear-to-b from-primary to-indigo-500 rounded-2xl relative overflow-hidden">
                <div className="flex flex-col gap-3 relative z-10">
                  <h2 className="text-white text-xl font-bold">
                    Join NoticeHub
                  </h2>
                  <p className="text-indigo-50 text-sm leading-5 max-w-64">
                    Create your account and never miss an important announcement
                    again.
                  </p>
                </div>
                <div className="absolute -right-10 -top-10 rotate-[-120deg] opacity-10 pointer-events-none">
                  <img
                    src={logo}
                    alt="NoticeHub Logo"
                    className="w-28 h-28 brightness-0 invert"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-secondary text-xl md:text-2xl lg:text-3xl font-bold">
                  Create Account
                </h2>
                <p className="text-neutral-gray-8 text-sm md:text-base mt-1">
                  Fill in your details to get started
                </p>
              </div>
              <Input
                label="Full Name"
                id="reg-name"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                autoComplete="name"
              />
              <Input
                label="Email Address"
                id="reg-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
              />
              <Input
                label="Password"
                id="reg-password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
              />
              <Input
                label="Confirm Password"
                id="reg-confirm"
                name="confirm"
                type="password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={handleChange}
                error={errors.confirm}
                autoComplete="new-password"
              />

              {/* Program + Level dropdowns — data from backend */}
              <div className="flex flex-col xsm:flex-row md:flex-col lg:flex-row gap-4">
                <SelectField
                  id="reg-program"
                  name="program"
                  label="Program"
                  placeholder={programsLoading ? "Loading…" : "Select program"}
                  value={form.program}
                  onChange={handleChange}
                  options={programsList}
                  error={errors.program}
                  disabled={programsLoading}
                />
                <SelectField
                  id="reg-level"
                  name="level"
                  label="Level"
                  placeholder={!form.program ? "Select program first" : "Select level"}
                  value={form.level}
                  onChange={handleChange}
                  options={levelsList}
                  error={errors.level}
                  disabled={!form.program || programsLoading}
                />
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-200 accent-primary shrink-0"
                />
                <span className="text-sm text-secondary">
                  I agree to the{" "}
                  <span
                    onClick={(e) => e.preventDefault()}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span
                    onClick={(e) => e.preventDefault()}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Privacy Policy
                  </span>
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs md:text-[13px] text-error-8 mb-1">{errors.terms}</p>
              )}
            </div>
          </div>

          {/* Sticky footer */}
          <div className="relative shrink-0 sm:pt-2 bg-white">
            <div className="absolute -top-12 inset-x-0 h-8 bg-linear-to-t from-white to-transparent pointer-events-none z-10" />
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={status === "loading"}
                className="w-full text-[15px] xsm:text-base! py-2.5!"
              >
                Create Account
              </Button>
              <p className="text-center text-sm text-neutral-gray-8">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => openModal(MODAL.LOGIN)}
                  className="text-primary hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function SelectField({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  options,
  error,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      <label htmlFor={id} className="text-sm font-medium text-neutral-gray-9">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`input-base appearance-none pr-8 disabled:opacity-60 disabled:cursor-not-allowed
            ${error ? "border border-error-8" : ""}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon
          icon="mdi:chevron-down"
          width={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-6 pointer-events-none"
        />
      </div>
      {error && <p className="text-xs text-error-8">{error}</p>}
    </div>
  );
}
