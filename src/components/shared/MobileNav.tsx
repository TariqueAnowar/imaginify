"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { navLinks } from "@/constant";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";

const MobileNav = () => {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="flex-between fixed h-16 w-full border-b-4 border-purple-100 bg-white p-5 lg:hidden">
      <Link href="/" className="sidebar-logo">
        <div className="p-4 pl-0 flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">I</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Imaginify</h1>
        </div>
      </Link>

      <nav className="flex gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button onClick={() => setIsSheetOpen(true)}>
                <Image
                  src="/assets/icons/menu.svg"
                  width={32}
                  height={32}
                  alt="menu"
                />
              </button>
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
              <>
                <div className="p-4 pl-0 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">I</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-800">Imaginify</h1>
                </div>
                <Separator className="mt-4" />
                <div>
                  <ul className="w-full flex-col items-start gap-2 mt-4 md:flex">
                    {navLinks.slice().map((link) => {
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
                            onClick={handleMenuClick}
                          >
                            <Image
                              src={link.icon}
                              alt="logo"
                              width={22}
                              height={22}
                              className={`${
                                isActive ? "opacity-90" : "opacity-40"
                              }`}
                            />
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
