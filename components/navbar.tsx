"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface NavLink {
  label: string;
  href: string;
  dropdown?: { label: string; href: string; }[];
}

const NAV_LINKS: NavLink[] = [];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isScrolled
          ? "bg-secondary/90 backdrop-blur-md shadow-md py-3 border-b border-accent/20"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="Shaadi Platform"
              className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
              >
                {link.dropdown ? (
                  <button className="flex items-center gap-1 text-sm font-medium text-primary/80 hover:text-primary transition-colors py-2 cursor-pointer">
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 text-accent" />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors py-2 relative block",
                      pathname === link.href ? "text-primary font-semibold" : "text-primary/80 hover:text-primary"
                    )}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {link.dropdown && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-1 w-56 bg-secondary border border-accent/20 rounded-md shadow-lg overflow-hidden z-50"
                  >
                    <div className="py-1">
                      {link.dropdown.map((sublink) => (
                        <Link
                          key={sublink.label}
                          href={sublink.href}
                          className="block px-4 py-2.5 text-xs font-medium text-primary/80 hover:text-primary hover:bg-accent/10 transition-colors"
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/wizard"
              className="px-5 py-2.5 bg-primary text-secondary text-sm font-medium rounded-full hover:bg-primary-dark shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-accent/30"
            >
              Start Planning
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:text-accent p-2 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-secondary border-b border-accent/20 overflow-hidden shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {NAV_LINKS.map((link) => (
                <div key={link.label} className="space-y-1">
                  {link.dropdown ? (
                    <>
                      <span className="block px-3 py-2 text-sm font-semibold text-primary/50 uppercase tracking-wider">
                        {link.label}
                      </span>
                      <div className="pl-4 space-y-1">
                        {link.dropdown.map((sublink) => (
                          <Link
                            key={sublink.label}
                            href={sublink.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-sm font-medium text-primary/80 hover:text-primary transition-colors"
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        pathname === link.href
                          ? "bg-accent/10 text-primary font-semibold"
                          : "text-primary/80 hover:bg-accent/5 hover:text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <hr className="border-accent/10 my-4" />
              <div className="grid grid-cols-1 gap-3 px-3">
                <Link
                  href="/wizard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2.5 text-sm font-medium text-secondary bg-primary rounded-full hover:bg-primary-dark transition-all duration-300"
                >
                  Start Planning
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
