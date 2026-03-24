import { Icon } from "@iconify/react";

export default function FaqItem({ question, answer, isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer w-full text-left rounded-3xl transition-all duration-200 ${
        isOpen
          ? "bg-secondary px-6 md:px-8 lg:px-12 py-6 lg:py-7 shadow-sm"
          : "bg-[#f7f7f7] px-6 md:px-8 lg:px-12 py-5 lg:py-7"
      }`}
    >
      <div className="flex justify-between items-start md:items-center gap-4 md:gap-5">
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <p
            className={`text-base md:text-lg lg:text-xl leading-7 ${
              isOpen
                ? "text-neutral-gray-1 font-semibold"
                : "text-secondary font-medium"
            }`}
          >
            {question}
          </p>
          {isOpen && (
            <p className="text-neutral-gray-5 text-sm md:text-base leading-6 md:leading-7">
              {answer}
            </p>
          )}
        </div>
        <div
          className="shrink-0 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-white"
        >
          <Icon
            icon={isOpen ? "tabler:x" : "tabler:plus"}
            width={18}
            className={isOpen ? "text-secondary" : "text-blue-3"}
          />
        </div>
      </div>
    </button>
  );
}
