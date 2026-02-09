'use client';
/**
 * @fileOverview Leads Database Service
 * Manages Firestore operations for Companies and Leads.
 */

import { 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export class LeadsDB {
  constructor(private db: Firestore) {}

  /**
   * Adds or updates a company in the database.
   */
  async upsertCompany(companyData: { id: string; name: string; domain: string; industry?: string }) {
    const companyRef = doc(this.db, 'companies', companyData.id);
    
    setDoc(companyRef, companyData, { merge: true })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: companyRef.path,
          operation: 'write',
          requestResourceData: companyData,
        }));
      });
  }

  /**
   * Adds a new lead associated with a company.
   */
  async addLead(companyId: string, leadData: { 
    id: string; 
    firstName: string; 
    lastName: string; 
    email: string; 
    status: string 
  }) {
    const leadRef = doc(this.db, 'companies', companyId, 'leads', leadData.id);
    const data = { ...leadData, companyId };

    setDoc(leadRef, data)
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: leadRef.path,
          operation: 'create',
          requestResourceData: data,
        }));
      });
  }

  /**
   * Retrieves all leads for a specific company.
   */
  async getLeadsByCompany(companyId: string) {
    const leadsRef = collection(this.db, 'companies', companyId, 'leads');
    try {
      const snapshot = await getDocs(leadsRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: leadsRef.path,
        operation: 'list',
      }));
      return [];
    }
  }

  /**
   * Updates lead status.
   */
  async updateLeadStatus(companyId: string, leadId: string, status: string) {
    const leadRef = doc(this.db, 'companies', companyId, 'leads', leadId);
    
    updateDoc(leadRef, { status })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: leadRef.path,
          operation: 'update',
          requestResourceData: { status },
        }));
      });
  }
}
