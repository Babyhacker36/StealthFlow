
"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { DashboardSidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Zap, 
  Terminal, 
  Activity, 
  Users, 
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Play,
  Square
} from "lucide-react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit, collectionGroup } from "firebase/firestore"
import { CampaignWorker } from "@/lib/engine/worker"

export default function AutomationDashboard() {
  const db = useFirestore()
  const [engineActive, setEngineActive] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Memoized queries for real-time data
  const logsQuery = useMemoFirebase(() => {
    return query(collection(db, "logs"), orderBy("timestamp", "desc"), limit(50))
  }, [db])

  const leadsQuery = useMemoFirebase(() => {
    // Collection group query to get all leads across all companies
    return query(collectionGroup(db, "leads"), limit(12))
  }, [db])

  const { data: logs } = useCollection(logsQuery)
  const { data: leads } = useCollection(leadsQuery)

  // Sync scroll for the console
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [logs])

  const toggleEngine = () => {
    const worker = CampaignWorker.getInstance(db)
    if (engineActive) {
      worker.stop()
      setEngineActive(false)
    } else {
      worker.start()
      setEngineActive(true)
    }
  }

  return (
    <DashboardSidebar>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-border/50">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${engineActive ? 'bg-secondary/20 animate-pulse' : 'bg-muted'}`}>
              <Zap className={`h-8 w-8 ${engineActive ? 'text-secondary fill-secondary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Automation Command Center</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                {engineActive ? (
                  <span className="flex items-center gap-1.5 text-secondary font-medium">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    Engine Active: Human Mimicry Gaussian Mode
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                    Engine Standby
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 px-6 py-3 bg-muted/30 rounded-2xl border border-border/50">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className={`h-4 w-4 ${engineActive ? 'text-green-500' : 'text-muted-foreground'}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Health</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full ${engineActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-muted-foreground/30'}`} />
                ))}
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-4">
              <Label htmlFor="engine-switch" className="text-sm font-bold uppercase tracking-wider text-primary">Master Switch</Label>
              <Switch 
                id="engine-switch" 
                checked={engineActive} 
                onCheckedChange={toggleEngine}
                className="data-[state=checked]:bg-secondary"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {leads?.map((lead) => (
                <Card key={lead.id} className="border-none shadow-sm hover:ring-1 hover:ring-secondary/30 transition-all bg-white overflow-hidden group">
                  <div className={`h-1 w-full ${
                    lead.status === 'Contacted' ? 'bg-green-500' : 
                    lead.status === 'New' ? 'bg-secondary' : 'bg-muted'
                  }`} />
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                      {lead.firstName[0]}{lead.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-primary truncate leading-tight">{lead.firstName} {lead.lastName}</h4>
                      <p className="text-xs text-muted-foreground truncate">{lead.jobTitle}</p>
                    </div>
                    <Badge variant={
                      lead.status === 'Contacted' ? 'default' : 
                      lead.status === 'New' ? 'secondary' : 'outline'
                    } className="text-[10px] uppercase font-bold px-2 py-0">
                      {lead.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
              {!leads?.length && [1,2,3,4].map(i => (
                <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-xl" />
              ))}
            </div>

            <Card className="border-none shadow-sm bg-[#0a0c10] text-green-400 overflow-hidden">
              <CardHeader className="border-b border-green-900/30 py-3 bg-[#11141b]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest">Real-time Activity Console</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-red-500/50" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
                    <div className="h-2 w-2 rounded-full bg-green-500/50" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px] w-full p-4 font-mono text-sm" ref={scrollRef}>
                  <div className="space-y-1.5">
                    {logs?.map((log) => (
                      <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-muted-foreground/50 shrink-0">
                          {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : '...'}
                        </span>
                        <span className={`
                          ${log.type === 'success' ? 'text-green-400' : ''}
                          ${log.type === 'error' ? 'text-red-400 font-bold' : ''}
                          ${log.type === 'warning' ? 'text-yellow-400' : ''}
                          ${log.type === 'jitter' ? 'text-blue-400 italic' : ''}
                          ${log.type === 'info' ? 'text-gray-300' : ''}
                        `}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                    {!logs?.length && <div className="text-muted-foreground italic">Waiting for engine activity...</div>}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-primary text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-80">
                    <span>Target Saturation</span>
                    <span>{engineActive ? '84%' : '0%'}</span>
                  </div>
                  <Progress value={engineActive ? 84 : 0} className="h-1.5 bg-white/20" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-80">
                    <span>Jitter Efficiency</span>
                    <span>{engineActive ? '99.2%' : '0%'}</span>
                  </div>
                  <Progress value={engineActive ? 99 : 0} className="h-1.5 bg-white/20" />
                </div>
                <div className="pt-2">
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase">Estimated Completion</span>
                    </div>
                    <p className="text-lg font-headline">2h 45m</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-headline">Safety Protocols</CardTitle>
                <CardDescription>Engine-level defense mechanisms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Browser Fingerprinting", status: "Protected", icon: ShieldCheck, color: "text-green-500" },
                  { name: "Gaussian Jitter", status: engineActive ? "Active" : "Standby", icon: Activity, color: engineActive ? "text-secondary" : "text-muted-foreground" },
                  { name: "Proxy Rotation", status: "Enabled", icon: CheckCircle2, color: "text-green-500" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="text-sm font-semibold">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-tighter opacity-70">{item.status}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardSidebar>
  )
}
