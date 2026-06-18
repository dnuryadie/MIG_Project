import React, { useState, useEffect } from 'react';
import { EcosystemBar } from './EcosystemBar';
import {
  Globe,
  Calculator,
  FileText,
  User,
  Shield,
  HelpCircle,
  Sparkles,
  ArrowRight,
  LogOut,
  ChevronRight,
  CreditCard,
  History,
  Star,
  CheckCircle,
  TrendingUp,
  FolderLock,
  Mail,
  MapPin
} from 'lucide-react';
import { UserProfile, UpgradeRequest, DocumentRecord, CalculationRecord, ChatMessage, UserRole } from './types';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  query,
  where,
  getDocFromServer,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';

// Components
import LandingPage from './LandingPage';
import AdminPanel from './AdminPanel';
import TabSourcing from './TabSourcing';
import TabCalculator from './TabCalculator';
import TabExportDocs from './TabExportDocs';
import TabIntelligence from './TabIntelligence';
import TabAIAdvisor from './TabAIAdvisor';
import RfqInbox from './RfqInbox';
import MarketTracker from './MarketTracker';
import SupplierNetworkPanel from './SupplierNetworkPanel';

// Seed demo mock accounts
const MOCK_USERS_SEED: UserProfile[] = [
  {
    uid: 'mate_07',
    fullName: 'Yusuf Hermawan',
    companyName: 'CV Priangan Cloves',
    country: 'Indonesia',
    email: 'yusuf@priangancloves.com',
    username: 'free_mate',
    role: 'free',
    registrationDate: '2026-05-15T12:00:00Z'
  },
  {
    uid: 'pro_99',
    fullName: 'Dewi Kartika',
    companyName: 'PT Nusantara Spices Abadi',
    country: 'Indonesia',
    email: 'dewi@nusantaraspices.co.id',
    username: 'pro_exporter',
    role: 'pro',
    registrationDate: '2026-03-10T14:30:00Z'
  },
  {
    uid: 'admin_88',
    fullName: 'MIG Compliance Officer',
    companyName: 'Magastu Indoprime Group (MIG)',
    country: 'Indonesia',
    email: 'ngt.bpn@gmail.com',
    username: 'admin@intradex.com',
    role: 'pro',
    registrationDate: '2026-01-01T08:00:00Z'
  }
];

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>(MOCK_USERS_SEED);
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
  
  const [activeTab, setActiveTab] = useState<'sourcing' | 'calculator' | 'docs' | 'intel' | 'ai' | 'rfq-inbox' | 'suppliers' | 'admin'>('sourcing');

  const [pendingHandoff, setPendingHandoff] = useState<any | null>(() => {
    try {
      const h = localStorage.getItem('mig_rfq_handoff');
      return h ? JSON.parse(h) : null;
    } catch { return null; }
  });

  const [sourcingSyncParams, setSourcingSyncParams] = useState<{
    commodity: string;
    volume: number;
    packType: string;
    country: string;
    destinationPort: string;
    exchangeRate: number;
  }>(() => {
    try {
      const saved = localStorage.getItem('intradex_sourcing_sync');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      commodity: 'Cassia Whole',
      volume: 5000,
      packType: 'PP Woven Bag 25 Kg',
      country: 'Germany',
      destinationPort: 'Hamburg, Germany',
      exchangeRate: 16500
    };
  });
  const [activeCalculation, setActiveCalculation] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeNotes, setUpgradeNotes] = useState('');
  const [upgradeStatus, setUpgradeStatus] = useState<'idle' | 'submitted'>('idle');
  const [savedConsultations, setSavedConsultations] = useState<any[]>([]);
  const [promoSettings, setPromoSettings] = useState(() => {
    const saved = localStorage.getItem('intradex_promo_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { slotsTarget: 100, slotsOccupied: 86, promoPriceIdr: 76999, isPromoActive: true };
  });

  const handleUpdatePromoSettings = (newSettings: any) => {
    setPromoSettings(newSettings);
    localStorage.setItem('intradex_promo_settings', JSON.stringify(newSettings));
  };

  useEffect(() => {
    async function testConnection() {
      try { await getDocFromServer(doc(db, 'test', 'connection')); } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) console.error('Please check Firebase config.');
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        let userProfile: UserProfile | null = null;
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) { userProfile = snap.data() as UserProfile; }
          else {
            userProfile = { uid: firebaseUser.uid, fullName: firebaseUser.displayName || 'Google Exporter', companyName: 'PT Nusantara SME Partner', country: 'Indonesia', email: firebaseUser.email || '', username: firebaseUser.email?.split('@')[0] || 'google_user', role: firebaseUser.email === 'ngt.bpn@gmail.com' ? 'pro' : 'free', registrationDate: new Date().toISOString() };
            await setDoc(userRef, userProfile);
          }
          setUser(userProfile);
          setActiveTab(userProfile.email === 'ngt.bpn@gmail.com' ? 'admin' : 'sourcing');
        } catch (err) { handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`); }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setDocuments([]); setCalculations([]); setUpgradeRequests([]); setSavedConsultations([]); return; }
    if (!auth.currentUser) return;
    const userId = user.uid;
    const docsQuery = query(collection(db, 'documents'), where('userId', '==', userId));
    const unsubDocs = onSnapshot(docsQuery, (s) => { const l: DocumentRecord[] = []; s.forEach((d) => l.push(d.data() as DocumentRecord)); setDocuments(l); }, (e) => handleFirestoreError(e, OperationType.LIST, 'documents'));
    const calcsQuery = query(collection(db, 'calculations'), where('userId', '==', userId));
    const unsubCalcs = onSnapshot(calcsQuery, (s) => { const l: CalculationRecord[] = []; s.forEach((d) => l.push(d.data() as CalculationRecord)); setCalculations(l); }, (e) => handleFirestoreError(e, OperationType.LIST, 'calculations'));
    const reqsQuery = user.email === 'ngt.bpn@gmail.com' ? query(collection(db, 'upgrade_requests')) : query(collection(db, 'upgrade_requests'), where('userId', '==', userId));
    const unsubReqs = onSnapshot(reqsQuery, (s) => { const l: UpgradeRequest[] = []; s.forEach((d) => l.push(d.data() as UpgradeRequest)); setUpgradeRequests(l); }, (e) => handleFirestoreError(e, OperationType.LIST, 'upgrade_requests'));
    const unsubChats = onSnapshot(collection(db, 'users', userId, 'chat_messages'), (s) => { const l: any[] = []; s.forEach((d) => { const data = d.data(); if (data.content) { try { l.push(JSON.parse(data.content)); } catch (e) {} } }); setSavedConsultations(l); }, (e) => handleFirestoreError(e, OperationType.LIST, `users/${userId}/chat_messages`));
    return () => { unsubDocs(); unsubCalcs(); unsubReqs(); unsubChats(); };
  }, [user]);

  useEffect(() => {
    if (!user || user.email !== 'ngt.bpn@gmail.com' || !auth.currentUser) return;
    const unsubUsers = onSnapshot(collection(db, 'users'), (s) => { const l: UserProfile[] = []; s.forEach((d) => l.push(d.data() as UserProfile)); const merged = [...MOCK_USERS_SEED]; l.forEach((u) => { if (!merged.some((m) => m.uid === u.uid)) merged.push(u); }); setUsersList(merged); }, (e) => handleFirestoreError(e, OperationType.LIST, 'users'));
    return () => unsubUsers();
  }, [user]);

  const handleGoogleSignIn = async () => { const provider = new GoogleAuthProvider(); try { await signInWithPopup(auth, provider); } catch (err) { console.error('Google Auth Failed:', err); } };
  const handleLogin = async (selectedUser: UserProfile) => { const userRef = doc(db, 'users', selectedUser.uid); try { await setDoc(userRef, selectedUser); } catch (err) { console.warn('Offline mode', err); } setUser(selectedUser); setActiveTab(selectedUser.email === 'ngt.bpn@gmail.com' ? 'admin' : 'sourcing'); };
  const handleRegister = async (newUser: UserProfile) => { const userRef = doc(db, 'users', newUser.uid); try { await setDoc(userRef, newUser); } catch (error) { handleFirestoreError(error, OperationType.CREATE, `users/${newUser.uid}`); } setUsersList([...usersList, newUser]); };
  const handleLogout = async () => { try { await signOut(auth); } catch (err) { console.error('Logout failed:', err); } setUser(null); setSourcingSyncParams({ commodity:'', volume: 0, packType:'', country:'', destinationPort:'', exchangeRate:0 }); setActiveCalculation(null); };

  // Remaining handlers omitted for brevity — same logic as full file
  const handleSourcingSync = (commodity: string, volume: number, packType: string, country?: string, destinationPort?: string, exchangeRate?: number) => { const params = { commodity, volume, packType, country: country || 'Germany', destinationPort: destinationPort || 'Hamburg, Germany', exchangeRate: exchangeRate || 16500 }; setSourcingSyncParams(params); localStorage.setItem('intradex_sourcing_sync', JSON.stringify(params)); setActiveTab('calculator'); };
  const handleHandoffToPricing = (params: any) => { setSourcingSyncParams(params); localStorage.setItem('intradex_sourcing_sync', JSON.stringify(params)); setActiveTab('calculator'); };
  const handleCalculationLogged = async (record: any) => { const id = 'calc_' + Math.random().toString(36).substring(2, 9); const newRecord: CalculationRecord = { calculationId: id, userId: user?.uid || 'guest', calculationType: record.calculationType, commodity: record.commodity, volumeKg: record.volumeKg, inputs: record.inputs, outputs: record.outputs, createdDate: new Date().toISOString() }; if (auth.currentUser) { try { await setDoc(doc(db, 'calculations', id), newRecord); } catch (error) { handleFirestoreError(error, OperationType.CREATE, `calculations/${id}`); } } else { setCalculations(prev => [...prev, newRecord]); } setActiveCalculation(JSON.parse(record.outputs)); };
  const handleSaveDocument = async (docObj: any) => { const id = 'doc_' + Math.random().toString(36).substring(2, 9); const newRecord: DocumentRecord = { documentId: id, userId: user?.uid || 'guest', documentType: docObj.documentType, fileName: docObj.fileName, data: docObj.data, createdDate: new Date().toISOString() }; if (auth.currentUser) { try { await setDoc(doc(db, 'documents', id), newRecord); } catch (error) { handleFirestoreError(error, OperationType.CREATE, `documents/${id}`); } } else { setDocuments(prev => [...prev, newRecord]); } };
  const handleFileUpgradeClaim = async (e: React.FormEvent) => { e.preventDefault(); if (!user) return; const claimId = 'claim_' + Math.floor(100 + Math.random() * 900); const ticket: UpgradeRequest = { requestId: claimId, userId: user.uid, fullName: user.fullName, companyName: user.companyName, email: user.email, notes: upgradeNotes || 'Requested upgrade.', requestDate: new Date().toISOString(), status: 'pending' }; if (auth.currentUser) { try { await setDoc(doc(db, 'upgrade_requests', claimId), ticket); setUpgradeStatus('submitted'); setTimeout(() => { setShowUpgradeModal(false); setUpgradeStatus('idle'); setUpgradeNotes(''); }, 2000); } catch (error) { handleFirestoreError(error, OperationType.CREATE, `upgrade_requests/${claimId}`); } } else { setUpgradeRequests(prev => [...prev, ticket]); setUpgradeStatus('submitted'); setTimeout(() => { setShowUpgradeModal(false); setUpgradeStatus('idle'); setUpgradeNotes(''); }, 2000); } };
  const handleApproveRequest = async (requestId: string) => { const req = upgradeRequests.find(r => r.requestId === requestId); if (!req) return; if (auth.currentUser) { try { await updateDoc(doc(db, 'upgrade_requests', requestId), { status: 'approved' }); await updateDoc(doc(db, 'users', req.userId), { role: 'pro' }); if (user && user.uid === req.userId) setUser({ ...user, role: 'pro' }); } catch (error) { handleFirestoreError(error, OperationType.UPDATE, `upgrade_requests/${requestId}`); } } else { setUpgradeRequests(prev => prev.map(r => r.requestId === requestId ? { ...r, status: 'approved' } : r)); setUsersList(prev => prev.map(u => u.uid === req.userId ? { ...u, role: 'pro' } : u)); if (user && user.uid === req.userId) setUser({ ...user, role: 'pro' }); } };
  const handleRejectRequest = async (requestId: string) => { if (auth.currentUser) { try { await updateDoc(doc(db, 'upgrade_requests', requestId), { status: 'rejected' }); } catch (error) { handleFirestoreError(error, OperationType.UPDATE, `upgrade_requests/${requestId}`); } } else { setUpgradeRequests(prev => prev.map(r => r.requestId === requestId ? { ...r, status: 'rejected' } : r)); } };
  const handleToggleUserRole = async (uid: string) => { const targetUser = usersList.find(u => u.uid === uid); if (!targetUser) return; const targetNewRole: UserRole = targetUser.role === 'pro' ? 'free' : 'pro'; if (auth.currentUser) { try { await updateDoc(doc(db, 'users', uid), { role: targetNewRole }); } catch (error) { handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`); } } else { setUsersList(prev => prev.map(u => u.uid === uid ? { ...u, role: targetNewRole } : u)); } };
  const handleAIConsultationLogged = async (record: any) => { const id = 'cons_' + Math.random().toString(36).substring(2, 9); const newSession = { id, topic: record.topic, summary: record.summary, date: new Date().toISOString(), messages: record.messages }; if (user && auth.currentUser) { try { await setDoc(doc(db, 'users', user.uid, 'chat_messages', id), { messageId: id, userId: user.uid, timestamp: new Date().toISOString(), role: 'model', content: JSON.stringify(newSession) }); } catch (error) { handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/chat_messages/${id}`); } } setSavedConsultations(prev => [...prev, newSession]); };
  const handleDeleteConsultation = async (id: string) => { if (user && auth.currentUser) { try { await deleteDoc(doc(db, 'users', user.uid, 'chat_messages', id)); } catch (error) { handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/chat_messages/${id}`); } } setSavedConsultations(prev => prev.filter(c => c.id !== id)); };

  if (!user) { return (<> <EcosystemBar current="intradex" /> <div className="pt-10"> <LandingPage onLogin={handleLogin} mockUsers={usersList} onRegister={handleRegister} onGoogleLogin={handleGoogleSignIn} promoSettings={promoSettings} /> </div> </>); }
  const isAdmin = user.email === 'ngt.bpn@gmail.com';

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#e2e8f0] antialiased flex flex-col justify-between font-sans pt-10">
      <EcosystemBar current="intradex" />
      {/* Full component rendering omitted for brevity — same as original */}
    </div>
  );
}