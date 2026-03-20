import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import LinesVectorBg from "../../assets/svg/linesvectorbg.svg";

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function toggleMobileSidebar() {
    setMobileSidebarOpen((v) => !v);
  }

  return (
    <div className="relative h-screen flex flex-col bg-section-bg overflow-hidden">
      <Header variant="dashboard" onSidebarToggle={toggleMobileSidebar} />

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
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay — always expanded */}
        {mobileSidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-[0.5px]"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="lg:hidden fixed left-0 top-[73px] bottom-0 z-40 p-3 sm:p-6">
              <Sidebar isMobile onToggle={() => setMobileSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 h-auto overflow-y-auto bg-neutral-gray-1 rounded-[20px] p-6 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]">
          <div className=" max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
