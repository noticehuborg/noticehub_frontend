import { Icon } from "@iconify/react";

export default function FaqItem({ question, answer, isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-3xl transition-all duration-200 ${
        isOpen
          ? "bg-neutral-gray-1 px-6 md:px-12 py-6 md:py-8 shadow-sm"
          : "bg-white/10 px-5 md:px-12 py-5 md:py-7"
      }`}
    >
      <div className="flex justify-between items-start gap-4 md:gap-5">
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <p
            className={`text-base md:text-xl leading-7 ${
              isOpen
                ? "text-secondary font-semibold"
                : "text-neutral-gray-2 font-medium"
            }`}
          >
            {question}
          </p>
          {isOpen && (
            <p className="text-neutral-gray-7 text-sm md:text-lg leading-6 md:leading-7">
              {answer}
            </p>
          )}
        </div>
        <div
          className={`flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
            isOpen ? "bg-secondary" : "bg-white"
          }`}
        >
          <Icon
            icon={isOpen ? "tabler:x" : "tabler:plus"}
            width={16}
            className={isOpen ? "text-neutral-gray-1" : "text-blue-blue-3"}
          />
        </div>
      </div>
    </button>
  );
}
