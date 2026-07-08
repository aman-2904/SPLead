"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Lock, Mail, User, AlertCircle, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

export default function AdminSignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      // 1. Create auth user
      const { data: { user: authUser }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        throw error;
      }

      if (authUser) {
        // 2. Insert admin profile row in public users table
        const { error: profileError } = await supabase
          .from("users")
          .insert({
            id: authUser.id,
            email: email,
            name: name,
            role: "Admin"
          });

        if (profileError) {
          // If the profile insert fails, throw it
          throw profileError;
        }

        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1500);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "Signup failed. Please try a different email or check password constraints.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-secondary-light border border-accent/20 rounded-3xl p-8 shadow-2xl relative z-10 text-primary space-y-6"
      >
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Heart className="h-7 w-7 text-accent fill-accent mx-auto" />
          <h2 className="font-serif text-2xl font-bold tracking-wide">
            Shaadi<span className="text-accent">Admin</span>
          </h2>
          <p className="text-[10px] text-primary/60 uppercase tracking-widest font-semibold">
            Create System Admin Account
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 text-center space-y-3.5"
          >
            <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="font-serif text-lg font-bold">Admin Created Successfully!</h3>
            <p className="text-xs text-primary/65">Redirecting to control dashboard...</p>
          </motion.div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-2 text-xs font-semibold text-primary">
                <AlertCircle className="h-4 w-4 shrink-0 text-accent" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-wider uppercase text-primary/60">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-accent" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Devika Narain"
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary border border-accent/30 rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-primary font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-wider uppercase text-primary/60">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-accent" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@shaadiplatform.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary border border-accent/30 rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-primary font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-wider uppercase text-primary/60">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-accent" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary border border-accent/30 rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-primary font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary text-secondary text-xs font-bold rounded-full hover:bg-primary-dark transition-all duration-300 shadow-md flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-secondary" />
                ) : (
                  <>
                    Register Administrator
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 text-[10px] font-semibold text-primary/60">
              Already registered?{" "}
              <Link href="/admin/login" className="text-accent hover:underline">
                Sign In Instead
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
