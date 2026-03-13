import { Icon } from "@iconify/react";

export default function FeatureItem({ icon, title, desc }) {
  return (
    <div className="relative pl-16 md:pl-20 pr-4 md:pr-16 py-10 md:py-12 flex flex-col gap-3.5">
      <div className="absolute left-0 -top-2.5 w-14 h-14 md:w-20 md:h-20 rotate-[16deg] overflow-hidden">
        <Icon icon={icon} className="w-full h-full text-neutral-gray-1" />
      </div>
      <h3 className="text-neutral-gray-1 text-lg md:text-xl font-semibold leading-7 md:leading-8">
        {title}
      </h3>
      <p className="text-blue-2 text-sm md:text-base leading-5">
        {desc}
      </p>
    </div>
  );
}
