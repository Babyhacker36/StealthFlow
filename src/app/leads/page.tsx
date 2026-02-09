
"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Sparkles,
  ExternalLink,
  MessageSquare
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { generatePersonalizedOutreachMessage } from "@/ai/flows/generate-personalized-outreach-message"
// Add these at the top of src/app/leads/page.tsx
import { db } from "@/firebase" // Double check if your config is in src/lib/firebase.ts instead
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
const initialLeads = [
  { id: 1, name: "Sarah Jenkins", role: "VP of Engineering", company: "TechFlow", university: "Stanford", status: "Contacted", lastActive: "2h ago" },
  { id: 2, name: "Mark Wilson", role: "CTO", company: "CyberShield", university: "MIT", status: "Engaged", lastActive: "15m ago" },
  { id: 3, name: "Emily Chen", role: "Marketing Director", company: "GrowFast", university: "UC Berkeley", status: "New", lastActive: "1d ago" },
  { id: 4, name: "David Miller", role: "Sales Lead", company: "SaasPlus", university: "Harvard", status: "Replied", lastActive: "3h ago" },
  { id: 5, name: "Jessica Lee", role: "CEO", company: "NexusAI", university: "Yale", status: "New", lastActive: "5h ago" },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState(initialLeads)
  const [selectedLead, setSelectedLead] = useState<typeof initialLeads[0] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMessages, setGeneratedMessages] = useState<string[]>([])

  const handleGenerateVariations = async (lead: typeof initialLeads[0]) => {
    setSelectedLead(lead)
    setIsGenerating(true)
    try {
      const leadInfo = `${lead.name} is the ${lead.role} at ${lead.company}. They graduated from ${lead.university}.`
      const result = await generatePersonalizedOutreachMessage({ leadInfo, numVariations: 3 })
      setGeneratedMessages(result.messages)
    } catch (error) {
      console.error("Failed to generate messages", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DashboardSidebar>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Lead Tracking</h1>
            <p className="text-muted-foreground">Manage your relationships and view interaction history.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button 
  size="sm" 
  className="bg-secondary hover:bg-secondary/90 text-white gap-2"
  onClick={async () => {
    try {
      console.log("Attempting to add lead...");
      await addDoc(collection(db, "leads"), {
        name: "Demo Prospect",
        role: "Target",
        company: "Example Corp",
        status: "pending", 
        url: "https://www.google.com",
        createdAt: serverTimestamp()
      });
      alert("Success! Lead sent to Firebase. You can now run the worker.");
    } catch (error) {
      console.error("Firebase Error:", error);
      alert("Error! Make sure your .env.local keys are correct.");
    }
  }}
>
  Add Leads
</Button>
          </div>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white/50 border-b pb-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, role, or company..." className="pl-9 bg-background border-none ring-1 ring-border" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px] font-semibold text-primary">Name</TableHead>
                  <TableHead className="font-semibold text-primary">Role</TableHead>
                  <TableHead className="font-semibold text-primary">Company</TableHead>
                  <TableHead className="font-semibold text-primary">Status</TableHead>
                  <TableHead className="font-semibold text-primary">Last Activity</TableHead>
                  <TableHead className="text-right font-semibold text-primary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {lead.name}
                      </div>
                    </TableCell>
                    <TableCell>{lead.role}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <Badge variant={lead.status === "Engaged" ? "default" : lead.status === "Replied" ? "secondary" : "outline"} className="font-normal">
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{lead.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleGenerateVariations(lead)}
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2"><ExternalLink className="h-3.5 w-3.5" /> View Profile</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2"><MessageSquare className="h-3.5 w-3.5" /> Message Log</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Archive Lead</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="h-5 w-5 text-secondary" />
              AI Outreach Variations
            </DialogTitle>
            <DialogDescription>
              Personalized messages for {selectedLead?.name} based on their professional background.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isGenerating ? (
              <div className="space-y-3">
                <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
                <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
                <div className="h-24 w-full bg-muted animate-pulse rounded-lg" />
              </div>
            ) : (
              generatedMessages.map((msg, i) => (
                <Card key={i} className="border bg-muted/30 hover:border-secondary transition-colors cursor-pointer group">
                  <CardContent className="p-4 relative">
                    <p className="text-sm leading-relaxed">{msg}</p>
                    <Button variant="secondary" size="sm" className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 bottom-4">
                      Select This
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLead(null)}>Cancel</Button>
            <Button 
              className="bg-primary"
              onClick={() => selectedLead && handleGenerateVariations(selectedLead)}
              disabled={isGenerating}
            >
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardSidebar>
  )
}
