
"use client"

import { DashboardSidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Zap, 
  Clock, 
  ShieldCheck, 
  Monitor,
  Database
} from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardSidebar>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">Engine Settings</h1>
          <p className="text-muted-foreground">Configure the core parameters of StealthFlow.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Clock className="h-5 w-5 text-secondary" />
                Gaussian Jitter (logic/jitter.py)
              </CardTitle>
              <CardDescription>Configure human-mimicry timing distributions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mimicry-mode" className="text-base font-semibold">Enable Human-Mimicry</Label>
                  <Switch id="mimicry-mode" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground italic">
                  When enabled, action intervals will be pulled from a normal distribution curve to avoid bot detection.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="font-semibold">Mean Delay (seconds)</Label>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">4.5s</span>
                </div>
                <Slider defaultValue={[45]} max={100} step={1} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="font-semibold">Standard Deviation (σ)</Label>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">1.2s</span>
                </div>
                <Slider defaultValue={[20]} max={50} step={1} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Monitor className="h-5 w-5 text-secondary" />
                Browser Initialization (core/browser.py)
              </CardTitle>
              <CardDescription>Playwright engine and proxy configuration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="browser-type">Browser Engine</Label>
                <Input id="browser-type" value="Chromium (Headless: False)" disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-agent">User Agent Masking</Label>
                <Input id="user-agent" value="Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..." />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Anti-Fingerprinting</Label>
                  <p className="text-xs text-muted-foreground">Hide Playwright execution indicators.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Random Mouse Jiggle</Label>
                  <p className="text-xs text-muted-foreground">Simulate micro-movements during waits.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Database className="h-5 w-5 text-secondary" />
                Database Configuration (data/database.py)
              </CardTitle>
              <CardDescription>Local SQLite storage settings for lead persistence.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Database Path</Label>
                  <Input value="./data/leads_production.db" readOnly />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto-Backup Daily</Label>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex flex-col justify-end gap-2">
                <Button variant="outline" className="w-full">Export Database as CSV</Button>
                <Button className="w-full bg-primary text-white">Save All Settings</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardSidebar>
  )
}
