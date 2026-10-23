"use client";

import { Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AppSidebar } from "./side-nav-bar";

const NavBarContainer = () => {
  const [isMenuSelected, setInMenuSelected] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleMenuSelect = () => {
    setInMenuSelected((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setInMenuSelected(false);
      }
    };

    if (isMenuSelected) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMenuSelected]);

  return (
    <article>
      <div className="flex items-center justify-between pt-6 pb-4 lg:hidden border-b border-white/5">
        <button
          onClick={handleMenuSelect}
          className="p-2 rounded-xl border border-white/10 bg-slate-900/80 text-slate-300 hover:text-white hover:border-violet-500/40 transition-all cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
          Skillora AI
        </span>
      </div>

      {isMenuSelected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden">
          <div ref={sidebarRef} className="h-full">
            <AppSidebar callBack={setInMenuSelected} />
          </div>
        </div>
      )}
    </article>
  );
};

export default NavBarContainer;
