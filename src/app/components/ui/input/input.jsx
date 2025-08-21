import { annotateDynamicAccess } from "next/dist/server/app-render/dynamic-rendering";

export function Input({
  title,
  name = "",
  type = "text",
  required = false,
  placeholder,
  ref,
  errorMessage = "",
  onKeyUp = ()=>{}
}) {
  return (
    <div className="w-full flex flex-col gap-1 justify-center">
      {title && (
        <p className="text-xs font-medium">
          {title}
          {required && <span className="text-red-500"> *</span>}
        </p>
      )}
      <input
        className={`px-4 py-2 h-10 rounded-md border bg-transparent ${errorMessage ? "border-red-500" : "border-zinc-700"} focus:border-2 focus:border-white focus:outline-0`}
        name={name}
        type={type}
        placeholder={placeholder}
        onKeyUp={(e) => {onKeyUp(e)}}
        ref={ref}
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
