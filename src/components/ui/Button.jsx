const baseStyles = `
    inline-flex items-center justify-center gap-2 
    font-medium cursor-pointer transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none cursor-pointer select-none
  `;

const sizeClasses = {
  sm: "px-4 py-2 md:px-6 md:py-3 text-sm rounded-[10px]",
  md: "px-5 py-2 md:px-7 md:py-4 text-base rounded-xl",
};

// Variant styles
const variantClasses = {
  primary: "text-blue-50 bg-primary hover:bg-primary-hover active:bg-primary-active",
  outline: "text-primary border border-blue-3 hover:border-blue-5 bg-neutral-gray-1 hover:bg-tertiary-hover active:bg-tertiary-hover active:bg-blue-2",
  ghost: "text-primary hover:text-primary-hover active:text-primary-active bg-transparent hover:bg-tertiary-hover active:bg-tertiary-hover",
};

export default function Button({
  children,
  variant = "primary",
  size = "sm",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const base = variantClasses[variant] || variantClasses.primary;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${base} ${sizeClasses[size]} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}  ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
