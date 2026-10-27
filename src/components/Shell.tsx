"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Onboard } from "./Onboard";
import { Dots } from "./Seats";
import { SPORT_LIST, SPORTS } from "@/lib/sports";
import { useStore } from "@/lib/store";

const links = [
  { href: "/", label: "Groups" },
  { href: "/yours", label: "Yours" },
  { href: "/results", label: "Sheets" },
  { href: "/waitlist", label: "Hold" },
  { href: "/profile", label: "You" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { search, setSport, profile, ready } = useStore();

  return (
    <div className="shell">
      <header className="topbar">
        <Link href="/" className="mark">
          <Dots filled={4} ink />
          <strong>Foursome</strong>
        </Link>
        {profile.setup ? (
          <nav className="nav">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={
                  path === link.href ||
                  (link.href === "/" && path.startsWith("/group")) ||
                  (link.href === "/yours" && (path.startsWith("/handoff") || path.startsWith("/invite")))
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      {ready && profile.setup ? (
        <div className="sports">
          {SPORT_LIST.map((id) => (
            <button key={id} type="button" data-on={search.sport === id} onClick={() => setSport(id)}>
              {SPORTS[id].label}
            </button>
          ))}
        </div>
      ) : null}
      <main className="page">
        {!ready ? <p className="lede">Loading…</p> : profile.setup ? children : <Onboard />}
      </main>
    </div>
  );
}
