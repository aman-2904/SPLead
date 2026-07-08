"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Calendar, Wallet, CheckSquare, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

// Reusable animated count component
function AnimatedCounter({
  value,
  duration = 2,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, value, duration]);

  useEffect(() => {
    const unsubscribe = count.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toFixed(decimals) + suffix;
      }
    });
    return unsubscribe;
  }, [count, decimals, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const STATS_DATA = [
  { value: 1000, suffix: "+", label: "Happy Couples", description: "Who designed their forever with us" },
  { value: 800, suffix: "+", label: "Premium Venues", description: "Palaces, beach resorts & luxury lawns" },
  { value: 2000, suffix: "+", label: "Verified Vendors", description: "Top photographers, decor artists & caterers" },
  { value: 4.9, suffix: "★", label: "Customer Rating", description: "Consistently rated for luxury wedding care", decimals: 1 },
];


const PREVIEWS_DASHBOARD = [
  {
    title: "Elite Checklist",
    icon: CheckSquare,
    desc: "12-month calendar tasks curated for Indian wedding milestones.",
    demo: ["Select Royal Venue", "Book Couturier Fitting", "Arrange Sangeet Choreographer"],
  },
  {
    title: "Signature Budget Tracker",
    icon: Wallet,
    desc: "Allocate expenses dynamically across venues, wardrobe, and cuisine.",
    demo: ["Venue: 45%", "Catering: 25%", "Decor & Lights: 15%"],
  },
];

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <div className="relative min-h-screen bg-secondary overflow-hidden">
      {/* Floating Gradient Blur Orbs */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -left-20 w-[450px] h-[450px] rounded-full bg-primary/8 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[60%] -right-20 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[120px] pointer-events-none"
      />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-under-a-floral-arch-41584-large.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Soft white/cream overlay for high-end contrast */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-secondary/60 via-secondary/70 to-secondary backdrop-blur-[1px]" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 mb-6"
          >
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-primary uppercase font-sans">
              ShaadiPlatform luxury planners
            </span>
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            className="font-serif text-5xl md:text-8xl font-black text-primary leading-[1.1] max-w-5xl mx-auto mb-8 drop-shadow-sm"
          >
            Plan Your Dream <br className="hidden md:inline" />
            Wedding <span className="italic font-normal text-accent font-serif">Effortlessly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-xl text-primary/95 max-w-3xl mx-auto mb-12 leading-relaxed font-sans"
          >
            Discover venues, vendors and complete wedding planning in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
          >
            <Link
              href="/wizard"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-secondary rounded-full font-semibold shadow-lg hover:shadow-accent/25 hover:bg-primary-dark transition-all duration-300 flex items-center justify-center gap-2 group border border-transparent hover:border-accent/20"
            >
              Start Planning
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="relative z-30 py-16 -mt-10 bg-secondary-light border-t border-b border-accent/20 shadow-xl elegant-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {STATS_DATA.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center p-4 border-r border-accent/10 last:border-r-0 max-lg:odd:border-r-0 max-lg:last:border-r-0"
              >
                <h3 className="font-serif text-4xl md:text-6xl font-bold text-primary mb-2 tabular-nums">
                  <AnimatedCounter
                    value={stat.value}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                  />
                </h3>
                <h4 className="font-sans text-xs md:text-sm font-semibold tracking-wider text-accent uppercase mb-1">
                  {stat.label}
                </h4>
                <p className="text-[11px] text-primary/70 max-w-[200px] leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Interactive Planning Suite Preview */}
      <section className="py-24 bg-secondary-dark/40 border-t border-b border-accent/20 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-xs font-bold tracking-widest text-accent uppercase font-sans">
                Signature Planners
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary leading-tight">
                Designed to make wedding planning absolute bliss.
              </h2>
              <p className="text-sm text-primary/80 leading-relaxed max-w-xl font-sans">
                No clutter, no confusion. Access digital dashboards crafted with state-of-the-art tools to coordinate your wedding milestone effortlessly.
              </p>
              <div className="pt-4">
                <Link
                  href="/wizard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-secondary rounded-full font-semibold text-xs shadow-md hover:bg-primary-dark transition-all duration-300 border border-transparent hover:border-accent/30"
                >
                  Start Planning
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {PREVIEWS_DASHBOARD.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-secondary-light border border-accent/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="p-3 bg-primary/5 rounded-xl w-fit mb-4">
                      <item.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-primary/70 leading-relaxed font-sans mb-6">
                      {item.desc}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {item.demo.map((todo, key) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 p-2 bg-secondary rounded-lg border border-accent/5 text-[10px] text-primary/80 font-medium"
                      >
                        <div className="h-4 w-4 rounded-full bg-accent/20 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-primary" />
                        </div>
                        {todo}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
