
"use client"

import { DashboardSidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Target, 
  MoreVertical, 
  ArrowUpRight,
  Users,
  MessageSquare,
  BarChart3
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

const campaigns = [
  {
    id: "c1",
    name: "Q1 Enterprise Outreach",
    status: "Active",
    progress: 65,
    sent: 1204,
    replied: 84,
    conversion: "6.9%",
    color: "bg-blue-500"
  },
  {
    id: "c2",
    name: "SaaS Founders Network",
    status: "Paused",
    progress: 32,
    sent: 450,
    replied: 12,
    conversion: "2.6%",
    color: "bg-orange-500"
  },
  {
    id: "c3",
    name: "Fortune 500 CTOs",
    status: "Completed",
    progress: 100,
    sent: 2500,
    replied: 310,
    conversion: "12.4%",
    color: "bg-green-500"
  }
]

export default function CampaignsPage() {
  return (
    <DashboardSidebar>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Campaign Orchestration</h1>
            <p className="text-muted-foreground">Manage multi-channel outreach flows and performance.</p>
          </div>
          <Button className="bg-secondary hover:bg-secondary/90 text-white gap-2">
            <Plus className="h-4 w-4" /> New Campaign
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${campaign.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                    <CardTitle className="text-base font-headline">{campaign.name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs uppercase font-bold tracking-tighter">
                    Status: {campaign.status}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Settings</DropdownMenuItem>
                    <DropdownMenuItem>View Detailed Analytics</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Reach Progress</span>
                    <span>{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-1.5" />
                </div>
                
                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Sent</p>
                    <p className="text-sm font-bold">{campaign.sent}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Replied</p>
                    <p className="text-sm font-bold">{campaign.replied}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Conv.</p>
                    <p className="text-sm font-bold text-secondary">{campaign.conversion}</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full gap-2 text-xs font-bold border-muted-foreground/20">
                  Manage Sequences <ArrowUpRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Analytics Preview */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-secondary" />
              Aggregate Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {[
                 { label: "Avg. Open Rate", value: "42.5%", icon: ArrowUpRight, trend: "+5.2%" },
                 { label: "Engaged Leads", value: "842", icon: Users, trend: "+12%" },
                 { label: "Reply Rate", value: "8.1%", icon: MessageSquare, trend: "-1.2%" },
                 { label: "Efficiency Score", value: "98/100", icon: BarChart3, trend: "Stable" }
               ].map((stat, i) => (
                 <div key={i} className="p-4 rounded-xl bg-muted/30 border border-muted-foreground/10 space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{stat.label}</p>
                    <div className="flex items-end justify-between">
                       <p className="text-xl font-headline font-bold">{stat.value}</p>
                       <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : stat.trend === 'Stable' ? 'text-blue-500' : 'text-red-500'}`}>
                         {stat.trend}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardSidebar>
  )
}
