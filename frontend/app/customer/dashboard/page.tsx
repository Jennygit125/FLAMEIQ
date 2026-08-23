//import { Search, } from "lucide-react";
import SmartRefillGauge from "@/components/dashboard/SmartRefillGauge";
import ActiveDelivery from "@/components/dashboard/ActiveDelivery";
import QuickActions from "@/components/dashboard/QuickActions";
import NearbyVendors from "@/components/dashboard/NearbyVendors";
import MonthOverview from "@/components/dashboard/MonthOverview";
import PromoBanner from "@/components/dashboard/PromoBanner";
//import { useEffect, useState } from "react";

interface User {
  name: string;
  role: string;
}

interface CustomerDashboardPageProps {
  user: User | null;
}

export default function CustomerDashboardPage({ user }: CustomerDashboardPageProps) {
  return (
    <main>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-bold text-ink-500">
            Good Morning, {user?.name || ""}
          </h1>
          <p className="text-sm text-muted-500">
            Here&apos;s what&apos;s new for you today.
          </p>
        </div>

        <div className="flex items-center gap-3">           
          <div className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-500">
              U
            </span>
            <span className="text-sm font-medium text-ink-500">{user?.name}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SmartRefillGauge />
          <ActiveDelivery />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <NearbyVendors />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthOverview />
        </div>
        <PromoBanner />
      </div>
    </main>
  );
}