
'use client';

import { 
  Firestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  doc,
  addDoc,
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
    addDoc(logsRef, {
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

      const companiesRef = collection(this.firestore, 'companies');
      const companiesSnap = await getDocs(companiesRef);

      let processedCount = 0;

      for (const companyDoc of companiesSnap.docs) {
        if (!this.isRunning) break;
        const companyData = companyDoc.data();
        const leadsRef = collection(this.firestore, 'companies', companyDoc.id, 'leads');
        const q = query(leadsRef, where('status', '==', 'New'));
        const leadsSnap = await getDocs(q);

        for (const leadDoc of leadsSnap.docs) {
          if (!this.isRunning) break;
          const lead = { id: leadDoc.id, ...leadDoc.data() } as any;
          
          await this.log(`Targeting Lead: ${lead.firstName} ${lead.lastName} (@${companyData.name})`, 'info');
          
          await this.browser.navigateTo(companyData.domain);
          
          const delay = getHumanDelay(5, 0.3);
          await this.log(`Applying ${Math.round(delay/1000)}s Gaussian Jitter...`, 'jitter');
          await new Promise(r => setTimeout(r, delay));

          await this.leadsDB.updateLeadStatus(companyDoc.id, lead.id, 'Contacted');
          await this.log(`Success: Message logic triggered for ${lead.firstName}`, 'success');
          
          processedCount++;
          
          const batchDelay = getHumanDelay(10, 0.2);
          await this.log(`Mimicking human scroll... Rest for ${Math.round(batchDelay/1000)}s`, 'jitter');
          await new Promise(r => setTimeout(r, batchDelay));
        }
      }

      if (processedCount === 0) {
        await this.log('No pending leads found. Idling for 30s...', 'info');
        await new Promise(r => setTimeout(r, 30000));
      }
    }
    await this.log('Engine Offline.', 'warning');
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}
