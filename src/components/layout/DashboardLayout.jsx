import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Modal from "../ui/Modal";
import LinesVectorBg from "/svg/linesvectorbg.svg";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function toggleMobileSidebar() {
    setMobileSidebarOpen((v) => !v);
  }

  function handleLogoutRequest() {
    setMobileSidebarOpen(false);
    setLogoutModalOpen(true);
  }

  function handleLogoutConfirm() {
    logout();
    navigate("/");
    setLogoutModalOpen(false);
  }

  return (
    <div className="relative h-screen flex flex-col bg-section-bg overflow-hidden">
      <Header variant="dashboard" onSidebarToggle={toggleMobileSidebar} onLogoutRequest={handleLogoutRequest} />

      <div className="absolute w-full opacity-70">
        <img
          src={LinesVectorBg}
          alt=""
          className="opacity-70 object-center object-cover w-200 h-200 md:w-300 md:h-300 lg:w-full lg:h-full"
        />
      </div>
      <div className="relative flex flex-1 min-h-0 overflow-hidden p-4 gap-3">
        {/* Desktop sidebar — hover to expand, always visible */}
        <div className="hidden lg:block h-full">
          <Sidebar onLogoutRequest={handleLogoutRequest} />
        </div>

        {/* Mobile sidebar overlay — always expanded */}
        {mobileSidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-[0.5px]"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="lg:hidden fixed left-0 top-0 bottom-0 z-51 p-3 sm:p-6">
              <Sidebar isMobile onToggle={() => setMobileSidebarOpen(false)} onLogoutRequest={handleLogoutRequest} />
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-hidden lg:bg-neutral-gray-1 rounded-[20px] lg:p-6 lg:shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]">
          <div className="max-w-[1400px] h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Logout confirmation modal — lives here so it survives sidebar unmount */}
      {logoutModalOpen && (
        <Modal onClose={() => setLogoutModalOpen(false)}  className="max-w-sm" xIcon={false} dragHandle={false }>
          <div className="flex flex-col items-center gap-5 p-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <Icon icon="mdi:logout" className="w-7 h-7 text-error-8" />
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h3 className="text-base font-semibold text-neutral-gray-10">Log out of NoticeHub?</h3>
              <p className="text-sm text-neutral-gray-6">You'll need to sign in again to access your account.</p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl border border-neutral-gray-4 text-sm font-medium text-neutral-gray-8 hover:bg-neutral-gray-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-error-7 text-sm font-medium text-white hover:bg-error-8 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
