"use client";

import { navLinks } from "@/constant";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Image as ImageIcon,
  Eraser,
  Save,
  Home,
  Wand2,
  Palette,
  Trash2,
  UserCircle,
  CreditCard,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 bg-white p-5 shadow-md shadow-purple-200/50 lg:flex">
      <div className="flex size-full flex-col gap-4">
        <Link href="/" className="sidebar-logo">
          <div className="p-4 pl-0 flex items-center space-x-2">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-4xl">I</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Imaginify</h1>
          </div>
        </Link>
        <Separator />
        <nav className="h-full flex-col justify-between md:flex md:gap-4">
          <SignedIn>
            <ul className="hidden w-full flex-col items-start gap-2 md:flex">
              {navLinks.slice(0, 6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`flex items-center px-4 py-2 w-full text-sm font-medium rounded-md hover:bg-emerald-50 hover:text-emerald-700 group ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-gray-700"
                    }`}
                  >
                    <Link
                      href={link.route}
                      className="text-sm font-medium flex size-full gap-4"
                    >
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={22}
                        height={22}
                        className={`${isActive ? "opacity-90" : "opacity-40"}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="hidden w-full flex-col items-start gap-2 md:flex">
              <Separator />
              <li className="flex-center cursor-pointer gap-2 p-2 pl-1">
                <UserButton afterSignOutUrl="/" showName />
              </li>
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`flex items-center px-4 py-2 w-full text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-50   group ${
                      isActive ? "bg-gray-100 " : "text-gray-700"
                    }`}
                  >
                    <Link
                      href={link.route}
                      className="text-sm font-medium flex size-full gap-4"
                    >
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive ? "opacity-100" : "opacity-40"}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </SignedIn>
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
