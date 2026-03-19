import { useState } from "react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useModal, MODAL } from "../../context/ModalContext";

export default function ForgotPasswordModal() {
  const { closeModal, openModal } = useModal();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      openModal(MODAL.CONFIRMATION, { email });
    }, 800);
  }

  return (
    <Modal
      onClose={closeModal}
      xIcon={false}
      mobileBreakpoint={640}
      portalClassName="p-0! items-end sm:items-center sm:p-6!"
      className="sm:max-w-110 flex flex-col justify-center min-h-[40vh] rounded-none rounded-t-[20px]! sm:rounded-[20px]"
    >
      <div className="flex flex-col gap-6 pt-4 sm:pt-0">
        <div className="sm:text-center">
          <h2 className="text-secondary text-xl sm:text-2xl font-semibold">
            Forgot Password?
          </h2>
          <p className="text-neutral-gray-8 text-sm sm:text-base mt-1.5 leading-6 sm:max-w-xs sm:mx-auto">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Email Address"
            id="forgot-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              className="w-full text-[15px] xsm:text-base! py-2.5!"
            >
              Send Reset Link
            </Button>
            <p className="text-center text-sm text-neutral-gray-8">
              Remember your password?{" "}
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
