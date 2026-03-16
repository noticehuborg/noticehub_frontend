import { Icon } from "@iconify/react";

export default function FeatureItem({
  icon,
  title,
  desc,
  iconClass = "w-full h-full",
}) {
  return (
    <div className="flex items-start px-4 xl:px-16 py-10 md:py-12 gap-3 md:gap-6 lg:gap-4">
      <div className={`w-12 h-12 md:w-18 md:h-18 lg:w-24 lg:h-24 rotate-16 overflow-hidden -mt-7 md:-mt-10 shrink-0 lg:shrink`}>
        <Icon icon={icon} className={`text-neutral-gray-1 ${iconClass}`} />
      </div>
      <div className=" flex flex-col gap-3.5">
        <h3 className="text-neutral-gray-1 text-lg md:text-xl font-semibold leading-7 md:leading-8">
          {title}
        </h3>
        <p className="text-blue-2 text-sm md:text-base leading-5 max-w-[560px]">{desc}</p>
      </div>
    </div>
  );
}
