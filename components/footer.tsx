"use client";

import React from "react";
import Link from "next/link";


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
          </div>

          {/* EXPLORE Column */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-accent tracking-wider uppercase">
              EXPLORE
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Gallery", href: "https://shaadiplatform.com/gallery/" },
                { label: "Services", href: "https://shaadiplatform.com/wedding-planning-services/" },
                { label: "About", href: "https://shaadiplatform.com/about/" },
                { label: "Contact", href: "https://shaadiplatform.com/contact/" },
              ].map((link) => (
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

          {/* Contact & Location Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Socials */}
            <div className="flex gap-6">
              <a href="https://www.instagram.com/shaadi_platform/" target="_blank" rel="noopener noreferrer" className="font-serif text-lg font-semibold text-secondary hover:text-accent transition-colors">Instagram</a>
              <a href="https://www.facebook.com/profile.php?id=61572586872192" target="_blank" rel="noopener noreferrer" className="font-serif text-lg font-semibold text-secondary hover:text-accent transition-colors">Facebook</a>
              <a href="https://www.linkedin.com/company/shaadiplatform/" target="_blank" rel="noopener noreferrer" className="font-serif text-lg font-semibold text-secondary hover:text-accent transition-colors">Linkedin</a>
            </div>

            {/* Contact Details */}
            <div className="space-y-2">
              <a href="mailto:Info@shaadiplatform.com" className="block text-sm text-secondary/80 hover:text-accent transition-colors">Info@shaadiplatform.com</a>
              <a href="tel:+919990837771" className="block text-sm text-secondary/80 hover:text-accent transition-colors">+91-99908 37771</a>
              <a href="tel:+919990863337" className="block text-sm text-secondary/80 hover:text-accent transition-colors">+91-99908 63337</a>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-semibold text-accent tracking-wider">
                Location
              </h3>
              <p className="text-sm text-secondary/80 leading-relaxed max-w-sm">
                M 257, 3rd Floor, Guru Harkrishan Nagar, New Delhi, Delhi 110087, India
              </p>
            </div>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-secondary/60">
          <p>© {currentYear} ShaadiPlatform. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
}
