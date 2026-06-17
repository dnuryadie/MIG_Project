import { useState, useEffect } from 'react';
import {
  Search, Globe2, BarChart3, FileText, TrendingUp, Users, Shield, ChevronDown,
  Menu, X, Phone, Mail, MapPin, ArrowRight, Star, CheckCircle, AlertTriangle,
  Leaf, Sun, CloudRain, Thermometer, DollarSign, Package, Building2, Award,
  Zap, Target, LineChart, PieChart, Activity, Bell, User, Settings, LogOut,
  Plus, Filter, Download, Upload, Eye, MessageSquare, Calendar, Clock,
  ChevronRight, ExternalLink, Play, Sparkles, Bot, Send, RefreshCw
} from 'lucide-react';
import { EcosystemBar } from './components/EcosystemBar';
import { EcosystemDashboard } from './pages/EcosystemDashboard';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('market');
  const [scrolled, setScrolled] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState<'buyer' | 'supplier'>('buyer');
  const [rfqModal, setRfqModal] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'dashboard'>(() =>
    window.location.hash === '#ecosystem' ? 'dashboard' : 'landing'
  );

  useEffect(() => {
    const onHash = () => setView(window.location.hash === '#ecosystem' ? 'dashboard' : 'landing');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'Market Intelligence', href: '#intelligence' },
    { name: 'Suppliers', href: '#suppliers' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Resources', href: '#resources' },
  ];

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50">
        <EcosystemBar current="home" />
        <div className="pt-10">
          <EcosystemDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <EcosystemBar current="home" />
      {/* Navigation */}
      <nav className={`fixed top-10 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/60' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">THINKSPICES</span>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setActiveDashboard('buyer')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeDashboard === 'buyer'
                    ? 'text-amber-700 bg-amber-50 border border-amber-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Buyer Portal
              </button>
              <button
                onClick={() => setActiveDashboard('supplier')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeDashboard === 'supplier'
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Supplier Portal
              </button>
              <button className="ml-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                Get Started
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={() => setActiveDashboard('buyer')}
                  className={`w-full px-4 py-3 text-left font-medium rounded-lg ${
                    activeDashboard === 'buyer' ? 'text-amber-700 bg-amber-50' : 'text-slate-600'
                  }`}
                >
                  Buyer Portal
                </button>
                <button
                  onClick={() => setActiveDashboard('supplier')}
                  className={`w-full px-4 py-3 text-left font-medium rounded-lg ${
                    activeDashboard === 'supplier' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'
                  }`}
                >
                  Supplier Portal
                </button>
                <button className="w-full mt-2 px-4 py-3 text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-semibold">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-28 overflow-hidden">
        {/* Premium layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-amber-50/70 to-orange-50/80" />
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #92400e 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-100/30 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">

            {/* Ecosystem eyebrow badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full border border-amber-200/80 shadow-ds-sm mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm font-semibold text-slate-600 tracking-tight">
                Magastu Indoprime Group · Indonesia's Spice Trade Ecosystem
              </span>
            </div>

            {/* Display headline */}
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-[1.08] mb-6 tracking-tight">
              From Supplier Discovery
              <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent mt-1">
                to Export Execution
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed">
              ThinkSpices connects global buyers with verified Indonesian suppliers. InTradeX powers every export — pricing, documentation, and shipment. One ecosystem. Two platforms. Zero friction.
            </p>

            {/* Ecosystem flow indicator */}
            <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-card shadow-ds-sm">
                <Leaf className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">ThinkSpices</span>
                <span className="text-xs text-amber-500 font-medium">Buyer Intelligence</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <div className="w-5 h-px bg-slate-300" />
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div className="w-5 h-px bg-slate-300" />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-card shadow-ds-sm">
                <span className="w-5 h-5 bg-indigo-600 rounded text-white text-[10px] font-black flex items-center justify-center">IX</span>
                <span className="text-sm font-semibold text-emerald-800">InTradeX</span>
                <span className="text-xs text-emerald-500 font-medium">Export Execution</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <button
                onClick={() => setRfqModal(true)}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-card shadow-ds-md hover:shadow-ds-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Explore ThinkSpices
              </button>
              <button className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-card shadow-ds-sm hover:shadow-ds-md transition-all duration-200 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Access InTradeX
              </button>
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14 pt-6 border-t border-slate-200/80">
              {[
                { value: '2,500+', label: 'Active Buyers' },
                { value: '850+', label: 'Verified Suppliers' },
                { value: '$2.8B', label: 'Trade Volume' },
                { value: '45', label: 'Countries' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Complete Sourcing Solutions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to discover, vet, and contract with the world's best spice suppliers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                title: 'Supplier Discovery',
                description: 'AI-powered matching with 850+ verified suppliers. Filter by origin, certification, capacity, and pricing.',
                color: 'amber'
              },
              {
                icon: Bot,
                title: 'AI Sourcing Intelligence',
                description: 'Smart recommendations, price predictions, and trend analysis powered by machine learning.',
                color: 'emerald'
              },
              {
                icon: BarChart3,
                title: 'Commodity Intelligence',
                description: 'Real-time market data, harvest forecasts, and supply chain analytics for 150+ commodities.',
                color: 'blue'
              },
              {
                icon: FileText,
                title: 'RFQ Workflow',
                description: 'Streamlined quote requests, bid comparison, and contract management all in one place.',
                color: 'violet'
              },
            ].map((solution, idx) => (
              <div
                key={idx}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  solution.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                  solution.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  solution.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-violet-100 text-violet-600'
                } group-hover:scale-110 transition-transform duration-300`}>
                  <solution.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{solution.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Intelligence Section */}
      <section id="intelligence" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            <div className="lg:w-2/5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-4">
                <TrendingUp className="w-4 h-4" />
                Market Intelligence
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Data-Driven Decision Making
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Access comprehensive market intelligence including real-time pricing, harvest outlooks, and supply chain analytics to optimize your sourcing strategy.
              </p>

              <div className="space-y-4">
                {[
                  { icon: DollarSign, text: 'Live FOB Price Indications' },
                  { icon: Calendar, text: 'Harvest Season Outlook' },
                  { icon: Activity, text: 'Supply Availability Index' },
                  { icon: Shield, text: 'Quality & Certification Data' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-slate-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setAiChatOpen(true)}
                className="mt-8 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <Bot className="w-5 h-5" />
                Try AI Market Assistant
              </button>
            </div>

            <div className="lg:w-3/5 w-full">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                  {['market', 'harvest', 'prices', 'supply'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-4 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {tab === 'market' && <BarChart3 className="w-4 h-4 inline mr-1.5" />}
                      {tab === 'harvest' && <Leaf className="w-4 h-4 inline mr-1.5" />}
                      {tab === 'prices' && <DollarSign className="w-4 h-4 inline mr-1.5" />}
                      {tab === 'supply' && <Package className="w-4 h-4 inline mr-1.5" />}
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'market' && <MarketDataPanel />}
                  {activeTab === 'harvest' && <HarvestOutlookPanel />}
                  {activeTab === 'prices' && <PricePanel />}
                  {activeTab === 'supply' && <SupplyPanel />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supplier Discovery Section */}
      <section id="suppliers" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
              <Globe2 className="w-4 h-4" />
              Global Supplier Network
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Verified Suppliers Worldwide
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find and connect with pre-vetted spice suppliers across major production regions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Filter Panel */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Reset</button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Commodity</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option>All Commodities</option>
                    <option>Black Pepper</option>
                    <option>Cardamom</option>
                    <option>Cinnamon</option>
                    <option>Cloves</option>
                    <option>Turmeric</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Origin Country</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option>All Countries</option>
                    <option>Vietnam</option>
                    <option>India</option>
                    <option>Indonesia</option>
                    <option>Brazil</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Certifications</label>
                  <div className="space-y-2">
                    {['ISO 22000', 'HACCP', 'Organic', 'Fair Trade'].map((cert) => (
                      <label key={cert} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-amber-500 border-slate-300 rounded focus:ring-amber-500" />
                        <span className="text-sm text-slate-600">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Monthly Capacity</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option>Any</option>
                    <option>10-50 MT</option>
                    <option>50-100 MT</option>
                    <option>100-500 MT</option>
                    <option>500+ MT</option>
                  </select>
                </div>

                <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Suppliers
                </button>
              </div>
            </div>

            {/* Supplier List */}
            <div className="lg:col-span-2 space-y-4">
              {[
                {
                  name: 'VietDelta Spice Co., Ltd',
                  origin: 'Vietnam',
                  commodities: ['Black Pepper', 'White Pepper'],
                  certifications: ['ISO 22000', 'HACCP', 'Organic'],
                  rating: 4.8,
                  capacity: '200+ MT/month',
                  responseTime: '< 12 hours'
                },
                {
                  name: 'Spices India Exports',
                  origin: 'India',
                  commodities: ['Cardamom', 'Turmeric', 'Cinnamon'],
                  certifications: ['ISO 22000', 'Fair Trade'],
                  rating: 4.6,
                  capacity: '150+ MT/month',
                  responseTime: '< 24 hours'
                },
                {
                  name: 'Indonesian Spice Trading',
                  origin: 'Indonesia',
                  commodities: ['Cloves', 'Nutmeg', 'Cinnamon'],
                  certifications: ['HACCP', 'Organic'],
                  rating: 4.7,
                  capacity: '180+ MT/month',
                  responseTime: '< 18 hours'
                },
              ].map((supplier, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {supplier.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold text-slate-900">{supplier.name}</h4>
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span className="text-sm text-slate-600">{supplier.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Globe2 className="w-4 h-4" />
                        <span>{supplier.origin}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {supplier.commodities.map((comm) => (
                          <span key={comm} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                            {comm}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {supplier.certifications.map((cert) => (
                          <span key={cert} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">
                            {cert}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {supplier.capacity}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {supplier.responseTime}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5">
                        <Send className="w-4 h-4" />
                        Request Quote
                      </button>
                      <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center pt-4">
                <button className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1">
                  View All 850+ Suppliers <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Enterprise-Grade Dashboards
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Purpose-built tools for buyers and suppliers to manage every aspect of their spice trade operations
            </p>
          </div>

          {/* Dashboard Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveDashboard('buyer')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeDashboard === 'buyer'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Buyer Dashboard
            </button>
            <button
              onClick={() => setActiveDashboard('supplier')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeDashboard === 'supplier'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Supplier Dashboard
            </button>
          </div>

          {/* Dashboard Content */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  {activeDashboard === 'buyer' ? <User className="w-4 h-4 text-white" /> : <Building2 className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    {activeDashboard === 'buyer' ? 'Global Foods Inc.' : 'VietDelta Spice Co.'}
                  </h4>
                  <p className="text-slate-400 text-sm">
                    {activeDashboard === 'buyer' ? 'Premium Buyer Account' : 'Verified Supplier'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeDashboard === 'buyer' ? <BuyerDashboardContent /> : <SupplierDashboardContent />}
            </div>
          </div>
        </div>
      </section>

      {/* Verification & Trust Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Trust & Verification
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Verified Supply Chain You Can Trust
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Every supplier on our platform undergoes rigorous verification including facility audits, certification validation, and ongoing compliance monitoring.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: Building2,
                    title: 'Facility Audits',
                    description: 'In-person verification of production facilities, storage conditions, and quality control processes.'
                  },
                  {
                    icon: Award,
                    title: 'Certification Validation',
                    description: 'Direct verification of ISO, HACCP, Organic, and Fair Trade certifications with certifying bodies.'
                  },
                  {
                    icon: Users,
                    title: 'Trade History Analysis',
                    description: 'Review of historical transaction volume, on-time delivery rates, and quality compliance records.'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Ongoing Monitoring',
                    description: 'Continuous compliance tracking with automated alerts for certification renewals and quality issues.'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">THINKSPICES Verified</h4>
                    <p className="text-emerald-100 text-sm">Enterprise Grade Trust</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    'On-site facility verified',
                    'Quality certifications validated',
                    'Trade history reviewed',
                    'Financial stability confirmed',
                    'Compliance monitoring active'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-200" />
                      <span className="text-emerald-50">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-emerald-500 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-emerald-100">Verified by 4 independent auditors</span>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-400 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-400 rounded-full opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Plans for Every Scale
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Start free and scale as your sourcing operations grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                description: 'For businesses exploring sourcing options',
                features: ['10 supplier contacts/month', 'Basic market data', 'Standard RFQ tools', 'Email support'],
                cta: 'Get Started',
                featured: false
              },
              {
                name: 'Professional',
                price: '$299',
                period: '/month',
                description: 'For growing import/export operations',
                features: ['Unlimited supplier contacts', 'Full market intelligence', 'Advanced RFQ workflow', 'AI sourcing assistant', 'Priority support', 'API access'],
                cta: 'Start Free Trial',
                featured: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For large-scale trading operations',
                features: ['Everything in Professional', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'On-site training', 'White-label options'],
                cta: 'Contact Sales',
                featured: false
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl p-8 ${
                  plan.featured
                    ? 'bg-gradient-to-b from-amber-500 to-orange-500 text-white shadow-2xl scale-105'
                    : 'bg-white border border-slate-200'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-slate-900 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className={`text-xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>

                <div className="mb-4">
                  <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={plan.featured ? 'text-amber-100' : 'text-slate-500'}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className={`text-sm mb-6 ${plan.featured ? 'text-amber-100' : 'text-slate-500'}`}>
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2">
                      <CheckCircle className={`w-5 h-5 shrink-0 ${plan.featured ? 'text-amber-200' : 'text-emerald-500'}`} />
                      <span className={`text-sm ${plan.featured ? 'text-white' : 'text-slate-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  plan.featured
                    ? 'bg-white text-amber-600 hover:bg-amber-50'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Sourcing?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Join 2,500+ enterprises already using THINKSPICES to optimize their global spice trade operations
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-amber-50 transition-all duration-200">
              Start Free Trial
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-white/50 font-semibold rounded-xl hover:bg-white/10 transition-all duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">THINKSPICES</span>
              </div>
              <p className="text-sm text-slate-500 mb-4">
                AI-powered B2B platform connecting global spice buyers with verified suppliers.
              </p>
            </div>

            {[
              {
                title: 'Platform',
                links: ['Supplier Discovery', 'Market Intelligence', 'RFQ Workflow', 'AI Assistant']
              },
              {
                title: 'Solutions',
                links: ['For Buyers', 'For Suppliers', 'Enterprise', 'API Access']
              },
              {
                title: 'Resources',
                links: ['Documentation', 'Blog', 'Case Studies', 'Webinars']
              },
              {
                title: 'Company',
                links: ['About', 'Careers', 'Press', 'Contact']
              },
            ].map((group, idx) => (
              <div key={idx}>
                <h4 className="text-white font-semibold mb-4">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a href="#" className="text-sm hover:text-amber-400 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2024 THINKSPICES. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

      {/* RFQ Modal */}
      {rfqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Request for Quotation</h3>
              <button
                onClick={() => setRfqModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Commodity *</label>
                  <select className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option value="">Select commodity</option>
                    <option>Black Pepper</option>
                    <option>Cardamom</option>
                    <option>Cinnamon</option>
                    <option>Cloves</option>
                    <option>Turmeric</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Quantity (MT) *</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Preferred Origin</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                      <option>Any</option>
                      <option>Vietnam</option>
                      <option>India</option>
                      <option>Indonesia</option>
                      <option>Brazil</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Quality Grade</label>
                  <select className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option>Standard</option>
                    <option>Premium</option>
                    <option>Organic Certified</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Delivery Port *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Rotterdam, Netherlands"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Additional Requirements</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Certifications, packaging requirements, delivery timeline..."
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setRfqModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  Submit RFQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      {aiChatOpen && (
        <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">AI Market Assistant</span>
            </div>
            <button
              onClick={() => setAiChatOpen(false)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-600" />
              </div>
              <div className="bg-slate-100 rounded-xl rounded-tl-none px-4 py-3">
                <p className="text-sm text-slate-700">
                  Hello! I'm your AI market assistant. I can help you with commodity prices, supplier recommendations, and market insights. What would you like to know?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="bg-amber-500 rounded-xl rounded-tr-none px-4 py-3">
                <p className="text-sm text-white">
                  What's the current FOB price for Vietnamese black pepper?
                </p>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-600" />
              </div>
              <div className="bg-slate-100 rounded-xl rounded-tl-none px-4 py-3">
                <p className="text-sm text-slate-700 mb-2">
                  Current FOB prices for Vietnamese black pepper (500g/l):
                </p>
                <div className="bg-white rounded-lg p-3 border border-slate-200">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Current Price</span>
                    <span className="font-semibold text-slate-900">$3,850/MT</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Weekly Change</span>
                    <span className="font-semibold text-emerald-600">+2.3%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Monthly Trend</span>
                    <span className="font-semibold text-emerald-600">+5.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about prices, suppliers, trends..."
                className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      {!aiChatOpen && (
        <button
          onClick={() => setAiChatOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

// Market Data Panel Component
function MarketDataPanel() {
  const commodities = [
    { name: 'Black Pepper', price: '$3,850', change: '+2.3%', trend: 'up', origin: 'Vietnam' },
    { name: 'Cardamom', price: '$28,500', change: '-1.2%', trend: 'down', origin: 'India' },
    { name: 'Cinnamon', price: '$4,200', change: '+0.8%', trend: 'up', origin: 'Indonesia' },
    { name: 'Cloves', price: '$8,900', change: '+3.5%', trend: 'up', origin: 'Madagascar' },
    { name: 'Turmeric', price: '$2,100', change: '+1.1%', trend: 'up', origin: 'India' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold text-slate-900">Live Market Prices</h4>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <RefreshCw className="w-3 h-3" />
          Updated 2 min ago
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="pb-2 font-medium">Commodity</th>
              <th className="pb-2 font-medium">Origin</th>
              <th className="pb-2 font-medium text-right">FOB Price/MT</th>
              <th className="pb-2 font-medium text-right">Weekly</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {commodities.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100 last:border-0">
                <td className="py-3 font-medium">{item.name}</td>
                <td className="py-3 text-slate-500">{item.origin}</td>
                <td className="py-3 text-right font-semibold">{item.price}</td>
                <td className={`py-3 text-right font-medium flex items-center justify-end gap-1 ${
                  item.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {item.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5 rotate-180" />}
                  {item.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Harvest Outlook Panel
function HarvestOutlookPanel() {
  const harvests = [
    { region: 'Vietnam', commodity: 'Black Pepper', status: 'Peak Season', progress: 85, quality: 'Excellent' },
    { region: 'Kerala, India', commodity: 'Cardamom', status: 'Early Season', progress: 35, quality: 'Good' },
    { region: 'Sumatra', commodity: 'Cinnamon', status: 'Mid Season', progress: 60, quality: 'Very Good' },
    { region: 'Madagascar', commodity: 'Cloves', status: 'Pre-Harvest', progress: 15, quality: 'Pending' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold text-slate-900">Harvest Season Outlook</h4>
        <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">2024 Season</span>
      </div>

      <div className="space-y-3">
        {harvests.map((item, idx) => (
          <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium text-slate-900">{item.commodity}</span>
                <span className="text-slate-500 text-sm ml-2">• {item.region}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.progress > 50 ? 'bg-emerald-100 text-emerald-700' :
                item.progress > 25 ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {item.status}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.progress > 50 ? 'bg-emerald-500' :
                    item.progress > 25 ? 'bg-amber-500' :
                    'bg-slate-400'
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-10">{item.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Price Panel
function PricePanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold text-slate-900">Indicative FOB Prices</h4>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
          <Download className="w-3.5 h-3.5" />
          Export Data
        </button>
      </div>

      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Prices shown are indicative FOB prices based on recent trades and market reports. Actual prices may vary based on quality, quantity, and supplier negotiation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { commodity: 'Black Pepper (500g/l)', price: '$3,750 - $3,950' },
          { commodity: 'Black Pepper (550g/l)', price: '$4,100 - $4,350' },
          { commodity: 'White Pepper', price: '$5,800 - $6,200' },
          { commodity: 'Green Cardamom', price: '$26,000 - $31,000' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-lg p-3 border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">{item.commodity}</p>
            <p className="font-semibold text-slate-900">{item.price}</p>
            <p className="text-xs text-slate-400">FOB /MT</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Supply Panel
function SupplyPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-semibold text-slate-900">Supply Availability Index</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { region: 'Vietnam', supply: 'High', index: 85, color: 'emerald' },
          { region: 'India', supply: 'Moderate', index: 65, color: 'amber' },
          { region: 'Indonesia', supply: 'Adequate', index: 70, color: 'emerald' },
          { region: 'Brazil', supply: 'Limited', index: 45, color: 'red' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="font-medium text-slate-900 mb-2">{item.region}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className={`text-2xl font-bold ${
                  item.color === 'emerald' ? 'text-emerald-600' :
                  item.color === 'amber' ? 'text-amber-600' :
                  'text-red-500'
                }`}>
                  {item.index}
                </p>
                <p className="text-xs text-slate-500">Supply Index</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  item.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                  item.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {item.supply}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Buyer Dashboard Content
function BuyerDashboardContent() {
  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active RFQs', value: '12', icon: FileText, color: 'amber', bar: 'bg-amber-500' },
          { label: 'Pending Quotes', value: '28', icon: MessageSquare, color: 'blue', bar: 'bg-blue-500' },
          { label: 'Orders in Transit', value: '5', icon: Package, color: 'emerald', bar: 'bg-emerald-500' },
          { label: 'Saved Suppliers', value: '34', icon: Users, color: 'violet', bar: 'bg-violet-500' },
        ].map((stat, idx) => (
          <div key={idx} className="relative bg-slate-900/60 rounded-xl p-4 border border-slate-700/80 overflow-hidden hover:border-slate-600 transition-colors">
            <div className={`absolute inset-y-0 left-0 w-[3px] rounded-l-xl ${stat.bar}`} />
            <div className="flex items-center justify-between mb-2 pl-2">
              <span className="text-slate-400 text-xs font-medium">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${
                stat.color === 'amber' ? 'text-amber-400' :
                stat.color === 'blue' ? 'text-blue-400' :
                stat.color === 'emerald' ? 'text-emerald-400' :
                'text-violet-400'
              }`} />
            </div>
            <p className="text-2xl font-bold text-white pl-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/80">
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Recent RFQ Activity</h4>
          <div className="space-y-0">
            {[
              { commodity: 'Black Pepper', qty: '50 MT', status: 'Quote Received', time: '2h ago' },
              { commodity: 'Cardamom', qty: '20 MT', status: 'Pending', time: '1d ago' },
              { commodity: 'Turmeric', qty: '100 MT', status: 'In Review', time: '2d ago' },
            ].map((item, idx, arr) => (
              <div key={idx} className={`flex items-center justify-between py-2.5 ${idx < arr.length - 1 ? 'border-b border-slate-700/40' : ''} hover:bg-slate-800/30 -mx-1 px-1 rounded transition-colors`}>
                <div>
                  <p className="text-white font-semibold text-sm">{item.commodity}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.qty}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    item.status === 'Quote Received' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                    item.status === 'Pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                    'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  }`}>
                    {item.status}
                  </span>
                  <p className="text-slate-600 text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/80">
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'New RFQ', icon: Plus, color: 'amber' },
              { label: 'Find Suppliers', icon: Search, color: 'blue' },
              { label: 'Market Data', icon: BarChart3, color: 'emerald' },
              { label: 'Messages', icon: MessageSquare, color: 'violet' },
            ].map((action, idx) => (
              <button
                key={idx}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  action.color === 'amber' ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/20' :
                  action.color === 'blue' ? 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/20' :
                  action.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20' :
                  'bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 border border-violet-500/20'
                }`}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Supplier Dashboard Content
function SupplierDashboardContent() {
  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'New Inquiries', value: '8', icon: Mail, color: 'amber', bar: 'bg-amber-500' },
          { label: 'Active Quotes', value: '15', icon: FileText, color: 'blue', bar: 'bg-blue-500' },
          { label: 'Orders Pending', value: '3', icon: Package, color: 'emerald', bar: 'bg-emerald-500' },
          { label: 'Profile Views', value: '142', icon: Eye, color: 'violet', bar: 'bg-violet-500' },
        ].map((stat, idx) => (
          <div key={idx} className="relative bg-slate-900/60 rounded-xl p-4 border border-slate-700/80 overflow-hidden hover:border-slate-600 transition-colors">
            <div className={`absolute inset-y-0 left-0 w-[3px] rounded-l-xl ${stat.bar}`} />
            <div className="flex items-center justify-between mb-2 pl-2">
              <span className="text-slate-400 text-xs font-medium">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${
                stat.color === 'amber' ? 'text-amber-400' :
                stat.color === 'blue' ? 'text-blue-400' :
                stat.color === 'emerald' ? 'text-emerald-400' :
                'text-violet-400'
              }`} />
            </div>
            <p className="text-2xl font-bold text-white pl-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Inquiries & Profile Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/80">
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Recent Inquiries</h4>
          <div className="space-y-0">
            {[
              { buyer: 'Global Foods Inc.', product: 'Black Pepper 500g/l', qty: '50 MT', time: '1h ago' },
              { buyer: 'Euro Spices Ltd', product: 'White Pepper', qty: '25 MT', time: '4h ago' },
              { buyer: 'Asian Trading Co', product: 'Black Pepper 550g/l', qty: '100 MT', time: '1d ago' },
            ].map((item, idx, arr) => (
              <div key={idx} className={`flex items-center justify-between py-2.5 ${idx < arr.length - 1 ? 'border-b border-slate-700/40' : ''} hover:bg-slate-800/30 -mx-1 px-1 rounded transition-colors`}>
                <div>
                  <p className="text-white font-semibold text-sm">{item.buyer}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.product} · {item.qty}</p>
                </div>
                <div className="text-right">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full transition-colors">
                    Respond
                  </button>
                  <p className="text-slate-600 text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-700/80">
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Profile Strength</h4>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">Completeness</span>
              <span className="text-emerald-400 font-semibold text-sm">85%</span>
            </div>
            <div className="h-1.5 bg-slate-700/70 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Basic Info', checked: true },
              { label: 'Certifications', checked: true },
              { label: 'Product Catalog', checked: true },
              { label: 'Quality Documents', checked: false },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                {item.checked ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-600 shrink-0" />
                )}
                <span className={`text-sm ${item.checked ? 'text-white' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
