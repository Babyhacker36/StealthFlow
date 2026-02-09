/**
 * @fileOverview Background Campaign Worker (The Engine)
 * Orchestrates the processing of leads using the StealthBrowser and Gaussian Jitter.
 * Implemented as a Singleton to ensure only one engine instance runs at a time.
 */

import { 
  Firestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  collectionGroup 
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

  /**
   * Retrieves the Singleton instance of the CampaignWorker.
   */
  public static getInstance(firestore: Firestore): CampaignWorker {
    if (!CampaignWorker.instance) {
      CampaignWorker.instance = new CampaignWorker(firestore);
    }
    return CampaignWorker.instance;
  }

  /**
   * Starts the main campaign loop.
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[StealthFlow Worker] Engine is already active.');
      return;
    }

    this.isRunning = true;
    console.log('[StealthFlow Worker] Starting StealthFlow Engine...');
    
    try {
      await this.browser.initialize();
      await this.processLoop();
    } catch (error) {
      console.error('[StealthFlow Worker] Critical Engine Failure:', error);
      this.isRunning = false;
    }
  }

  /**
   * Stops the engine safely.
   */
  public stop(): void {
    console.log('[StealthFlow Worker] Signal received: Shutting down engine...');
    this.isRunning = false;
  }

  /**
   * The main processing loop that iterates through leads.
   */
  private async processLoop(): Promise<void> {
    while (this.isRunning) {
      console.log('[StealthFlow Worker] Scanning for "New" leads in Firestore...');

      // In a real environment, we'd use collectionGroup if indexed.
      // For this prototype, we iterate through companies to find leads.
      const companiesRef = collection(this.firestore, 'companies');
      const companiesSnap = await getDocs(companiesRef);

      let leadsProcessedInBatch = 0;

      for (const companyDoc of companiesSnap.docs) {
        if (!this.isRunning) break;

        const companyData = companyDoc.data();
        const leadsRef = collection(this.firestore, 'companies', companyDoc.id, 'leads');
        const pendingQuery = query(leadsRef, where('status', '==', 'New'));
        const leadsSnap = await getDocs(pendingQuery);

        for (const leadDoc of leadsSnap.docs) {
          if (!this.isRunning) break;

          const lead = { id: leadDoc.id, ...leadDoc.data() } as any;
          await this.processLead(lead, companyData);
          leadsProcessedInBatch++;

          // Mimic human rest between leads
          const sleepTime = getHumanDelay(15, 0.4); // Mean 15s delay between leads
          console.log(`[StealthFlow Worker] Mimicking human scroll... Sleeping for ${Math.round(sleepTime / 1000)}s`);
          await new Promise(resolve => setTimeout(resolve, sleepTime));
        }
      }

      if (leadsProcessedInBatch === 0) {
        console.log('[StealthFlow Worker] No pending leads found. Sleeping for 60s before next scan...');
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
    }

    console.log('[StealthFlow Worker] Engine Offline.');
  }

  /**
   * Performs the actual stealth actions for a single lead.
   */
  private async processLead(lead: any, company: any): Promise<void> {
    console.log(`[StealthFlow Worker] Targeting Lead: ${lead.firstName} ${lead.lastName} (@${company.name})`);

    // 1. Check if we should be active (Business Hours)
    if (!isBusinessHours()) {
      console.log('[StealthFlow Worker] Outside of business hours. Pausing to maintain stealth profile...');
      // In a real app, we'd sleep until 9 AM. Here we just log and continue for the demo.
    }

    // 2. Visit lead's company domain
    console.log(`[StealthFlow Worker] Navigation Phase: Visiting ${company.domain}`);
    await this.browser.navigateTo(company.domain);

    // 3. Simulated interaction delay
    const actionJitter = getHumanDelay(5, 0.2);
    console.log(`[StealthFlow Worker] Action Jitter: Mimicking eye-tracking delay of ${Math.round(actionJitter / 1000)}s`);
    await new Promise(resolve => setTimeout(resolve, actionJitter));

    // 4. Update status to 'Contacted'
    console.log(`[StealthFlow Worker] Finalizing Action: Marking lead ${lead.id} as "Contacted"`);
    await this.leadsDB.updateLeadStatus(company.id, lead.id, 'Contacted');
  }

  /**
   * Status check for the UI.
   */
  public getStatus(): boolean {
    return this.isRunning;
  }
}
