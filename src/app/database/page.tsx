
"use client"

import { DashboardSidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  Database, 
  Search, 
  Download, 
  Upload, 
  Building2,
  Globe,
  Tag
} from "lucide-react"

const companies = [
  { name: "TechFlow Systems", domain: "techflow.io", industry: "SaaS", leads: 42, lastScrape: "2h ago" },
  { name: "Nexus AI", domain: "nexus-ai.com", industry: "Artificial Intelligence", leads: 156, lastScrape: "1d ago" },
  { name: "CyberShield", domain: "cybershield.security", industry: "Cybersecurity", leads: 89, lastScrape: "5h ago" },
  { name: "GreenLogistics", domain: "greenlog.com", industry: "Supply Chain", leads: 24, lastScrape: "3d ago" },
  { name: "HealthDirect", domain: "h-direct.net", industry: "HealthTech", leads: 67, lastScrape: "12h ago" },
]

export default function LeadDatabasePage() {
  return (
    <DashboardSidebar>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Corporate Intelligence</h1>
            <p className="text-muted-foreground">Centralized repository for target accounts and firmographic data.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" /> Import CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export All
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-bold uppercase">Total Accounts</CardTitle>
              <CardTitle className="text-2xl font-headline">1,482</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-bold uppercase">Avg. Leads/Account</CardTitle>
              <CardTitle className="text-2xl font-headline">8.4</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-bold uppercase">Database Health</CardTitle>
              <CardTitle className="text-2xl font-headline text-green-500">94%</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] font-bold uppercase">Enrichment Coverage</CardTitle>
              <CardTitle className="text-2xl font-headline text-secondary">78%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Filter by company name or domain..." className="pl-9" />
              </div>
              <Button className="bg-primary gap-2">
                <Building2 className="h-4 w-4" /> Add Company
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-xs uppercase">Company</TableHead>
                  <TableHead className="font-bold text-xs uppercase">Domain</TableHead>
                  <TableHead className="font-bold text-xs uppercase">Industry</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-center">Leads</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company, i) => (
                  <TableRow key={i} className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <TableCell className="font-semibold flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      {company.name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                       <span className="flex items-center gap-1">
                         <Globe className="h-3 w-3" /> {company.domain}
                       </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs flex items-center gap-1">
                        <Tag className="h-3 w-3 text-secondary" /> {company.industry}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-bold">{company.leads}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-xs font-bold text-secondary">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardSidebar>
  )
}
