export default function SectionTitle({ onColor, tag, heading, subtext }) {
  return (
    <div className="w-full inline-flex flex-col justify-center items-center gap-3 md:gap-4">
      <p
        className={`uppercase text-[13px] md:text-sm ${onColor ? "text-neutral-gray-1 bg-transparent" : "text-neutral-gray-9 bg-neutral-gray-2"}  px-2.5 py-1.5 sm:px-3 sm:py-2  rounded-full border border-neutral-gray-5`}
      >
        {tag}
      </p>
      <div className="flex flex-col items-center gap-4 md:gap-5">
        <div
          className={`text-center leading-[125%] ${onColor ? "text-neutral-gray-1 " : "text-secondary"}  text-[24px] sm:text-[28px] md:text-[36px] xl:text-[56px] text-5xl font-semibold`}
        >
          {heading}
        </div>
        <div
          className={`max-w-[400px] md:max-w-[500px] lg:max-w-[600px] text-center text-sm md:text-base lg:text-lg ${onColor ? "text-neutral-gray-5 " : "text-neutral-gray-8"} `}
        >
          {subtext}
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="w-full max-w-[768px] inline-flex flex-col justify-start items-center gap-4">
  <div className="px-3 py-2 rounded-[64px] outline outline-1 outline-offset-[-1px] outline-neutrals-neutral-gray-5 flex flex-col justify-center items-start gap-2">
    <div className="self-stretch text-center justify-start text-neutrals-neutral-gray-1 text-sm font-normal font-['Plus_Jakarta_Sans'] uppercase">
      FEATURES
    </div>
  </div>
  <div className="self-stretch flex flex-col justify-start items-center gap-6">
    <div className="self-stretch text-center justify-start text-neutrals-neutral-gray-1 text-5xl font-semibold font-['Plus_Jakarta_Sans'] leading-[65px]">
      What sets us apart
    </div>
    <div className="w-[616px] text-center justify-start text-neutrals-neutral-gray-5 text-lg font-normal font-['Plus_Jakarta_Sans']">
      Built for the way you actually work and study
    </div>
  </div>
</div>; */
}
