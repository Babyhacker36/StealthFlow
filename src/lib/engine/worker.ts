'use client';

import { 
  Firestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  doc,        
  addDoc,
  updateDoc,  // <--- Added this here
  serverTimestamp
} from 'firebase/firestore';
import { StealthBrowser } from './browser';
import { LeadsDB } from './database';
import { getHumanDelay, isBusinessHours } from './jitter';

export class CampaignWorker {
  private static instance: CampaignWorker;
  private isRunning: boolean = false;
  private browser: StealthBrowser;
  private leadsDB: LeadsDB;
  private firestore: Firestore;

  private constructor(firestore: Firestore) {
    this.firestore = firestore;
    // headless: false makes the browser visible for your video!
    this.browser = new StealthBrowser({ headless: false });
    this.leadsDB = new LeadsDB(firestore);
  }

  public static getInstance(firestore: Firestore): CampaignWorker {
    if (!CampaignWorker.instance) {
      CampaignWorker.instance = new CampaignWorker(firestore);
    }
    return CampaignWorker.instance;
  }

  private async log(message: string, type: 'info' | 'success' | 'warning' | 'error' | 'jitter' = 'info') {
    console.log(`[CampaignWorker] ${message}`);
    const logsRef = collection(this.firestore, 'logs');
    // Awaiting the log ensure they appear in the right order on your dashboard
    await addDoc(logsRef, {
      message,
      type,
      timestamp: serverTimestamp(),
    });
  }

  public async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    await this.log('Starting StealthFlow Engine...', 'success');
    
    try {
      await this.browser.initialize();
      this.processLoop();
    } catch (error: any) {
      await this.log(`Critical Engine Failure: ${error.message}`, 'error');
      this.isRunning = false;
    }
  }

  public stop(): void {
    this.log('Signal received: Shutting down engine...', 'warning');
    this.isRunning = false;
  }

  private async processLoop(): Promise<void> {
    while (this.isRunning) {
      await this.log('Scanning for "New" leads...', 'info');

      const leadsRef = collection(this.firestore, 'leads');
      const q = query(leadsRef, where('status', '==', 'New'));
      const leadsSnap = await getDocs(q);

      let processedCount = 0;

      for (const leadDoc of leadsSnap.docs) {
        if (!this.isRunning) break;
        const lead = { id: leadDoc.id, ...leadDoc.data() } as any;
        
        await this.log(`Targeting Lead: ${lead.firstName} ${lead.lastName}`, 'info');
        
        const targetUrl = lead.linkedinUrl || 'https://www.google.com/search?q=' + lead.firstName + '+' + lead.lastName;
        await this.browser.navigateTo(targetUrl);
        
        const delay = getHumanDelay(5, 0.3);
        await this.log(`Applying ${Math.round(delay/1000)}s Gaussian Jitter...`, 'jitter');
        await new Promise(r => setTimeout(r, delay));

        // UPDATED STEP 4: No more duplicate 'doc' error!
        await updateDoc(doc(this.firestore, 'leads', lead.id), {
          status: 'Contacted'
        });

        await this.log(`Success: Outreach completed for ${lead.firstName}`, 'success');
        processedCount++;
        
        const coolingPeriod = getHumanDelay(15, 0.2);
        await this.log(`Cooling down: ${Math.round(coolingPeriod/1000)}s`, 'jitter');
        await new Promise(r => setTimeout(r, coolingPeriod));
      }

      if (processedCount === 0) {
        await this.log('Queue empty. Standing by...', 'info');
        await new Promise(r => setTimeout(r, 10000)); 
      }
    }
    await this.log('Engine Offline.', 'warning');
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}