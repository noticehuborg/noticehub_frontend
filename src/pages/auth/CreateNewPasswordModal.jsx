import { useState } from "react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useModal, MODAL } from "../../context/ModalContext";
import { useToast } from "../../context/ToastContext";
import { authService } from "../../services/auth.service";
import { getApiError, isGeneralError } from "../../utils/apiError";

export default function CreateNewPasswordModal() {
  const { closeModal, openModal, modalData } = useModal();
  const { addToast } = useToast();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((e2) => ({ ...e2, [e.target.name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Token must be present (passed via modalData from the reset-password route)
    if (!modalData?.token) {
      setErrors({ general: "This link is invalid or has expired. Please request a new one." });
      return;
    }

    const errs = {};
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token: modalData.token, newPassword: form.password });
      setLoading(false);
      openModal(MODAL.SUCCESS, { variant: 'passwordReset' });
    } catch (err) {
      setLoading(false);
      if (isGeneralError(err)) {
        addToast(getApiError(err));
      } else {
        // 400 "Token is invalid or has expired" → show inline
        const msg = err?.response?.data?.message ?? "Something went wrong. Please try again.";
        setErrors({ general: msg });
      }
    }
  }

  return (
    <Modal
      onClose={closeModal}
      xIcon={false}
      mobileBreakpoint={640}
      portalClassName="p-0! items-end sm:items-center sm:p-6!"
      className="sm:max-w-110 min-h-[55vh] rounded-none rounded-t-[20px]! overflow-hidden sm:rounded-[20px]"
    >
      <div className="flex flex-col gap-6 pt-4 sm:pt-0">
        {/* Heading — left on mobile, centered on desktop */}
        <div className="sm:text-center">
          <h2 className="text-secondary text-xl sm:text-2xl font-semibold">
            Create New Password
          </h2>
          <p className="text-neutral-gray-8 text-sm sm:text-base mt-1.5 leading-6 sm:max-w-xs sm:mx-auto">
            Your new password must be at least 8 characters long.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {errors.general && (
            <p className="text-sm text-error-8 text-center">{errors.general}</p>
          )}
          <Input
            label="New Password"
            id="new-password"
            name="password"
            type="password"
            placeholder="Enter new password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />
          <Input
            label="Confirm New Password"
            id="confirm-password"
            name="confirm"
            type="password"
            placeholder="Repeat new password"
            value={form.confirm}
            onChange={handleChange}
            error={errors.confirm}
            autoComplete="new-password"
          />
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full text-[15px] xsm:text-base! py-2.5!"
            >
              Reset Password
            </Button>
            <p className="text-center text-sm text-neutral-gray-8">
              <button
                type="button"
                onClick={() => openModal(MODAL.LOGIN)}
                className="text-primary hover:underline"
              >
                Back to Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </Modal>
  );
}
