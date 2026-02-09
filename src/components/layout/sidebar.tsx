
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  Settings, 
  Zap, 
  Monitor,
  Database
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Target,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Users,
  },
  {
    title: "Browser Core",
    url: "/browser",
    icon: Monitor,
  },
  {
    title: "Lead Database",
    url: "/database",
    icon: Database,
  },
  {
    title: "Engine Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-16 flex items-center px-4">
          <div className="flex items-center gap-2 font-headline font-bold text-xl text-primary">
            <Zap className="h-6 w-6 text-secondary fill-secondary" />
            <span className="group-data-[collapsible=icon]:hidden">StealthFlow</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4 group-data-[collapsible=icon]:hidden">
            <div className="bg-secondary/10 rounded-lg p-3 text-xs">
              <p className="font-semibold text-primary">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-muted-foreground">Browser Engine Active</span>
              </div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/50 backdrop-blur px-4 sticky top-0 z-10">
          <SidebarTrigger />
          <div className="flex-1" />
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold">Admin User</span>
                <span className="text-xs text-muted-foreground">stealth_operator_01</span>
             </div>
             <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-headline">
                AO
             </div>
          </div>
        </header>
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
