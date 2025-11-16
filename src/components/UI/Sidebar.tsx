import Link from "next/link";
import { JSX } from "react";
import { RxDashboard } from "react-icons/rx";
import { SlPeople } from "react-icons/sl";
import { LuMousePointerClick } from "react-icons/lu";
import { BsBarChart } from "react-icons/bs";
import { FaCog } from "react-icons/fa";
import { PiShieldCheck } from "react-icons/pi";
import { TbShieldCheckFilled } from "react-icons/tb";
import { HiMenuAlt1 } from "react-icons/hi";
import { Logo } from "./Logo";

const navLinks = [
  { icon: <RxDashboard />, name: "Dashboard", href: "#", badge: null },
  { icon: <SlPeople />, name: "Managers", href: "#", badge: null },
  { icon: <LuMousePointerClick />, name: "Locations", href: "#", badge: null },
  { icon: <BsBarChart />, name: "Billing & Invoices", href: "#", badge: "18" },
];

const supportLinks = [
  { icon: <FaCog />, name: "Settings", href: "#", badge: null },
  { icon: <PiShieldCheck />, name: "What's new?", href: "#", badge: null },
  {
    icon: <TbShieldCheckFilled />,
    name: "Custom Request",
    href: "#",
    badge: null,
  },
];

export function Sidebar(): JSX.Element {
  return (
    <aside className="w-64 bg-white rounded-lg shadow-sm p-6 hidden md:block text-[#101010]">
      <div className="flex justify-between items-center mb-6">
        <Logo />
        <HiMenuAlt1 className="cursor-pointer" />
      </div>

      <input
        type="text"
        placeholder="Search..."
        className="h-8 px-3 py-1 rounded-md border border-gray-200 text-sm"
      />
      <nav className="space-y-4">
        {navLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="flex items-center space-x-3 text-gray-500"
          >
            <span>{link.icon}</span>
            <span>{link.name}</span>
            {link.badge && (
              <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <p>Support</p>
      <div className="space-y-4">
        {supportLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="flex items-center space-x-3 text-gray-500"
          >
            <span>{link.icon}</span>
            <span>{link.name}</span>
            {link.badge && (
              <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}
