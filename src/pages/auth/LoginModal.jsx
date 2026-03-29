import { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useModal, MODAL } from "../../context/ModalContext";
import { useToast } from "../../context/ToastContext";
import { getApiError, isGeneralError, getErrorStatus } from "../../utils/apiError";
import logo from "../../assets/img/logo.png";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginModal() {
  const { login, status } = useAuth();
  const { closeModal, openModal } = useModal();
  const { addToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    }
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
      const loggedInUser = await login(form.email.trim(), form.password);
      const firstName = loggedInUser?.name?.split(" ")[0] ?? "back";
      closeModal();
      addToast(`Welcome back, ${firstName}!`, "success");
    } catch (err) {
      const httpStatus = getErrorStatus(err);
      if (httpStatus === 401) {
        setErrors({ password: "Invalid email or password." });
      } else if (httpStatus === 403) {
        setErrors({ email: "Account not verified. Please check your email for the OTP." });
      } else if (isGeneralError(err)) {
        addToast(getApiError(err));
      } else {
        addToast(getApiError(err));
      }
    }
  }

  return (
    <Modal
      onClose={closeModal}
      portalClassName="p-0! items-end md:items-center md:p-6!"
      className="max-w-250 min-h-[75vh] md:min-h-[65vh] md:h-[min(550px,85vh)] md:overflow-hidden rounded-none rounded-t-[20px]! md:rounded-[20px]"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Desktop left brand panel */}
        <div className="relative hidden md:flex w-[47%] shrink-0 flex-col gap-8 px-5 py-8 lg:px-6 lg:py-8 bg-linear-to-b from-primary to-[#6366F1] rounded-2xl">
          <div className="flex flex-col gap-3">
            <h2 className="text-white text-3xl lg:text-[32px] font-semibold leading-tight">
              Welcome Back!
            </h2>
            <p className="text-indigo-100 text-base lg:text-lg leading-normal">
              Login to access your personalized announcement feed.
            </p>
          </div>
          <div className="p-5 bg-white/10 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Icon icon="iconoir:bell" width={20} className="text-white" />
              </div>
              <div>
                <p className="text-white text-base font-semibold">156</p>
                <p className="text-indigo-100 text-sm">Active Announcements</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Icon
                  icon="octicon:person-24"
                  width={20}
                  className="text-white"
                />
              </div>
              <div>
                <p className="text-white text-base font-semibold">342</p>
                <p className="text-indigo-100 text-sm">Students Online</p>
              </div>
            </div>
          </div>
          <div className="absolute -left-20 -bottom-28 rotate-[20deg] opacity-10 pointer-events-none">
            <img
              src={logo}
              alt="NoticeHub Logo"
              className="w-64 h-64 brightness-0 invert"
            />
          </div>
        </div>

        {/* Form panel */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-6 justify-center pt-1 md:pt-0 md:gap-4.5 md:p-6 lg:px-10"
        >
          {/* Mobile gradient banner */}
          <div className="md:hidden px-5 py-7 bg-linear-to-b from-primary to-indigo-500 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col gap-3 relative z-10">
              <h2 className="text-white text-xl font-semibold">Welcome Back!</h2>
              <p className="text-indigo-50 text-sm leading-5 max-w-64">
                Login to access your personalized announcement feed.
              </p>
            </div>
            <div className="absolute -right-10 -top-10 rotate-[-120deg] opacity-10 pointer-events-none">
              <img src={logo} alt="NoticeHub Logo" className="w-28 h-28 brightness-0 invert" />
            </div>
          </div>

          {/* Form heading */}
          <div>
            <h2 className="text-secondary text-xl md:text-3xl font-bold">
              Login
            </h2>
            <p className="text-neutral-gray-8 text-sm md:text-base mt-1.5">
              Enter your credentials to continue
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <Input
              label="Email Address"
              id="login-email"
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
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-200 accent-primary"
                />
                <span className="text-sm text-secondary font-medium">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => openModal(MODAL.FORGOT_PASSWORD)}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={status === "loading"}
              className="w-full text-[15px] xsm:text-base! py-2.5!"
            >
              <Icon icon="mdi:password" width={18} />
              Login
            </Button>
            <p className="text-center text-sm text-neutral-gray-8">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => openModal(MODAL.REGISTER)}
                className="text-primary hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
    </Modal>
  );
}
