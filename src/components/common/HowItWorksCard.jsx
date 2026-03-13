import { Icon } from "@iconify/react";

export default function HowItWorksCard({ icon, title, desc }) {
  return (
    <div className="px-7 py-10 md:p-10 bg-slate-50/5 rounded-2xl shadow-[0px_2px_5px_0px_rgba(255,255,255,0.10)] outline outline-[0.70px] outline-offset-[-0.70px] outline-white backdrop-blur-[1px] flex flex-col justify-center items-start gap-6">
      <div className="flex flex-col items-start gap-4">
        <Icon icon={icon} className="w-8 h-8 md:w-10 md:h-10 text-blue-4" />
        <h3 className="text-neutral-gray-1 text-base md:text-xl font-medium leading-6 md:leading-8">
          {title}
        </h3>
      </div>
      <p className="text-neutral-gray-5 text-sm md:text-base leading-5 md:leading-6">
        {desc}
      </p>
    </div>
  );
}
