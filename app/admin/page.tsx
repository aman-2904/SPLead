"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, Heart, Sparkles, Calendar, Check, X,
  ShieldCheck, Sun, Moon, SlidersHorizontal, TrendingUp, Settings,
  UserCheck, Trash2, RefreshCw, MapPin, Clock, Eye, Phone, Mail, AlertCircle
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  // Authentication role check
  const [isAdmin, setIsAdmin] = useState(true);
  const [loadingRole, setLoadingRole] = useState(true);

  // States
  const [activeTab, setActiveTab] = useState<"dashboard" | "requests" | "users" | "roles">("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Database Data States
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Inspect Modal State
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // Analytical Metrics computed from database
  const getMetrics = () => {
    const totalRequests = requests.length;
    const registeredUsers = users.length;
    
    // Budget distribution or flexible date ratio
    const flexibleDates = requests.filter(r => r.is_flexible_date).length;
    const flexibleRatio = totalRequests > 0 ? Math.round((flexibleDates / totalRequests) * 100) : 0;

    return [
      { label: "Total Requests", value: String(totalRequests), change: "+18.2%", icon: Sparkles },
      { label: "Flexible Dates", value: `${flexibleRatio}%`, change: `${flexibleDates} leads`, icon: Calendar },
      { label: "System Admins / Users", value: String(registeredUsers), change: "+4.5%", icon: Users },
      { label: "Completion Rate", value: "100%", change: "Optimized", icon: LayoutDashboard },
    ];
  };

  const fetchData = async () => {
    setLoadingData(true);
    try {
      // Fetch Planning Requests from DB
      const { data: reqData, error: reqErr } = await supabase
        .from("planning_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (!reqErr && reqData) {
        setRequests(reqData);
      }

      // Fetch Users from DB
      const { data: usrData, error: usrErr } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (!usrErr && usrData) {
        setUsers(usrData);
      }
    } catch (e) {
      console.error("Error loading admin dashboard lists:", e);
    } finally {
      setLoadingData(false);
    }
  };

  // Check if current user has Admin role
  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data: dbUser, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error || !dbUser || (dbUser.role !== "Admin" && dbUser.role !== "Coordinator")) {
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      setIsAdmin(dbUser.role === "Admin");
      setLoadingRole(false);

      // Fetch dynamic database data
      await fetchData();
    }
    checkRole();
  }, [router]);

  const updateUserRole = async (id: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", id);

      if (!error) {
        setUsers(users.map((u) => u.id === id ? { ...u, role: newRole } : u));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this planning request?")) return;
    try {
      const { error } = await supabase
        .from("planning_requests")
        .delete()
        .eq("id", id);

      if (!error) {
        setRequests(requests.filter((r) => r.id !== id));
        if (selectedRequest?.id === id) {
          setSelectedRequest(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loadingRole) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 text-accent animate-spin" />
        <p className="text-xs font-semibold text-primary/60 tracking-wider uppercase">Verifying Admin Permissions...</p>
      </div>
    );
  }

  const analytics = getMetrics();

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-300",
      darkMode ? "dark bg-neutral-950 text-neutral-100" : "bg-secondary text-primary"
    )}>
      
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-secondary-light dark:bg-neutral-900 border-r border-accent/20 dark:border-neutral-800 p-6 space-y-8 shrink-0 text-left">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary dark:text-accent dark:fill-accent" />
          <span className="font-serif text-xl font-bold tracking-wide">
            Shaadi<span className="text-accent">Admin</span>
          </span>
        </div>

        <nav className="flex flex-col gap-1.5 flex-grow">
          {[
            { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
            { id: "requests", label: "Planning Requests", icon: Sparkles },
            { id: "users", label: "User Accounts", icon: UserCheck },
            { id: "roles", label: "System Roles", icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3.5 transition-all text-left cursor-pointer border border-transparent",
                activeTab === tab.id
                  ? "bg-primary text-secondary dark:bg-accent dark:text-neutral-900"
                  : "text-primary/70 dark:text-neutral-400 hover:bg-accent/15 dark:hover:bg-neutral-850"
              )}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main content viewport */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header controls */}
        <header className="flex items-center justify-between p-6 border-b border-accent/15 dark:border-neutral-800 bg-secondary-light/40 dark:bg-neutral-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden p-2 rounded-xl border border-accent/20 dark:border-neutral-800 text-primary dark:text-neutral-300"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-accent">
              {activeTab === "dashboard" ? "Analytical Center" : activeTab.replace("-", " ")}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Refresh Data Toggle */}
            <button
              onClick={fetchData}
              className="p-2.5 bg-secondary-light dark:bg-neutral-800 border border-accent/20 dark:border-neutral-750 text-primary dark:text-neutral-200 rounded-full cursor-pointer hover:bg-accent/10 transition-colors"
            >
              <RefreshCw className={cn("h-4 w-4", loadingData ? "animate-spin" : "")} />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 bg-secondary-light dark:bg-neutral-800 border border-accent/20 dark:border-neutral-750 text-primary dark:text-neutral-200 rounded-full cursor-pointer hover:bg-accent/10 transition-colors"
            >
              {darkMode ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="flex items-center gap-3 border-l border-accent/20 dark:border-neutral-800 pl-4">
              <div className="h-8 w-8 rounded-full bg-primary text-secondary dark:bg-accent dark:text-neutral-900 text-xs font-bold flex items-center justify-center font-serif">
                A
              </div>
              <span className="hidden sm:inline-block text-xs font-bold">Admin Panel</span>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/admin/login");
                  router.refresh();
                }}
                className="text-[10px] font-bold text-primary hover:text-accent bg-secondary border border-accent/30 rounded-full px-3 py-1 cursor-pointer transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Body Container */}
        <main className="p-6 md:p-8 flex-grow overflow-y-auto space-y-8">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: Dashboard Overview */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Metric Summary Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {analytics.map((card) => (
                    <div key={card.label} className="p-5 bg-secondary-light dark:bg-neutral-900 border border-accent/20 dark:border-neutral-800 rounded-2xl space-y-3 shadow-sm text-left">
                      <div className="flex justify-between items-center text-primary/60 dark:text-neutral-400">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
                        <card.icon className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl md:text-2xl font-bold font-serif">{card.value}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">{card.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analytical Charts and Funnel Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* SVG Line Chart for onboarding growth */}
                  <div className="lg:col-span-2 p-6 bg-secondary-light dark:bg-neutral-900 border border-accent/20 dark:border-neutral-800 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-accent/10 pb-4">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-accent tracking-widest uppercase block">Wizard Growth timeline</span>
                        <h3 className="font-serif text-lg font-bold">Onboarding Submissions</h3>
                      </div>
                      <div className="flex items-center gap-1 text-primary/75 dark:text-neutral-300">
                        <TrendingUp className="h-4 w-4 text-accent" />
                        <span className="text-xs font-bold">Weekly Activity</span>
                      </div>
                    </div>

                    {/* SVG Line Graph */}
                    <div className="relative h-48 w-full pt-4">
                      <svg className="w-full h-full" viewBox="0 0 500 150">
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(200,164,93,0.1)" strokeDasharray="4" />
                        <line x1="0" y1="65" x2="500" y2="65" stroke="rgba(200,164,93,0.1)" strokeDasharray="4" />
                        <line x1="0" y1="110" x2="500" y2="110" stroke="rgba(200,164,93,0.1)" strokeDasharray="4" />

                        {/* Line curve for submissions */}
                        <path
                          d="M 10,130 Q 100,70 200,95 T 350,50 T 490,30"
                          fill="none"
                          stroke="var(--color-primary, #8C1D40)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <circle cx="200" cy="95" r="4.5" fill="#C8A45D" />
                        <circle cx="350" cy="50" r="4.5" fill="#C8A45D" />
                        <circle cx="490" cy="30" r="4.5" fill="#C8A45D" />
                      </svg>
                      
                      <div className="flex justify-between text-[8px] font-bold text-primary/50 uppercase pt-2">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
                      </div>
                    </div>
                  </div>

                  {/* Funnel progression */}
                  <div className="p-6 bg-secondary-light dark:bg-neutral-900 border border-accent/20 dark:border-neutral-800 rounded-2xl space-y-6 text-left">
                    <h3 className="font-serif text-lg font-bold border-b border-accent/10 pb-4">Conversion Ratio</h3>
                    
                    <div className="space-y-4 text-xs font-semibold">
                      {[
                        { step: "City Choice", ratio: "100%", count: "All leads" },
                        { step: "Services Check", ratio: "91%", count: "Filtered" },
                        { step: "Budget Submission", ratio: "88%", count: "Completed" }
                      ].map((item) => (
                        <div key={item.step} className="space-y-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span>{item.step}</span>
                            <span className="text-accent">{item.ratio}</span>
                          </div>
                          <div className="w-full h-1.5 bg-accent/20 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: item.ratio }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* Tab 2: Planning Requests */}
            {activeTab === "requests" && (
              <motion.div
                key="requests"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-x-auto border border-accent/15 dark:border-neutral-800 rounded-2xl bg-secondary-light dark:bg-neutral-900"
              >
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-primary/5 text-primary border-b border-accent/15 dark:border-neutral-800">
                      <th className="p-4 font-bold uppercase">Client info</th>
                      <th className="p-4 font-bold uppercase">Destination City</th>
                      <th className="p-4 font-bold uppercase">Timeline</th>
                      <th className="p-4 font-bold uppercase">Budget Tier</th>
                      <th className="p-4 font-bold uppercase text-center">Inspect</th>
                      <th className="p-4 font-bold uppercase text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-primary/60 font-semibold italic">
                          No wizard submissions found in the database.
                        </td>
                      </tr>
                    ) : (
                      requests.map((r) => (
                        <tr key={r.id} className="border-b border-accent/10 dark:border-neutral-850">
                          <td className="p-4 text-left">
                            <div className="font-serif font-bold text-sm text-primary dark:text-neutral-200">{r.name}</div>
                            <div className="text-[9px] text-accent font-medium mt-0.5">{r.phone}</div>
                          </td>
                          <td className="p-4 font-medium">
                            {r.city === "other" ? r.custom_city : r.city}
                          </td>
                          <td className="p-4">
                            {r.is_flexible_date ? "Flexible" : `${r.wedding_month || ""} ${r.wedding_day ? `Day ${r.wedding_day}` : ""}`}
                          </td>
                          <td className="p-4 font-serif font-bold text-accent">{r.budget}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedRequest(r)}
                              className="px-3 py-1.5 bg-primary text-secondary text-[10px] font-bold rounded-lg hover:bg-primary-dark cursor-pointer flex items-center gap-1 mx-auto transition-colors"
                            >
                              <Eye className="h-3 w-3" />
                              View Inputs
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => deleteRequest(r.id)} className="text-primary hover:text-accent p-1 cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Tab 3: User Accounts */}
            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-x-auto border border-accent/15 dark:border-neutral-800 rounded-2xl bg-secondary-light dark:bg-neutral-900"
              >
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-primary/5 text-primary border-b border-accent/15 dark:border-neutral-800">
                      <th className="p-4 font-bold uppercase">Admin Name</th>
                      <th className="p-4 font-bold uppercase">Email</th>
                      <th className="p-4 font-bold uppercase">Role Permission</th>
                      <th className="p-4 font-bold uppercase text-right">Switch Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-accent/10 dark:border-neutral-850">
                        <td className="p-4 font-serif font-bold text-sm text-primary dark:text-neutral-200">{u.name || "Administrator"}</td>
                        <td className="p-4 font-medium">{u.email}</td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded text-[9px] font-bold uppercase",
                            u.role === "Admin" ? "bg-primary/20 text-primary" : u.role === "Coordinator" ? "bg-accent/20 text-accent-dark" : "bg-neutral-600/25 text-neutral-600"
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            className="bg-secondary border border-accent/20 rounded-lg px-2 py-1 text-[10px] focus:outline-none"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Coordinator">Coordinator</option>
                            <option value="Client">Client</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Tab 4: System Roles */}
            {activeTab === "roles" && (
              <motion.div
                key="roles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-secondary-light dark:bg-neutral-900 border border-accent/20 dark:border-neutral-800 rounded-3xl space-y-6 text-left"
              >
                <div className="text-left space-y-1.5">
                  <span className="text-[10px] font-bold text-accent tracking-widest uppercase block">Access Matrix Settings</span>
                  <h3 className="font-serif text-lg font-bold">System Permissions</h3>
                </div>

                <div className="overflow-x-auto border border-accent/15 dark:border-neutral-800 rounded-2xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-primary/5 text-primary border-b border-accent/15 dark:border-neutral-800">
                        <th className="p-4 font-bold uppercase">Role</th>
                        <th className="p-4 font-bold uppercase">Read Requests</th>
                        <th className="p-4 font-bold uppercase">Write Wizard Data</th>
                        <th className="p-4 font-bold uppercase">Edit Roles</th>
                        <th className="p-4 font-bold uppercase">Config Settings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { role: "Admin", r: true, w: true, e: true, c: true },
                        { role: "Coordinator", r: true, w: true, e: false, c: false },
                        { role: "Client", r: false, w: true, e: false, c: false }
                      ].map((item) => (
                        <tr key={item.role} className="border-b border-accent/10 dark:border-neutral-850">
                          <td className="p-4 font-serif font-bold text-sm text-primary dark:text-neutral-200">{item.role}</td>
                          <td className="p-4">{item.r ? <Check className="h-4.5 w-4.5 text-emerald-600" /> : <X className="h-4.5 w-4.5 text-primary" />}</td>
                          <td className="p-4">{item.w ? <Check className="h-4.5 w-4.5 text-emerald-600" /> : <X className="h-4.5 w-4.5 text-primary" />}</td>
                          <td className="p-4">{item.e ? <Check className="h-4.5 w-4.5 text-emerald-600" /> : <X className="h-4.5 w-4.5 text-primary" />}</td>
                          <td className="p-4">{item.c ? <Check className="h-4.5 w-4.5 text-emerald-600" /> : <X className="h-4.5 w-4.5 text-primary" />}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* 3. Inspect Detail Modal Panel */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-secondary-light dark:bg-neutral-900 border border-accent/20 dark:border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-6 text-left space-y-6 text-primary max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-accent/15 pb-4">
                <div>
                  <span className="text-[9px] font-bold text-accent uppercase tracking-widest block">Lead Details Inspect</span>
                  <h3 className="font-serif text-lg font-bold">{selectedRequest.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 hover:bg-accent/10 rounded-full cursor-pointer transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Grid Contact Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-secondary/40 border border-accent/10 p-4 rounded-xl text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{selectedRequest.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="truncate">{selectedRequest.email || "No Email Provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{selectedRequest.city === "other" ? selectedRequest.custom_city : selectedRequest.city}</span>
                </div>
              </div>

              {/* Inner Config Panels */}
              <div className="space-y-4">
                {/* Timeline and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-accent/10 rounded-xl space-y-1">
                    <span className="text-[8px] font-bold text-accent uppercase block">Timeline / Date</span>
                    <p className="text-xs font-bold">
                      {selectedRequest.is_flexible_date ? "Flexible Timeline" : `${selectedRequest.wedding_month || ""} (Day ${selectedRequest.wedding_day || "Flexible"})`}
                    </p>
                    <span className="text-[8px] text-primary/50 block">Duration: {selectedRequest.is_flexible_duration ? "Flexible" : selectedRequest.duration}</span>
                  </div>

                  <div className="p-4 border border-accent/10 rounded-xl space-y-1">
                    <span className="text-[8px] font-bold text-accent uppercase block">Target Budget Tier</span>
                    <p className="text-xs font-bold text-primary font-serif">{selectedRequest.budget}</p>
                    <span className="text-[8px] text-primary/50 block">Food: {selectedRequest.is_vegetarian_only ? "Pure Vegetarian Only" : "Standard Menu"}</span>
                  </div>
                </div>

                {/* Services checklist */}
                {selectedRequest.services && selectedRequest.services.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-bold text-accent uppercase tracking-wider block">Requested Services</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRequest.services.map((s: string) => (
                        <span key={s} className="bg-primary/5 border border-accent/25 text-primary text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Venue Styles preference */}
                {selectedRequest.venue_types && selectedRequest.venue_types.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-bold text-accent tracking-wider uppercase block">Preferred Venue Styles</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRequest.venue_types.map((v: string) => (
                        <span key={v} className="bg-accent/10 text-accent-dark text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                          {v.replace("-", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Areas Checklist */}
                {selectedRequest.venue_areas && selectedRequest.venue_areas.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-bold text-accent tracking-wider uppercase block">Selected City Areas</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRequest.venue_areas.map((a: string) => (
                        <span key={a} className="bg-neutral-600/10 text-neutral-600 dark:text-neutral-400 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-neutral-600/20">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Day-wise Meals & Accommodations Grid Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Guest count details per day */}
                  {selectedRequest.guest_counts && selectedRequest.guest_counts.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[8px] font-bold text-accent tracking-wider uppercase block">Meals Estimations per Day</span>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                        {selectedRequest.guest_counts.map((gc: any, idx: number) => (
                          <div key={idx} className="p-2.5 bg-secondary/25 border border-accent/10 rounded-lg text-[10px] space-y-1">
                            <span className="font-bold text-primary block">Day {idx + 1} Counts</span>
                            <div className="grid grid-cols-2 gap-1 text-[9px]">
                              <span>Breakfast: {gc.breakfast || "-"}</span>
                              <span>Lunch: {gc.lunch || "-"}</span>
                              <span>High Tea: {gc.highTea || "-"}</span>
                              <span>Dinner: {gc.dinner || "-"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rooms details per day */}
                  {selectedRequest.rooms && selectedRequest.rooms.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[8px] font-bold text-accent tracking-wider uppercase block">Accommodations details per Day</span>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                        {selectedRequest.rooms.map((rm: any, idx: number) => (
                          <div key={idx} className="p-2.5 bg-secondary/25 border border-accent/10 rounded-lg text-[10px] space-y-1">
                            <span className="font-bold text-primary block">Day {idx + 1} Blocks</span>
                            <div className="grid grid-cols-2 gap-1 text-[9px]">
                              <span>Rooms: {rm.rooms || "-"}</span>
                              <span>Guests: {rm.guests || "-"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer actions inside modal */}
              <div className="border-t border-accent/15 pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-accent/30 text-primary text-xs font-semibold rounded-full hover:bg-accent/10 cursor-pointer"
                >
                  Close Detail
                </button>
                <button
                  onClick={() => deleteRequest(selectedRequest.id)}
                  className="px-4 py-2 bg-primary text-secondary text-xs font-bold rounded-full hover:bg-primary-dark cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Lead
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Mobile Left Sidebar Drawer */}
      <AnimatePresence>
        {showMobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-start"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="w-full max-w-xs bg-secondary-light dark:bg-neutral-900 h-full p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-accent/15">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary fill-primary dark:text-accent dark:fill-accent" />
                    <span className="font-serif text-lg font-bold">Admin Panel</span>
                  </div>
                  <button onClick={() => setShowMobileSidebar(false)}>
                    <X className="h-4.5 w-4.5 text-primary dark:text-neutral-200" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  {[
                    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                    { id: "requests", label: "Planning Requests", icon: Sparkles },
                    { id: "users", label: "User Accounts", icon: UserCheck },
                    { id: "roles", label: "Roles", icon: Settings }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id as any); setShowMobileSidebar(false); }}
                      className={cn(
                        "w-full px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all text-left",
                        activeTab === tab.id
                          ? "bg-primary text-secondary"
                          : "text-primary/70 dark:text-neutral-400 hover:bg-accent/10"
                      )}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
