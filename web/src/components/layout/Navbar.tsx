"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wrench, Users, Car, ClipboardList } from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { label: "Panel", href: "/", icon: ClipboardList },
  { label: "Clientes", href: "/clientes", icon: Users },
];

const Navbar: FC = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-1/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-accent/15 border border-accent/30 group-hover:bg-accent/25 transition-colors">
              <Wrench size={14} className="text-accent" />
            </div>
            <span className="font-display text-lg tracking-widest text-text-primary hidden sm:block">
              TALLER MECANICO
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-surface-3 text-text-primary border border-border"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
                  )}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Wallet button */}
        <div className="wallet-button-wrapper">
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
