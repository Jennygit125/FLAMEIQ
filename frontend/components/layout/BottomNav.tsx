import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Wallet,
  Settings,
  Package,
  ClipboardList,
} from "lucide-react";
import type { Portal } from "@/types/portal";

type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
};

const NAV_ITEMS: Record<Portal, NavItem[]> = {
  customer: [
    { path: "dashboard", label: "Home", icon: LayoutDashboard },
    { path: "orders", label: "Order Gas", icon: ShoppingCart },
    { path: "track-delivery", label: "Track", icon: Truck },
    { path: "wallet", label: "Wallet", icon: Wallet },
    { path: "settings", label: "Settings", icon: Settings },
  ],
  vendor: [
    { path: "dashboard", label: "Home", icon: LayoutDashboard },
    { path: "inventory", label: "Stock", icon: Package },
    { path: "orders", label: "Orders", icon: ClipboardList },
    { path: "settings", label: "Settings", icon: Settings },
  ],
};

// Shown only on small screens — the primary nav once this runs inside Capacitor.
export default function BottomNav({ portal }: { portal: Portal }) {
  const items = NAV_ITEMS[portal];
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-border bg-card py-2 md:hidden">
      {items.map(({ path, label, icon: Icon }) => {
        const isActive = pathname?.includes(`/${portal}/${path}`);
        return (
          <Link
            key={path}
            href={`/${portal}/${path}`}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-1.5 transition-all ${
              isActive 
                ? "text-white bg-[#1e40af] shadow-md shadow-blue-500/30" 
                : "text-ink-500"
            }`}
          >
            <Icon size={20} className={isActive ? "text-white" : "text-muted-500"} />
            <span className={`text-[10px] font-medium ${isActive ? "text-white" : ""}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}