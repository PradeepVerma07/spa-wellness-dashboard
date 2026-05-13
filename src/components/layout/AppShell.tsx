"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { Footer } from "@/components/layout/Footer";
import { GsapEffects } from "@/components/layout/GsapEffects";
import { Header } from "@/components/layout/Header";

export function AppShell({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");

  return (
    <>
      <GsapEffects />
      {!admin && <Header settings={settings} />}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={admin ? "min-h-screen" : "min-h-screen pt-20"}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!admin && <Footer settings={settings} />}
    </>
  );
}
