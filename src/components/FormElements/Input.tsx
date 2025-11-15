import { clsx } from "clsx";
import Link from "next/link";
import {
  forwardRef,
  type ReactNode,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  countryCode?: string;
  error?: string;
  password?: boolean;
  required?: boolean;
  icon?: ReactNode;
  hidePassword?: () => void;
  showPassword?: () => void;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    id,
    label,
    error,
    password,
    required,
    showPassword,
    hidePassword,
    countryCode,
    icon,
    className,
    ...props
  },
  ref,
) {
  const isPasswordField = password && props.type === "password";

  return (
    <fieldset className="relative space-y-2">
      {label && (
        <>
          {isPasswordField ? (
            <div className="flex items-center justify-between">
              <label htmlFor={id} className="text-sm text-[#52525B]">
                {label}&nbsp;{required && <span className="text-red-600">*</span>}
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#52525B] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          ) : (
            <label htmlFor={id} className="block text-sm text-[#52525B]">
              {label}&nbsp;{required && <span className="text-red-600">*</span>}
            </label>
          )}
        </>
      )}
      <div className="relative flex">
        <input
          {...props}
          ref={ref}
          id={id}
          value={props.value ?? ""}
          className={clsx(
            "h-10 w-full rounded-r-xl border border-[#D9DCE1] px-4 py-2 text-sm font-medium text-[#242440] disabled:cursor-not-allowed outline-none",
            className,
            error && "border-red-500",
          )}
        />
        {password &&
          (props.type === "password" ? (
            <FiEye
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3ACB9] cursor-pointer"
              onClick={showPassword}
            />
          ) : (
            <FiEyeOff
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3ACB9] cursor-pointer"
              onClick={hidePassword}
            />
          ))}
        {icon}
      </div>
      {error && (
        <p className="text-sm text-red-600" id="error">
          {error}
        </p>
      )}
    </fieldset>
  );
});