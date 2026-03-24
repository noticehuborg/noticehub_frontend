import { useState } from "react";
import { Icon } from "@iconify/react";

export default function LinkCard({ lnk }) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(lnk.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <a
      href={lnk.url}
      target="_blank"
      rel="noreferrer"
      className="w-full md:w-[250px] relative bg-zinc-100 rounded-xl px-4 py-2.5 overflow-hidden flex flex-col gap-0.5 hover:bg-neutral-gray-3 transition-colors group"
    >
      <p className="text-xs font-medium text-secondary leading-5 pr-8 max-w-[88%] w-full truncate">
        {lnk.label}
      </p>
      <p className="text-xs text-neutral-gray-6 truncate pr-8">{lnk.url}</p>
      <button
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy URL"}
        className="cursor-pointer absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-[0px_1px_2px_0px_rgba(0,0,0,0.20)] flex items-center justify-center hover:bg-neutral-gray-2 transition-colors shrink-0"
      >
        <Icon
          icon={copied ? "mdi:check" : "solar:copy-linear"}
          className={`w-3.5 h-3.5 transition-colors ${copied ? "text-green-600" : "text-neutral-gray-7"}`}
        />
      </button>
    </a>
  );
}
