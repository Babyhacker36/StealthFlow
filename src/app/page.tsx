
"use client"

import { DashboardSidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Send, 
  MessageSquare, 
  BarChart3, 
  ArrowUpRight, 
  Zap,
  MousePointer2
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

const stats = [
  { name: "Total Leads", value: "2,543", icon: Users, change: "+12%", trend: "up" },
  { name: "Sent Messages", value: "842", icon: Send, change: "+18%", trend: "up" },
  { name: "Replies Received", value: "124", icon: MessageSquare, change: "+5%", trend: "up" },
  { name: "Reply Rate", value: "14.7%", icon: BarChart3, change: "+2%", trend: "up" },
]

const activityData = [
  { time: "08:00", active: 12, mimicry: 85 },
  { time: "10:00", active: 45, mimicry: 92 },
  { time: "12:00", active: 38, mimicry: 88 },
  { time: "14:00", active: 65, mimicry: 95 },
  { time: "16:00", active: 52, mimicry: 91 },
  { time: "18:00", active: 20, mimicry: 82 },
]

export default function Dashboard() {
  return (
    <DashboardSidebar>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Welcome back, Commander</h1>
          <p className="text-muted-foreground mt-1 text-lg">Your stealth engine is currently optimizing outreach variations.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-none shadow-sm overflow-hidden group hover:ring-1 hover:ring-secondary transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">{stat.value}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Engine Activity</CardTitle>
              <CardDescription>Human-mimicry performance (Gaussian Jitter Consistency)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMimicry" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="active" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} />
                    <Area type="monotone" dataKey="mimicry" stroke="hsl(var(--secondary))" fillOpacity={1} fill="url(#colorMimicry)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Live Browser Nodes</CardTitle>
              <CardDescription>Playwright initialization status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Worker Node Alpha", status: "Running", progress: 85, color: "bg-green-500" },
                { label: "Worker Node Beta", status: "Idle", progress: 100, color: "bg-primary" },
                { label: "Worker Node Gamma", status: "Human Mimicry Phase", progress: 42, color: "bg-secondary" },
              ].map((node) => (
                <div key={node.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${node.color}`} />
                      <span className="font-medium">{node.label}</span>
                    </div>
                    <span className="text-muted-foreground">{node.status}</span>
                  </div>
                  <Progress value={node.progress} className="h-2" />
                </div>
              ))}
              
              <div className="pt-4 mt-4 border-t border-dashed">
                <div className="bg-primary/5 rounded-xl p-4 flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MousePointer2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Action Jitter: Gaussian Active</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current mean delay: 4.5s. Standard deviation: 1.2s. Browser behavior is indistinguishable from human input.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardSidebar>
  )
}
