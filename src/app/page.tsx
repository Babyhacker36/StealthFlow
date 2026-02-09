
"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardSidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Zap, 
  Terminal, 
  Activity, 
  Users, 
  ShieldCheck,
  Play,
  Square,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit, collectionGroup } from "firebase/firestore"
import { CampaignWorker } from "@/lib/engine/worker"

export default function AutomationDashboard() {
  const db = useFirestore()
  const [engineActive, setEngineActive] = useState(false)
  const [jitterEnabled, setJitterEnabled] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Real-time Logs Query
  const logsQuery = useMemoFirebase(() => {
    return query(collection(db, "logs"), orderBy("timestamp", "desc"), limit(100))
  }, [db])

  // Real-time Leads Query (Collection Group to see all leads)
  const leadsQuery = useMemoFirebase(() => {
    return query(collectionGroup(db, "leads"), limit(10))
  }, [db])

  const { data: logs } = useCollection(logsQuery)
  const { data: leads } = useCollection(leadsQuery)

  // Derived Stats
  const processedCount = leads?.filter(l => l.status === 'Contacted').length || 0
  const activeSessions = engineActive ? 1 : 0

  // Sync scroll for the console
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = 0
      }
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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Command Center</h1>
            <p className="text-muted-foreground">Orchestrate and monitor your stealth outreach operations.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border">
            <div className="flex items-center gap-2 px-3">
              <div className={`h-2 w-2 rounded-full ${engineActive ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {engineActive ? 'Engine Running' : 'Engine Idle'}
              </span>
            </div>
            <Button 
              size="sm" 
              onClick={toggleEngine}
              variant={engineActive ? "destructive" : "default"}
              className="gap-2 font-bold px-6"
            >
              {engineActive ? (
                <><Square className="h-4 w-4 fill-current" /> Stop Campaign</>
              ) : (
                <><Play className="h-4 w-4 fill-current" /> Start Campaign</>
              )}
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Users className="h-3.5 w-3.5" /> Leads Processed
              </CardDescription>
              <CardTitle className="text-3xl font-headline">{processedCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${Math.min((processedCount / 100) * 100, 100)}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" /> Active Sessions
              </CardDescription>
              <CardTitle className="text-3xl font-headline">{activeSessions}</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="flex h-2 w-2 rounded-full bg-secondary" />
                  Primary Browser Core 01
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" /> Safety Score
              </CardDescription>
              <CardTitle className="text-3xl font-headline text-green-600">100%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Gaussian Jitter Protection Active
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real-time Activity Console */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg bg-[#0d1117] text-gray-300 overflow-hidden ring-1 ring-white/10">
              <CardHeader className="border-b border-white/5 py-3 bg-[#161b22]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">Stealth Console v2.0</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="jitter-toggle" className="text-[10px] uppercase font-bold text-gray-500">Jitter Active</Label>
                      <Switch 
                        id="jitter-toggle" 
                        checked={jitterEnabled} 
                        onCheckedChange={setJitterEnabled}
                        className="h-4 w-8 data-[state=checked]:bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] w-full p-4 font-mono text-xs leading-relaxed" ref={scrollRef}>
                  <div className="space-y-1">
                    {logs?.map((log) => (
                      <div key={log.id} className="flex gap-4 border-l-2 border-transparent hover:border-blue-500/30 pl-2 transition-colors">
                        <span className="text-gray-600 shrink-0">
                          [{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : '...'}]
                        </span>
                        <span className={`
                          ${log.type === 'success' ? 'text-green-400' : ''}
                          ${log.type === 'error' ? 'text-red-400' : ''}
                          ${log.type === 'warning' ? 'text-yellow-400' : ''}
                          ${log.type === 'jitter' ? 'text-blue-400' : ''}
                          ${log.type === 'info' ? 'text-gray-400' : ''}
                        `}>
                          <span className="text-gray-500 mr-2">➜</span>
                          {log.message}
                        </span>
                      </div>
                    ))}
                    {!logs?.length && (
                      <div className="text-gray-600 italic animate-pulse">
                        [SYSTEM] Initializing stream... Standing by for engine activity.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Leads Table */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-headline">Recent Outreach Targets</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs font-bold">View All Leads</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Name</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Last Action</TableHead>
                      <TableHead className="font-bold text-xs uppercase text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads?.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium">
                          {lead.firstName} {lead.lastName}
                          <p className="text-[10px] text-muted-foreground leading-none mt-1 uppercase font-bold tracking-tighter">{lead.jobTitle}</p>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                             <Clock className="h-3 w-3" />
                             {lead.status === 'New' ? 'Pending discovery' : 'Browser navigation completed'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`
                              font-bold uppercase text-[10px] px-2 py-0.5
                              ${lead.status === 'New' ? 'border-blue-500 text-blue-500 bg-blue-50' : ''}
                              ${lead.status === 'Contacted' ? 'border-green-500 text-green-500 bg-green-50' : ''}
                              ${lead.status === 'Flagged' ? 'border-red-500 text-red-500 bg-red-50' : ''}
                            `}
                          >
                            {lead.status === 'New' ? 'Processing' : lead.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Engine Settings */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-secondary" />
                  Protection Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Gaussian Jitter</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Normal Distribution: 4.5s σ1.2</p>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-500 border-none">ACTIVE</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Fingerprinting</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Randomized User-Agents</p>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-500 border-none">SECURE</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary text-white overflow-hidden">
               <CardHeader className="pb-0">
                  <CardTitle className="text-lg font-headline">Target Saturation</CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div className="flex justify-between text-xs font-bold opacity-80 uppercase">
                    <span>Campaign Progress</span>
                    <span>{leads ? Math.round((processedCount / leads.length) * 100) : 0}%</span>
                  </div>
                  <Progress value={leads ? (processedCount / leads.length) * 100 : 0} className="h-2 bg-white/20" />
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10 mt-4">
                     <p className="text-[10px] font-bold uppercase opacity-60 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> System Advisory
                     </p>
                     <p className="text-xs mt-1 italic">Maintain current jitter intensity to avoid rate limiting on LinkedIn domains.</p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardSidebar>
  )
}
