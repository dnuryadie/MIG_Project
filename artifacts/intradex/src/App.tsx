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
    email: 'ngt.bpn@gmail.com', // Bootstrapped admin
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
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'sourcing' | 'calculator' | 'docs' | 'intel' | 'ai' | 'rfq-inbox' | 'suppliers' | 'admin'>('sourcing');

  // MIG Ecosystem Bridge — reads handoff payload written by ThinkSpices
  const [pendingHandoff, setPendingHandoff] = useState<any | null>(() => {
    try {
      const h = localStorage.getItem('mig_rfq_handoff');
      return h ? JSON.parse(h) : null;
    } catch { return null; }
  });

  // Syncing states
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

  // Upgrade dialogue controller
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeNotes, setUpgradeNotes] = useState('');
  const [upgradeStatus, setUpgradeStatus] = useState<'idle' | 'submitted'>('idle');

  // AI advisor consultation lists
  const [savedConsultations, setSavedConsultations] = useState<any[]>([]);

  // 🚀 Dynamic & Persistent Launch Promotion Settings
  const [promoSettings, setPromoSettings] = useState(() => {
    const saved = localStorage.getItem('intradex_promo_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      slotsTarget: 100,
      slotsOccupied: 86,
      promoPriceIdr: 76999,
      isPromoActive: true
    };
  });

  const handleUpdatePromoSettings = (newSettings: any) => {
    setPromoSettings(newSettings);
    localStorage.setItem('intradex_promo_settings', JSON.stringify(newSettings));
  };

  // 🔗 Connection testing on mount
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // 👤 Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        let userProfile: UserProfile | null = null;
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            userProfile = snap.data() as UserProfile;
          } else {
            userProfile = {
              uid: firebaseUser.uid,
              fullName: firebaseUser.displayName || 'Google Exporter',
              companyName: 'PT Nusantara SME Partner',
              country: 'Indonesia',
              email: firebaseUser.email || '',
              username: firebaseUser.email?.split('@')[0] || 'google_user',
              role: firebaseUser.email === 'ngt.bpn@gmail.com' ? 'pro' : 'free',
              registrationDate: new Date().toISOString()
            };
            await setDoc(userRef, userProfile);
          }
          setUser(userProfile);
          if (userProfile.email === 'ngt.bpn@gmail.com') {
            setActiveTab('admin');
          } else {
            setActiveTab('sourcing');
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 📂 Sync logged in user data with Firestore collections real-time
  useEffect(() => {
    if (!user) {
      setDocuments([]);
      setCalculations([]);
      setUpgradeRequests([]);
      setSavedConsultations([]);
      return;
    }

    if (!auth.currentUser) {
      // Offline fallback: use local state and do not subscribe to Firestore to avoid permission errors
      return;
    }

    const userId = user.uid;

    // A. Sync Documents
    const docPath = 'documents';
    const docsQuery = query(collection(db, docPath), where('userId', '==', userId));
    const unsubscribeDocs = onSnapshot(docsQuery, (snapshot) => {
      const list: DocumentRecord[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as DocumentRecord);
      });
      setDocuments(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, docPath);
    });

    // B. Sync Calculations
    const calcPath = 'calculations';
    const calcsQuery = query(collection(db, calcPath), where('userId', '==', userId));
    const unsubscribeCalcs = onSnapshot(calcsQuery, (snapshot) => {
      const list: CalculationRecord[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as CalculationRecord);
      });
      setCalculations(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, calcPath);
    });

    // C. Sync Upgrade requests
    const reqsPath = 'upgrade_requests';
    const reqsQuery = user.email === 'ngt.bpn@gmail.com'
      ? query(collection(db, reqsPath))
      : query(collection(db, reqsPath), where('userId', '==', userId));
    const unsubscribeReqs = onSnapshot(reqsQuery, (snapshot) => {
      const list: UpgradeRequest[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as UpgradeRequest);
      });
      setUpgradeRequests(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, reqsPath);
    });

    // D. Sync AI Consultation Chats
    const chatPath = `users/${userId}/chat_messages`;
    const unsubscribeChats = onSnapshot(collection(db, 'users', userId, 'chat_messages'), (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        if (data.content) {
          try {
            list.push(JSON.parse(data.content));
          } catch (e) {
            // handle error
          }
        }
      });
      setSavedConsultations(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, chatPath);
    });

    return () => {
      unsubscribeDocs();
      unsubscribeCalcs();
      unsubscribeReqs();
      unsubscribeChats();
    };
  }, [user]);

  // E. Sync Complete registers list if admin
  useEffect(() => {
    if (!user || user.email !== 'ngt.bpn@gmail.com') return;
    if (!auth.currentUser) return;

    const usersPath = 'users';
    const unsubscribeUsers = onSnapshot(collection(db, usersPath), (snapshot) => {
      const list: UserProfile[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as UserProfile);
      });
      // Append seeded demo accounts so they are fully browsable as fallback
      const merged = [...MOCK_USERS_SEED];
      list.forEach((u) => {
        if (!merged.some((m) => m.uid === u.uid)) {
          merged.push(u);
        }
      });
      setUsersList(merged);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, usersPath);
    });

    return () => unsubscribeUsers();
  }, [user]);

  // Google Single Sign-On handler (Firebase Auth wrapper)
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Google Auth Failed:', err);
    }
  };

  // Manual fallback authentication for demo seeded profiles
  const handleLogin = async (selectedUser: UserProfile) => {
    const userRef = doc(db, 'users', selectedUser.uid);
    try {
      await setDoc(userRef, selectedUser);
    } catch (err) {
      console.warn('Logging in offline mode', err);
    }
    setUser(selectedUser);
    if (selectedUser.email === 'ngt.bpn@gmail.com') {
      setActiveTab('admin');
    } else {
      setActiveTab('sourcing');
    }
  };

  const handleRegister = async (newUser: UserProfile) => {
    const userRef = doc(db, 'users', newUser.uid);
    try {
      await setDoc(userRef, newUser);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${newUser.uid}`);
    }
    const updated = [...usersList, newUser];
    setUsersList(updated);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
    }
    setUser(null);
    setSourcingSyncParams({
      commodity:"",
      volume: 0,
      packType:"",
      country:"",
      destinationPort:"",
      exchangeRate:0
      });
    setActiveCalculation(null);
  };

  const handleSourcingSync = (
    commodity: string, 
    volume: number, 
    packType: string,
    country?: string,
    destinationPort?: string,
    exchangeRate?: number
  ) => {
    const params = {
      commodity,
      volume,
      packType,
      country: country || 'Germany',
      destinationPort: destinationPort || 'Hamburg, Germany',
      exchangeRate: exchangeRate || 16500
    };
    setSourcingSyncParams(params);
    localStorage.setItem('intradex_sourcing_sync', JSON.stringify(params));
    setActiveTab('calculator');
  };

  // MIG Ecosystem Bridge — loads ThinkSpices handoff directly into the pricing engine
  const handleHandoffToPricing = (params: {
    commodity: string;
    volume: number;
    packType: string;
    country: string;
    destinationPort: string;
    exchangeRate: number;
  }) => {
    setSourcingSyncParams(params);
    localStorage.setItem('intradex_sourcing_sync', JSON.stringify(params));
    setActiveTab('calculator');
  };

  const handleCalculationLogged = async (record: any) => {
    const id = 'calc_' + Math.random().toString(36).substring(2, 9);
    const newRecord: CalculationRecord = {
      calculationId: id,
      userId: user?.uid || 'guest',
      calculationType: record.calculationType,
      commodity: record.commodity,
      volumeKg: record.volumeKg,
      inputs: record.inputs,
      outputs: record.outputs,
      createdDate: new Date().toISOString()
    };

    if (auth.currentUser) {
      const calcPath = `calculations/${id}`;
      try {
        await setDoc(doc(db, 'calculations', id), newRecord);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, calcPath);
      }
    } else {
      setCalculations(prev => [...prev, newRecord]);
    }

    setActiveCalculation(JSON.parse(record.outputs));
  };

  const handleSaveDocument = async (docObj: any) => {
    const id = 'doc_' + Math.random().toString(36).substring(2, 9);
    const newRecord: DocumentRecord = {
      documentId: id,
      userId: user?.uid || 'guest',
      documentType: docObj.documentType,
      fileName: docObj.fileName,
      data: docObj.data,
      createdDate: new Date().toISOString()
    };

    if (auth.currentUser) {
      const docPath = `documents/${id}`;
      try {
        await setDoc(doc(db, 'documents', id), newRecord);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      setDocuments(prev => [...prev, newRecord]);
    }
  };

  const handleFileUpgradeClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const claimId = 'claim_' + Math.floor(100 + Math.random() * 900);
    const ticket: UpgradeRequest = {
      requestId: claimId,
      userId: user.uid,
      fullName: user.fullName,
      companyName: user.companyName,
      email: user.email,
      notes: upgradeNotes || 'Requested account upgrade for B2B commercial export suite.',
      requestDate: new Date().toISOString(),
      status: 'pending'
    };

    if (auth.currentUser) {
      const reqPath = `upgrade_requests/${claimId}`;
      try {
        await setDoc(doc(db, 'upgrade_requests', claimId), ticket);
        setUpgradeStatus('submitted');
        setTimeout(() => {
          setShowUpgradeModal(false);
          setUpgradeStatus('idle');
          setUpgradeNotes('');
        }, 2000);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, reqPath);
      }
    } else {
      setUpgradeRequests(prev => [...prev, ticket]);
      setUpgradeStatus('submitted');
      setTimeout(() => {
        setShowUpgradeModal(false);
        setUpgradeStatus('idle');
        setUpgradeNotes('');
      }, 2000);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    const req = upgradeRequests.find(r => r.requestId === requestId);
    if (!req) return;

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'upgrade_requests', requestId), { status: 'approved' });
        await updateDoc(doc(db, 'users', req.userId), { role: 'pro' });

        if (user && user.uid === req.userId) {
          setUser({ ...user, role: 'pro' });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `upgrade_requests/${requestId}`);
      }
    } else {
      setUpgradeRequests(prev => prev.map(r => r.requestId === requestId ? { ...r, status: 'approved' } : r));
      setUsersList(prev => prev.map(u => u.uid === req.userId ? { ...u, role: 'pro' } : u));
      if (user && user.uid === req.userId) {
        setUser({ ...user, role: 'pro' });
      }
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'upgrade_requests', requestId), { status: 'rejected' });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `upgrade_requests/${requestId}`);
      }
    } else {
      setUpgradeRequests(prev => prev.map(r => r.requestId === requestId ? { ...r, status: 'rejected' } : r));
    }
  };

  const handleToggleUserRole = async (uid: string) => {
    const targetUser = usersList.find(u => u.uid === uid);
    if (!targetUser) return;

    const targetNewRole: UserRole = targetUser.role === 'pro' ? 'free' : 'pro';
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', uid), { role: targetNewRole });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
      }
    } else {
      setUsersList(prev => prev.map(u => u.uid === uid ? { ...u, role: targetNewRole } : u));
    }
  };

  const handleAIConsultationLogged = async (record: any) => {
    const id = 'cons_' + Math.random().toString(36).substring(2, 9);
    const newSession = {
      id,
      topic: record.topic,
      summary: record.summary,
      date: new Date().toISOString(),
      messages: record.messages
    };

    if (user) {
      if (auth.currentUser) {
        const msgPath = `users/${user.uid}/chat_messages/${id}`;
        try {
          await setDoc(doc(db, 'users', user.uid, 'chat_messages', id), {
            messageId: id,
            userId: user.uid,
            timestamp: new Date().toISOString(),
            role: 'model',
            content: JSON.stringify(newSession)
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, msgPath);
        }
      }
    }

    const updated = [...savedConsultations, newSession];
    setSavedConsultations(updated);
  };

  const handleDeleteConsultation = async (id: string) => {
    if (user) {
      if (auth.currentUser) {
        const msgPath = `users/${user.uid}/chat_messages/${id}`;
        try {
          await deleteDoc(doc(db, 'users', user.uid, 'chat_messages', id));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, msgPath);
        }
      }
    }
    const updated = savedConsultations.filter(c => c.id !== id);
    setSavedConsultations(updated);
  };

  // If user is not logged in, serve the Landings index
  if (!user) {
    return (
      <>
        <EcosystemBar current="intradex" />
        <div className="pt-10">
          <LandingPage
            onLogin={handleLogin}
            mockUsers={usersList}
            onRegister={handleRegister}
            onGoogleLogin={handleGoogleSignIn}
            promoSettings={promoSettings}
          />
        </div>
      </>
    );
  }

  const isAdmin = user.email === 'ngt.bpn@gmail.com';

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#e2e8f0] antialiased flex flex-col justify-between font-sans pt-10">
      <EcosystemBar current="intradex" />

      {/* ── HEADER NAVIGATION PANEL (BENTO THEME) ── */}
      <header className="border-b border-[#334155] bg-[#0F172A] px-6 py-4 sticky top-10 z-40">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
          
          {/* Logo Brand Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center border border-indigo-500 shadow-md">
              <span className="font-extrabold text-lg text-white font-display select-none">IX</span>
            </div>
            <div>
              <h1 className="font-black text-white text-sm leading-none tracking-tight font-display">InTradeX™ | Your Export Companion</h1>
              <p>Magastu Indoprime Group (MIG)</p>
            </div>
          </div>

          {/* Active Encrypted Status indicator - Direct Bento Style adaptation */}
          <div className="hidden 2xl:flex flex-col items-center md:items-start select-none">
            <span className="text-[8px] text-[#94a3b8] font-bold uppercase tracking-widest font-mono">AUTH SECURITY STATE</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="pulse"></span> 
              AES-256 Session Active
            </span>
          </div>

          {/* Core Tab Links */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1 min-w-0 flex-1 xl:flex-initial justify-start xl:mx-auto max-w-full xl:max-w-2xl 2xl:max-w-4xl px-2">
            <button
              onClick={() => setActiveTab('sourcing')}
              className={`px-2 lg:px-3 py-1.5 rounded-xl text-[11px] lg:text-xs font-extrabold transition font-display tracking-tight shrink-0 ${
                activeTab === 'sourcing' ? 'bg-indigo-600 text-white shadow' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Sourcing &amp; Packaging
            </button>
            
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-2 lg:px-3 py-1.5 rounded-xl text-[11px] lg:text-xs font-extrabold transition font-display tracking-tight shrink-0 ${
                activeTab === 'calculator' ? 'bg-indigo-600 text-white shadow' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Incoterms
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`px-2 lg:px-3 py-1.5 rounded-xl text-[11px] lg:text-xs font-extrabold transition font-display tracking-tight shrink-0 ${
                activeTab === 'docs' ? 'bg-indigo-600 text-white shadow' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Documents
            </button>

            <button
              onClick={() => setActiveTab('intel')}
              className={`px-2 lg:px-3 py-1.5 rounded-xl text-[11px] lg:text-xs font-extrabold transition font-display tracking-tight shrink-0 ${
                activeTab === 'intel' ? 'bg-indigo-600 text-white shadow' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Trade Intelligence
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-2 lg:px-3 py-1.5 rounded-xl text-[11px] lg:text-xs font-extrabold transition font-display tracking-tight shrink-0 ${
                activeTab === 'ai' ? 'bg-indigo-600 text-white shadow' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              AI Advisor
            </button>

            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-2 lg:px-3 py-1.5 rounded-xl text-[11px] lg:text-xs font-extrabold transition font-display tracking-tight shrink-0 ${
                activeTab === 'suppliers' ? 'bg-indigo-600 text-white shadow' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Suppliers
            </button>

            <button
              onClick={() => setActiveTab('rfq-inbox')}
              className={`px-2 lg:px-3 py-1.5 rounded-xl text-[11px] lg:text-xs font-extrabold transition font-display tracking-tight shrink-0 relative ${
                activeTab === 'rfq-inbox' ? 'bg-emerald-700 text-white shadow' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              RFQ Inbox
              {pendingHandoff && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-400 text-[#0F172A] text-[8px] font-black rounded-full flex items-center justify-center leading-none">1</span>
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-2 lg:px-3 py-1.5 rounded-xl text-[11px] lg:text-xs font-black transition font-display tracking-tight shrink-0 border ${
                  activeTab === 'admin' ? 'bg-amber-950 text-amber-200 border-amber-700' : 'text-[#94a3b8] hover:text-white border-transparent'
                }`}
              >
                Super Admin
              </button>
            )}
          </nav>

          {/* Profile controls */}
          <div className="flex items-center space-x-3 self-center xl:self-auto shrink-0 bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-1.5 shadow-inner">
            
            <div className="text-right">
              <p className="text-xs font-black text-white max-w-[125px] truncate leading-none mb-1">{user.fullName}</p>
              
              {user.role === 'pro' ? (
                <div className="flex flex-col items-end">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[9px] font-extrabold text-amber-400 font-mono tracking-tight leading-none">InTradeX-Pro</span>
                    <span className="bg-[#422006] text-[#feec8a] font-extrabold text-[8px] px-1.5 py-0.5 rounded border border-[#D4A017] uppercase tracking-wide flex items-center gap-0.5">
                      <Star className="w-2 h-2 text-[#D4A017] fill-[#D4A017]" /> PRO
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[8px] text-[#D4A017] font-black uppercase leading-none">👑 Gold Member</span>
                    <span className="text-[8px] text-gray-500 font-mono">|</span>
                    <span className="text-[8px] text-[#94a3b8] font-mono leading-none truncate max-w-[80px]" title={user.companyName}>{user.companyName.substring(0, 12)}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[9px] font-bold text-gray-300 font-mono tracking-tight leading-none">InTradeX-Mate</span>
                    <span className="bg-slate-800 text-slate-300 font-extrabold text-[8px] px-1.5 py-0.5 rounded border border-slate-600 uppercase tracking-wide">FREE</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="bg-indigo-950 text-indigo-300 hover:bg-slate-900 border border-indigo-700 animate-pulse text-[8px] font-black px-1.5 rounded uppercase tracking-wider"
                    >
                      Upgrade
                    </button>
                    <span className="text-[8px] text-gray-500 font-mono">|</span>
                    <span className="text-[8px] text-[#94a3b8] font-mono leading-none truncate max-w-[80px]" title={user.companyName}>{user.companyName.substring(0, 12)}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white p-1 rounded-xl transition hover:bg-slate-900"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-slate-400 hover:text-red-400" />
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTAINER CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-grow w-full space-y-6">
        
        {/* Macro Resource Market Tracker */}
        <div className="w-full">
          <MarketTracker language="English" />
        </div>

        {activeTab === 'sourcing' && (
          <TabSourcing
            syncedParams={sourcingSyncParams}
            onSourcingDataChange={(params) => {
              setSourcingSyncParams(params);
              localStorage.setItem('intradex_sourcing_sync', JSON.stringify(params));
            }}
            onSyncToCalculator={handleSourcingSync}
            userRole={user.role}
          />
        )}

        {activeTab === 'calculator' && (
          <TabCalculator
            user={user}
            syncedParams={sourcingSyncParams}
            onCalculationLogged={handleCalculationLogged}
          />
        )}

        {activeTab === 'docs' && (
          <TabExportDocs
            user={user}
            syncedParams={sourcingSyncParams}
            activeCalculation={activeCalculation}
            onSaveDocument={handleSaveDocument}
          />
        )}

        {activeTab === 'intel' && <TabIntelligence />}

        {activeTab === 'ai' && (
          <TabAIAdvisor
            user={user}
            savedConsultations={savedConsultations}
            onConsultationLogged={handleAIConsultationLogged}
            onDeleteConsultation={handleDeleteConsultation}
          />
        )}

        {activeTab === 'suppliers' && (
          <SupplierNetworkPanel />
        )}

        {activeTab === 'rfq-inbox' && (
          <RfqInbox
            handoff={pendingHandoff}
            onLoadToPricing={handleHandoffToPricing}
            onGoToDocs={() => setActiveTab('docs')}
            onDismiss={() => {
              localStorage.removeItem('mig_rfq_handoff');
              setPendingHandoff(null);
              setActiveTab('sourcing');
            }}
          />
        )}

        {activeTab === 'admin' && isAdmin && (
          <AdminPanel
            currentUser={user}
            users={usersList}
            requests={upgradeRequests}
            documents={documents}
            calculations={calculations}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onToggleUserRole={handleToggleUserRole}
            promoSettings={promoSettings}
            onUpdatePromoSettings={handleUpdatePromoSettings}
          />
        )}
      </main>

      {/* ── UPGRADE MEMBERSHIP TICKET MODAL ── */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b27] border-2 border-[#D4A017] rounded-2xl max-w-md w-full p-6 space-y-4">
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-lg text-[#D4A017] uppercase tracking-tight">Request InTradeX-Pro Status</h3>
                <p className="text-xs text-[#94a3b8] mt-1">Unlock all ocean routes, custom freight calculators, and draft official Commercial contract agreements.</p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-500 hover:text-white font-bold p-1 text-sm selection:bg-transparent"
              >
                ✕
              </button>
            </div>

            {upgradeStatus === 'submitted' ? (
              <div className="p-6 text-center space-y-3 bg-[#1e2636] rounded-xl border border-emerald-900/40">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce mt-1" />
                <h4 className="font-bold text-white text-sm">Upgrade Request Submitted!</h4>
                <p className="text-xs text-gray-400">Claims ticket registered. Log in as Administrator (admin@intradex.com) to instantly approve credentials.</p>
              </div>
            ) : (
              <form onSubmit={handleFileUpgradeClaim} className="space-y-4">
                <div className="bg-[#1e2636] p-4 rounded-xl border border-[#2d3748] text-xs space-y-2">
                  <p className="font-bold text-white">Bank Transfer Details:</p>
                  <p className="text-gray-400">Transfer Subscription Charge of:</p>
                  <p className="text-lg font-black text-white">IDR 76,999 / Month</p>
                  <p className="text-gray-400 leading-normal">
                    Mandiri Bank Acc: <strong className="text-white font-mono">122-00-112233-9</strong> (Magastu Indoprime Group (MIG)). Or select demo admin bypass below.
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1.5">Note/Proof Details (Mandatory)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Sent via Yusuf Hermawan Acc. Please approve."
                    value={upgradeNotes}
                    onChange={(e) => setUpgradeNotes(e.target.value)}
                    className="w-full bg-[#1e2636] border border-[#2d3748] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-yellow-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(false)}
                    className="bg-[#1e2636] hover:bg-gray-800 border border-[#2d3748] text-white py-2 rounded-xl text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#D4A017] hover:bg-opacity-95 text-black py-2 rounded-xl text-xs font-extrabold transition uppercase tracking-wider"
                  >
                    File Claim Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MIG ECOSYSTEM FOOTER ── */}
      <footer className="border-t border-[#334155] bg-[#080e17]">
        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* Top grid: brand + 4 link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-indigo-600 rounded-card flex items-center justify-center border border-indigo-500">
                  <span className="font-extrabold text-sm text-white font-display select-none">IX</span>
                </div>
                <div>
                  <p className="font-black text-white text-sm leading-none tracking-tight font-display">InTradeX™</p>
                  <p className="text-[10px] text-slate-500">Your Export Companion</p>
                </div>
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed mb-3">
                End-to-end export execution platform for Indonesian spice exporters. Pricing, documentation, and trade intelligence — all in one place.
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-500 bg-[#1E293B] border border-[#334155] px-2.5 py-1 rounded-full">
                <span className="pulse" />
                MIG Ecosystem · Secure Session
              </span>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-4 font-display">Products</h4>
              <ul className="space-y-2.5">
                {['Incoterms Calculator', 'Export Documents', 'Trade Intelligence', 'AI Export Advisor', 'Sourcing & Packaging'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-[13px] text-slate-400 hover:text-emerald-400 transition-colors duration-150">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-4 font-display">Resources</h4>
              <ul className="space-y-2.5">
                {['Knowledge Base', 'Export Guides', 'Market Tracker', 'Documentation', 'API Reference'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-[13px] text-slate-400 hover:text-emerald-400 transition-colors duration-150">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-4 font-display">Company</h4>
              <ul className="space-y-2.5">
                {['About MIG', 'ThinkSpices Platform', 'Privacy Policy', 'Terms of Service', 'Careers'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-[13px] text-slate-400 hover:text-emerald-400 transition-colors duration-150">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-4 font-display">Contact</h4>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                  <span className="text-[13px] text-slate-400">Jakarta, Indonesia</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                  <a href="mailto:info@intradex.com" className="text-[13px] text-slate-400 hover:text-emerald-400 transition-colors duration-150">info@intradex.com</a>
                </li>
                <li className="flex items-start gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                  <a href="#" className="text-[13px] text-slate-400 hover:text-emerald-400 transition-colors duration-150">www.mig.co.id</a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#1e293b] pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-black text-indigo-400 tracking-wider">InTradeX™</span>
              <span className="text-slate-700">|</span>
              <span>© {new Date().getFullYear()} Magastu Indoprime Group (MIG). All Rights Reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
              <span className="text-slate-700">|</span>
              <span>EFSA · FDA · BICON Compliant</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
