"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Planning Tools",
    links: [
      { label: "Wedding Checklist", href: "/tools/checklist" },
      { label: "Budget Manager", href: "/tools/budget" },
      { label: "Guest List Tracker", href: "/tools/guestlist" },
      { label: "Vendor Directory", href: "/vendors" },
      { label: "Wedding Websites", href: "/websites" },
    ],
  },
  {
    title: "Inspiration",
    links: [
      { label: "Real Weddings", href: "/real-weddings" },
      { label: "Wedding Ideas & Trends", href: "/inspiration" },
      { label: "Photo Gallery", href: "/gallery" },
      { label: "Bridal Fashion", href: "/fashion" },
      { label: "Wedding Registry", href: "/registry" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "For Vendors", href: "/pro" },
      { label: "Advertise with Us", href: "/advertise" },
      { label: "Wedding Concierge", href: "/concierge" },
      { label: "Gift Registry", href: "/registry" },
      { label: "Shaadi Gold Membership", href: "/gold" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-secondary border-t border-accent/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Signature Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center">
              <img
                src="/whitelogo.png"
                alt="Shaadi Platform"
                className="h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-secondary/80 leading-relaxed font-sans max-w-sm">
              Crafting extraordinary wedding stories. From elite venues to master designers, we connect you with everything required to turn your dream wedding into a breathtaking reality.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="p-2 border border-accent/30 rounded-full text-secondary hover:text-accent hover:border-accent transition-all duration-300 hover:scale-105"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="font-serif text-base font-semibold text-accent tracking-wider uppercase">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary/80 hover:text-accent transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-secondary/60">
          <p>© {currentYear} ShaadiPlatform.com. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/cookies" className="hover:text-accent transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
