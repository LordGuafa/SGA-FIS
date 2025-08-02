'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { SIDEBAR_NAV_ITEMS } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

interface DashboardSidebarProps {
  className?: string;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavItems = SIDEBAR_NAV_ITEMS.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Navegación
        </h2>
        <div className="space-y-1">
          {filteredNavItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Button
                key={index}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-blue-100 text-blue-700 hover:bg-blue-200"
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <SidebarContent />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-lg font-semibold">Menú</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
