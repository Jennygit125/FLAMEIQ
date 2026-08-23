"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Sparkles, 
  Wallet, 
  Bot, 
  LineChart, 
  Settings, 
  LogOut,
  Bell,
  ArrowRight
} from "lucide-react";
import Image from "next/image";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { path: "/vendor/dashboard", label: "Dashboard", icon: Home },
    { path: "/vendor/orders", label: "Refill Orders", icon: Sparkles },
    { path: "/vendor/payments", label: "Payments", icon: Wallet },
    { path: "/vendor/ai-assistant", label: "AI Assistant", icon: Bot },
    { path: "/vendor/analytics", label: "Analytics", icon: LineChart },
    { path: "/vendor/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f9fafb] font-sans text-slate-900 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-transparent shrink-0 mt-2">
          <Image src="/images/logo.png" alt="FlameIntel" width={140} height={32} className="h-7 w-auto object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive 
                    ? "bg-[#1e40af] text-white" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                {item.label}
                {isActive && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-yellow-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Promo Card */}
        <div className="px-4 pb-6">
          <div className="bg-[#1e40af] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            <h3 className="font-bold text-lg leading-tight mb-2">Never run out of cooking gas again.</h3>
            <p className="text-xs text-blue-100 mb-4 opacity-90">Let <span className="font-bold text-yellow-400">FlameIntel</span> predict, remind and deliver- so you can focus on what matters.</p>
            <button className="bg-white text-blue-900 text-xs font-bold py-2.5 px-4 rounded-xl w-full flex items-center justify-between hover:bg-blue-50 transition-colors">
              Explore Smart Refill
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Log Out */}
        <div className="p-4 border-t border-slate-100 shrink-0">
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors">
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="text-sm font-semibold text-slate-700">
            {navItems.find(i => pathname?.startsWith(i.path))?.label || "Refill Orders"}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <Settings size={16} />
            </button>
            <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative">
              <Bell size={16} />
            </button>
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://i.pravatar.cc/150?img=11" alt="Victor" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1 cursor-pointer">
                Victor <span className="text-[10px] text-slate-400">▼</span>
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}
