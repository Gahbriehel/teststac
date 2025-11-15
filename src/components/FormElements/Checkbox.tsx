import { type JSX } from "react";
import { clsx } from "clsx";

interface Props {
  id: string;
  checked: boolean;
  label: string;
  className?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({
  id,
  checked,
  onChange,
  className = "",
  label,
  disabled = false,
}: Props): JSX.Element {
  return (
    <label
      className={clsx(
        "flex items-center space-x-2 cursor-pointer select-none",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          "h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-green-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
