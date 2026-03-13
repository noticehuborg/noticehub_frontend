import { Fragment } from "react";

export default function TeamCard({ name, roles, image }) {
  return (
    <div className="relative w-72 h-96 rounded-3xl overflow-hidden flex-shrink-0">
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <div className="px-5 py-3 bg-black/40 rounded-2xl backdrop-blur-sm flex flex-col gap-1">
          <p className="text-neutral-gray-1 text-base font-semibold leading-6">{name}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {roles.map((role, i) => (
              <Fragment key={role}>
                {i > 0 && <div className="w-px h-3 bg-neutral-gray-4" />}
                <span className="text-neutral-gray-4 text-xs leading-4">{role}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
