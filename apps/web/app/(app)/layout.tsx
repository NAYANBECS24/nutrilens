export const dynamic = "force-dynamic";

import BottomNav from "@/components/bottom-nav";
import { AuthGuard } from "@/components/auth-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-[#f5f7f1] text-slate-950">
        <main id="main-content" className="flex-1 pb-20">
          {children}
        </main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
