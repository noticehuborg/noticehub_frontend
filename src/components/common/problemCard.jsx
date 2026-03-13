import { Icon } from "@iconify/react";
import Button from "../ui/Button";

export default function ProblemCard({
  number,
  heading,
  subtext,
  buttonText,
  buttonOnClick,
  whiteCard = false,
  className,
}) {
  return (
      <div
        className={`relative min-h-85.5 max-w-[490.67px] px-5 md:px-8 lg:px-12 py-10 md:py-12 lg:py-14 ${whiteCard ? "bg-neutral-gray-1" : "bg-secondary"} rounded-[20px] lg:rounded-[24px] flex flex-col items-start gap-5 overflow-hidden ${className}`}
      >
        <p
          className={`max-w-[85%] ${whiteCard ? "text-secondary" : "text-neutral-gray-1"} text-2xl leading-normal lg:text-3xl font-medium capitalize leading-10`}
        >
          {heading}
        </p>
        <div className={`${whiteCard ? "text-neutral-gray-7" : "text-neutral-gray-5"} text-sm sm:text-base lg:text-lg leading-6 xsm:leading-7`}>
          {subtext}
        </div>
        {buttonText && buttonOnClick ? (
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                buttonText && buttonOnClick();
              }}
              className="font-normal! text-sm sm:text-base p-0! text-blue-3! hover:text-blue-5! gap-1! hover:bg-transparent! underline"
            >
              {buttonText}
              <Icon icon="tabler:arrow-up-right" width={20} />
            </Button>
          </div>
        ) : null}

        {number && (
          <p
            className={`absolute right-5 top-2.5 text-5xl md:text-[82px] font-bold ${whiteCard ? "text-neutral-gray-2" : "text-[#2B2B2C]"}`}
          >
            {number}
          </p>
        )}
      </div>
  );
}
