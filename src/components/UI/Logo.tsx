import { clsx } from "clsx";
import Link from "next/link";
import Image from "next/image";

import logoFullUrl from "@/svgs/logo-full.svg?url";
import logoMiniUrl from "@/svgs/logo-mini.svg?url";

interface Props {
  className?: string;
  svgClassName?: string;
}

export function Logo({ className, svgClassName }: Props) {
  return (
    <Link href="/dashboard" className={clsx(className)}>
      <div className="hidden md:block">
        <Image
          src={logoFullUrl}
          alt="Logo"
          width={138}
          height={35}
          className={svgClassName}
        />
      </div>

      <div className="block md:hidden">
        <Image
          src={logoMiniUrl}
          alt="Logo"
          width={35}
          height={35}
          className={svgClassName}
        />
      </div>
    </Link>
  );
}
