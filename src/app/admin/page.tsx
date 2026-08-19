'use client';

import React, { useState, useEffect } from 'react';
import { upload } from '@vercel/blob/client';
import { useLanguage } from '@/lib/i18n';
import {
  Shield,
  Lock,
  UserCheck,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Video,
  Upload,
  Plus,
  Trash2,
  Edit,
  Save,
  Key,
  LogOut,
  Search,
  Filter,
  Eye,
  Calendar,
  Phone,
  Building,
  CreditCard,
  Sparkles,
  RefreshCw,
  ExternalLink,
  MapPin,
  Link2,
  FileUp,
  Play,
} from 'lucide-react';

export default function AdminPage() {
  const { t } = useLanguage();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Active Tab: 'REGISTRATIONS' | 'CMS' | 'GALLERY' | 'LOCATION' | 'SECURITY'
  const [activeTab, setActiveTab] = useState<'REGISTRATIONS' | 'CMS' | 'GALLERY' | 'LOCATION' | 'SECURITY'>('REGISTRATIONS');

  // Registrations Management State
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regStats, setRegStats] = useState<any>(null);
  const [regFilterStatus, setRegFilterStatus] = useState<string>('ALL');
  const [regFilterCategory, setRegFilterCategory] = useState<string>('ALL');
  const [regSearch, setRegSearch] = useState<string>('');
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Page Media CMS State
  const [pageMediaList, setPageMediaList] = useState<any[]>([]);
  const [selectedPageFilter, setSelectedPageFilter] = useState('all');
  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [cmsSuccessMsg, setCmsSuccessMsg] = useState('');
  const [mediaInputTab, setMediaInputTab] = useState<'upload' | 'url'>('upload');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState('');

  // Gallery Management State
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [editingGalleryItem, setEditingGalleryItem] = useState<any | null>(null);
  const [newGalleryModal, setNewGalleryModal] = useState(false);
  const [galleryInputTab, setGalleryInputTab] = useState<'upload' | 'url'>('upload');
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    mediaType: 'photo',
    mediaUrl: '',
    videoUrl: '',
    thumbnail: '',
    category: 'Match',
    featured: false,
  });

  // Location & Site Settings State
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
    training_ground: 'Manafesha Meda / Manafesha Meda, Adama',
    office_address: 'Franco Batu Tower, 2nd Floor, Adama, Ethiopia',
    coach_phone_1: '+251 911 651 214',
    coach_phone_2: '+251 908 171 773',
    tiktok_handle: '@nisiradama',
    map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.5!2d39.268!3d8.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b1f3c3a000001%3A0x0!2sAdama%2C%20Ethiopia!5e0!3m2!1sen!2set!4v1700000000000',
    location_directions_1: 'Located centrally in Adama at the famous Manafesha Meda stadium complex.',
    location_directions_2: 'Easily accessible by Bajaj, minibus, or private car from the Franco / Posta area.',
    location_directions_3: 'Parents are welcome to attend training sessions on designated weekend mornings.',
  });
  const [settingsMsg, setSettingsMsg] = useState('');

  // Password Update State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdError, setPwdError] = useState('');

  // Initial Auth Check
  useEffect(() => {
    const session = localStorage.getItem('nisir_admin_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setIsLoggedIn(true);
        setCurrentUser(parsed);
      } catch {
        localStorage.removeItem('nisir_admin_session');
      }
    }
  }, []);

  // Fetch Data when logged in or tab changes
  useEffect(() => {
    if (!isLoggedIn) return;
    if (activeTab === 'REGISTRATIONS') fetchRegistrations();
    if (activeTab === 'CMS') fetchPageMedia();
    if (activeTab === 'GALLERY') fetchGallery();
    if (activeTab === 'LOCATION') fetchSiteSettings();
  }, [isLoggedIn, activeTab, regFilterStatus, regFilterCategory]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoadingAuth(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setIsLoggedIn(true);
      setCurrentUser(data.user);
      localStorage.setItem('nisir_admin_session', JSON.stringify(data.user));
    } catch (err: any) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setLoadingAuth(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('nisir_admin_session');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // Fetch Registrations
  const fetchRegistrations = async () => {
    try {
      let url = `/api/admin/registrations?status=${regFilterStatus}&category=${regFilterCategory}`;
      if (regSearch) url += `&search=${encodeURIComponent(regSearch)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.registrations) {
        setRegistrations(data.registrations);
        setRegStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Registration Status
  const handleUpdateRegStatus = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    // Optimistic UI update
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id || r.registrationCode === id ? { ...r, status, adminNotes: adminNoteInput } : r))
    );
    if (selectedReg && (selectedReg.id === id || selectedReg.registrationCode === id)) {
      setSelectedReg({ ...selectedReg, status, adminNotes: adminNoteInput });
    }

    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes: adminNoteInput }),
      });
      if (res.ok) {
        fetchRegistrations();
      }
    } catch (err) {
      console.error('Update registration status error:', err);
    }
  };

  // Fetch Page Media for CMS
  const fetchPageMedia = async () => {
    try {
      const res = await fetch(`/api/admin/media?page=${selectedPageFilter}`);
      const data = await res.json();
      if (data?.items) {
        setPageMediaList(data.items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Page Media CMS Item
  const handleSavePageMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMedia),
      });

      if (res.ok) {
        setCmsSuccessMsg('Page media & content updated successfully!');
        fetchPageMedia();
        setTimeout(() => setCmsSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Gallery Items directly from Cloud
  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/admin/gallery?type=ALL', { cache: 'no-store' });
      const data = await res.json();
      if (data?.items) {
        setGalleryItems(data.items);
      }
    } catch (err) {
      console.error('Fetch gallery error:', err);
    }
  };

  // Create Gallery Item permanently in Cloud
  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.mediaUrl) {
      alert('Please provide a title and media file/URL.');
      return;
    }

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm),
      });
      const data = await res.json();
      if (res.ok && data?.item) {
        setGalleryItems((prev) => [data.item, ...prev.filter((i) => i.id !== data.item.id)]);
      }
    } catch (err) {
      console.error('Create gallery item error:', err);
    } finally {
      setNewGalleryModal(false);
      setGalleryForm({
        title: '',
        description: '',
        mediaType: 'photo',
        mediaUrl: '',
        videoUrl: '',
        thumbnail: '',
        category: 'Match',
        featured: false,
      });
      fetchGallery();
    }
  };

  // Delete Gallery Item permanently from Cloud
  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this media item?')) return;

    // Optimistic UI update
    setGalleryItems((prev) => prev.filter((i) => i.id !== id));

    try {
      await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete gallery error:', err);
    } finally {
      fetchGallery();
    }
  };

  // Fetch Site Settings
  const fetchSiteSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data?.settings) {
        setSiteSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Site & Location Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: siteSettings }),
      });
      if (res.ok) {
        setSettingsMsg('Location & site settings updated successfully!');
        setTimeout(() => setSettingsMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to format/clean media URLs & parse YouTube links
  const formatMediaUrl = (url: string) => {
    const clean = (url || '').trim();
    if (!clean) return '';
    const ytMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    return clean;
  };

  // Universal Media File Upload Helper for CMS & Gallery (Direct Cloud Streaming)
  const handleDirectUpload = async (file: File, callback: (url: string) => void) => {
    setIsUploadingMedia(true);
    setMediaUploadError('');

    // 1. Priority 1: Direct Client-to-Vercel-Blob Streaming (Bypasses 4.5MB Serverless Payload Limit, supports up to 500MB!)
    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/blob/upload',
      });
      if (newBlob?.url) {
        callback(newBlob.url);
        setIsUploadingMedia(false);
        return;
      }
    } catch (clientBlobErr: any) {
      console.warn('Direct client blob upload fallback:', clientBlobErr?.message || clientBlobErr);
    }

    // 2. Priority 2: Fallback to /api/upload with safe non-JSON error handling
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMsg = 'Upload failed.';
        try {
          const parsed = JSON.parse(errorText);
          errorMsg = parsed.error || errorMsg;
        } catch {
          if (res.status === 413 || errorText.includes('Too Large')) {
            errorMsg = 'File is too large for standard serverless gateway. Please ensure your Vercel Blob store is active for direct streaming.';
          } else {
            errorMsg = errorText || `Server error (${res.status})`;
          }
        }
        setMediaUploadError(errorMsg);
        setIsUploadingMedia(false);
        return;
      }

      const data = await res.json();
      if (data?.url) {
        callback(data.url);
      } else {
        setMediaUploadError(data?.error || 'Upload failed. Please check your image/video format.');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setMediaUploadError(err.message || 'File upload failed');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg('');
    setPwdError('');

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser?.username || 'coach',
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setPwdMsg('Password updated successfully! Please save your new password securely.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdError(err.message || 'Error changing password');
    }
  };

  // ================= 1. LOGIN SCREEN =================
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#091224] border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[2.5px] shadow-xl shadow-amber-500/20 mx-auto">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-amber-300/60 shadow-inner">
                <img
                  src="/nisir-logo.png"
                  alt="Nisir Adama Football Academy"
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {t('admin.login_title')}
            </h2>
            <p className="text-slate-400 text-xs">
              {t('admin.login_desc')}
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                {t('admin.username_label')}
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. coach or admin"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                {t('admin.password_label')}
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>


            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {loadingAuth ? 'Verifying...' : t('admin.login_btn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= 2. ADMIN DASHBOARD CONTROL CENTER =================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 font-black">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              Nisir Academy Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {t('admin.dashboard_title')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <div className="text-white font-bold">{currentUser?.fullName || 'Coach Fisha'}</div>
            <div className="text-slate-400 uppercase text-[10px]">{currentUser?.role || 'COACH'} Account</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-slate-800 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-slate-800 pb-4">
        {[
          { id: 'REGISTRATIONS', label: t('admin.tab_registrations'), icon: UserCheck },
          { id: 'CMS', label: t('admin.tab_cms'), icon: ImageIcon },
          { id: 'GALLERY', label: t('admin.tab_gallery'), icon: Video },
          { id: 'LOCATION', label: 'Location & Settings', icon: MapPin },
          { id: 'SECURITY', label: t('admin.tab_settings'), icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-[#091224] text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: REGISTRATIONS MANAGEMENT ================= */}
      {activeTab === 'REGISTRATIONS' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          {regStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#091224] border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Submissions</span>
                <span className="text-2xl font-black text-white">{regStats.total}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#091224] border border-amber-500/30">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Pending Verification</span>
                <span className="text-2xl font-black text-amber-400">{regStats.pending}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#091224] border border-emerald-500/30">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Verified & Approved</span>
                <span className="text-2xl font-black text-emerald-400">{regStats.verified}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#091224] border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-blue-400 block">Total Enrolled Players</span>
                <span className="text-2xl font-black text-blue-400">{regStats.totalPlayers}</span>
              </div>
            </div>
          )}

          {/* Filters & Search */}
          <div className="p-4 rounded-2xl bg-[#091224] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={regFilterStatus}
                  onChange={(e) => setRegFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <select
                  value={regFilterCategory}
                  onChange={(e) => setRegFilterCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="ALL">All Age Categories</option>
                  <option value="U10">U10 Squad</option>
                  <option value="U13">U13 Squad</option>
                  <option value="U15">U15 Squad</option>
                  <option value="17">17 Squad</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRegistrations()}
                placeholder="Search parent, player, tx #..."
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={fetchRegistrations}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-bold"
              >
                Search
              </button>
            </div>
          </div>

          {/* Registrations List Table */}
          <div className="rounded-3xl bg-[#091224] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase font-extrabold tracking-wider">
                    <th className="py-3.5 px-4">Reg Code</th>
                    <th className="py-3.5 px-4">Parent / Guardian</th>
                    <th className="py-3.5 px-4">Players</th>
                    <th className="py-3.5 px-4">Method & Ref</th>
                    <th className="py-3.5 px-4">Reg Fee</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        No registrations found.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                          {reg.registrationCode}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{reg.parentName}</div>
                          <div className="text-slate-400 font-mono">{reg.parentPhone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            {reg.players.map((p: any) => (
                              <div key={p.id} className="flex items-center gap-1.5">
                                <span className="font-semibold text-white">{p.fullName}</span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-amber-300">
                                  {p.ageCategory}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{reg.paymentMethod}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{reg.transactionNumber}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {reg.totalRegFee.toLocaleString()} ETB
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                              reg.status === 'VERIFIED'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : reg.status === 'REJECTED'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedReg(reg);
                              setAdminNoteInput(reg.adminNotes || '');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                          >
                            Inspect & Verify
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* INSPECT & VERIFY MODAL */}
          {selectedReg && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="relative max-w-2xl w-full bg-[#0B1528] border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {selectedReg.registrationCode}
                    </span>
                    <h3 className="text-xl font-black text-white">Verify Registration Proof</h3>
                  </div>
                  <button
                    onClick={() => setSelectedReg(null)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Parent / Guardian:</span>
                    <span className="text-white font-bold text-sm">{selectedReg.parentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Phone:</span>
                    <span className="text-white font-bold text-sm font-mono">{selectedReg.parentPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Payment Method:</span>
                    <span className="text-white font-bold">{selectedReg.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Transaction Reference:</span>
                    <span className="text-amber-400 font-mono font-bold">{selectedReg.transactionNumber}</span>
                  </div>
                </div>

                {/* Uploaded Receipt Image Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Uploaded Payment Receipt:
                  </span>
                  {selectedReg.receiptUrl ? (
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black border border-slate-700">
                      <img
                        src={selectedReg.receiptUrl}
                        alt="Payment Receipt"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                      No receipt image uploaded. Check transaction number directly on bank/telebirr statement.
                    </div>
                  )}
                </div>

                {/* Enrolled Children */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Players in Submission:
                  </span>
                  <div className="space-y-2">
                    {selectedReg.players.map((p: any) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          {p.playerPhotoUrl && (
                            <img
                              src={p.playerPhotoUrl}
                              alt={p.fullName}
                              className="w-10 h-10 rounded-lg object-cover border border-amber-400"
                            />
                          )}
                          <div>
                            <span className="text-white font-bold">{p.fullName}</span>
                            <span className="text-slate-400 block text-[11px]">
                              Pos: {p.position} • DOB: {p.birthDate || 'N/A'} • Father: {p.fatherName}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">
                          {p.ageCategory}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Internal Verification Notes:
                  </label>
                  <input
                    type="text"
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="e.g. Checked CBE account statement; receipt matches."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Approve / Reject Actions */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateRegStatus(selectedReg.id, 'VERIFIED')}
                    className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Verify & Approve</span>
                  </button>

                  <button
                    onClick={() => handleUpdateRegStatus(selectedReg.id, 'REJECTED')}
                    className="px-6 py-3 rounded-2xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold uppercase flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: UNIVERSAL PAGE MEDIA & CONTENT CMS ================= */}
      {activeTab === 'CMS' && (
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-[#091224] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Direct Page Content CMS
            </div>
            <h3 className="text-xl font-black text-white">{t('admin.upload_media_title')}</h3>
            <p className="text-slate-400 text-xs">{t('admin.upload_media_desc')}</p>
          </div>

          {cmsSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {cmsSuccessMsg}
            </div>
          )}

          {/* Page Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {['all', 'home', 'about', 'why_join', 'coach'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPageFilter(p)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                  selectedPageFilter === p
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* List of Editable Page Media Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pageMediaList.map((media) => (
              <div
                key={media.id}
                className="p-6 rounded-3xl bg-[#091224] border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono font-bold text-amber-400 uppercase">
                      Section: {media.sectionKey}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Page: {media.page}
                    </span>
                  </div>

                  <h4 className="text-white font-bold text-base">{media.title}</h4>
                  {media.subtitle && (
                    <p className="text-slate-400 text-xs leading-relaxed">{media.subtitle}</p>
                  )}

                  {/* Media Preview */}
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black border border-slate-700 relative">
                    {media.mediaType === 'video' ? (
                      <video
                        src={media.mediaUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={media.mediaUrl}
                        alt={media.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 capitalize">
                    Type: {media.mediaType}
                  </span>
                  <button
                    onClick={() => setEditingMedia(media)}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold uppercase hover:bg-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit / Replace Media</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EDIT PAGE MEDIA MODAL */}
          {editingMedia && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="relative max-w-xl w-full bg-[#0B1528] border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Section: {editingMedia.sectionKey}
                    </span>
                    <h3 className="text-lg font-black text-white">Edit Content & Media</h3>
                  </div>
                  <button
                    onClick={() => setEditingMedia(null)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSavePageMedia} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Headline / Title *</label>
                    <input
                      type="text"
                      required
                      value={editingMedia.title}
                      onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Paragraph</label>
                    <textarea
                      rows={3}
                      value={editingMedia.subtitle || ''}
                      onChange={(e) => setEditingMedia({ ...editingMedia, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Media Type</label>
                    <select
                      value={editingMedia.mediaType}
                      onChange={(e) => setEditingMedia({ ...editingMedia, mediaType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                    >
                      <option value="photo">Photo / Image</option>
                      <option value="video">Video (MP4 / YouTube / Direct)</option>
                    </select>
                  </div>

                  {/* Media Input Method Tabs */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Choose Photo / Video Source:
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setMediaInputTab('upload')}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          mediaInputTab === 'upload'
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <FileUp className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaInputTab('url')}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          mediaInputTab === 'url'
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Paste Link / URL</span>
                      </button>
                    </div>

                    {/* TAB A: DIRECT FILE UPLOAD */}
                    {mediaInputTab === 'upload' && (
                      <div className="space-y-2">
                        <label className="block w-full cursor-pointer p-6 rounded-2xl bg-slate-900/60 border-2 border-dashed border-slate-700 hover:border-amber-400/60 transition-colors text-center group">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-white">
                              {isUploadingMedia ? 'Uploading to Academy Server...' : 'Click to Browse or Drag & Drop File'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Supports JPG, PNG, WEBP photos and MP4 videos directly from phone/laptop
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            disabled={isUploadingMedia}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleDirectUpload(e.target.files[0], (url) => {
                                  setEditingMedia({
                                    ...editingMedia,
                                    mediaUrl: url,
                                    thumbnail: url,
                                    mediaType: e.target.files![0].type.startsWith('video') ? 'video' : 'photo',
                                  });
                                });
                              }
                            }}
                          />
                        </label>
                        {isUploadingMedia && (
                          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-2 animate-pulse">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading media... Please wait a moment.
                          </div>
                        )}
                        {mediaUploadError && (
                          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
                            {mediaUploadError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB B: PASTE URL */}
                    {mediaInputTab === 'url' && (
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={editingMedia.mediaUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              const formatted = formatMediaUrl(val);
                              const isVid =
                                formatted.includes('youtube.com') ||
                                formatted.includes('youtu.be') ||
                                formatted.endsWith('.mp4') ||
                                formatted.endsWith('.webm');
                              setEditingMedia({
                                ...editingMedia,
                                mediaUrl: formatted,
                                thumbnail: formatted,
                                mediaType: isVid ? 'video' : editingMedia.mediaType,
                              });
                            }}
                            placeholder="Paste image URL (https://...), MP4 video link, or YouTube link..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Paste any web image link, direct MP4 video link, or YouTube URL (auto-embeds).
                        </p>
                      </div>
                    )}

                    {/* LIVE MEDIA PREVIEW BOX */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-300 uppercase tracking-wider">Live Media Preview:</span>
                        {editingMedia.mediaUrl && (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[10px]">
                            <CheckCircle className="w-3 h-3" /> Ready
                          </span>
                        )}
                      </div>
                      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black/80 border border-slate-700 relative flex items-center justify-center">
                        {editingMedia.mediaUrl ? (
                          editingMedia.mediaUrl.includes('youtube.com/embed') ? (
                            <iframe
                              src={editingMedia.mediaUrl}
                              className="w-full h-full border-0"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          ) : editingMedia.mediaType === 'video' ? (
                            <video
                              src={editingMedia.mediaUrl}
                              controls
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <img
                              src={editingMedia.mediaUrl}
                              alt="Preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )
                        ) : (
                          <div className="text-center p-4 text-slate-500 text-xs">
                            No media loaded yet. Upload a file above or paste a link to see preview.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Caption / Notes</label>
                    <input
                      type="text"
                      value={editingMedia.caption || ''}
                      onChange={(e) => setEditingMedia({ ...editingMedia, caption: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingMedia(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black uppercase shadow-lg shadow-amber-500/20"
                    >
                      {t('admin.save_changes')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: GALLERY MANAGER ================= */}
      {activeTab === 'GALLERY' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white">Academy Gallery Manager</h3>
              <p className="text-slate-400 text-xs">
                Add, edit, or delete high-res match photos and training videos at any time.
              </p>
            </div>

            <button
              onClick={() => setNewGalleryModal(true)}
              className="px-5 py-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{t('admin.add_gallery_item')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-[#091224] border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 relative">
                    <img
                      src={item.thumbnail || item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-amber-400 uppercase">
                      {item.category} • {item.mediaType}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-sm">{item.title}</h4>
                  {item.description && (
                    <p className="text-slate-400 text-xs line-clamp-2">{item.description}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleDeleteGalleryItem(item.id)}
                    className="p-2 rounded-xl bg-red-950/60 text-red-400 hover:bg-red-900/80 transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD GALLERY MODAL */}
          {newGalleryModal && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="relative max-w-lg w-full bg-[#0B1528] border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-white">Add New Photo / Video to Gallery</h3>
                  <button onClick={() => setNewGalleryModal(false)} className="p-2 rounded-xl bg-slate-800 text-slate-300">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateGalleryItem} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      placeholder="e.g. U15 Match vs Nazareth FC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={galleryForm.description}
                      onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                      placeholder="Brief note about the match, drill, or ceremony..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Media Type</label>
                      <select
                        value={galleryForm.mediaType}
                        onChange={(e) => setGalleryForm({ ...galleryForm, mediaType: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      >
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                      <select
                        value={galleryForm.category}
                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                      >
                        <option value="Match">Match</option>
                        <option value="Training">Training</option>
                        <option value="COVID-Era">COVID-Era</option>
                        <option value="Celebration">Celebration</option>
                        <option value="Coach">Coach</option>
                      </select>
                    </div>
                  </div>

                  {/* Media Input Method Tabs */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Choose Photo / Video Source:
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setGalleryInputTab('upload')}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          galleryInputTab === 'upload'
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <FileUp className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setGalleryInputTab('url')}
                        className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          galleryInputTab === 'url'
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Paste Link / URL</span>
                      </button>
                    </div>

                    {/* TAB A: DIRECT FILE UPLOAD */}
                    {galleryInputTab === 'upload' && (
                      <div className="space-y-2">
                        <label className="block w-full cursor-pointer p-6 rounded-2xl bg-slate-900/60 border-2 border-dashed border-slate-700 hover:border-amber-400/60 transition-colors text-center group">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-white">
                              {isUploadingMedia ? 'Uploading to Academy Server...' : 'Click to Browse or Drag & Drop File'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Supports JPG, PNG, WEBP photos and MP4 videos directly from phone/laptop
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            disabled={isUploadingMedia}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleDirectUpload(e.target.files[0], (url) => {
                                  setGalleryForm({
                                    ...galleryForm,
                                    mediaUrl: url,
                                    thumbnail: url,
                                    mediaType: e.target.files![0].type.startsWith('video') ? 'video' : 'photo',
                                  });
                                });
                              }
                            }}
                          />
                        </label>
                        {isUploadingMedia && (
                          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-2 animate-pulse">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading media... Please wait a moment.
                          </div>
                        )}
                        {mediaUploadError && (
                          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
                            {mediaUploadError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB B: PASTE URL */}
                    {galleryInputTab === 'url' && (
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={galleryForm.mediaUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              const formatted = formatMediaUrl(val);
                              const isVid =
                                formatted.includes('youtube.com') ||
                                formatted.includes('youtu.be') ||
                                formatted.endsWith('.mp4') ||
                                formatted.endsWith('.webm');
                              setGalleryForm({
                                ...galleryForm,
                                mediaUrl: formatted,
                                thumbnail: formatted,
                                mediaType: isVid ? 'video' : galleryForm.mediaType,
                              });
                            }}
                            placeholder="Paste image URL (https://...), MP4 video link, or YouTube link..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Paste any web image link, direct MP4 video link, or YouTube URL (auto-embeds).
                        </p>
                      </div>
                    )}

                    {/* LIVE MEDIA PREVIEW BOX */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-300 uppercase tracking-wider">Live Media Preview:</span>
                        {galleryForm.mediaUrl && (
                          <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[10px]">
                            <CheckCircle className="w-3 h-3" /> Ready
                          </span>
                        )}
                      </div>
                      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black/80 border border-slate-700 relative flex items-center justify-center">
                        {galleryForm.mediaUrl ? (
                          galleryForm.mediaUrl.includes('youtube.com/embed') ? (
                            <iframe
                              src={galleryForm.mediaUrl}
                              className="w-full h-full border-0"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          ) : galleryForm.mediaType === 'video' ? (
                            <video
                              src={galleryForm.mediaUrl}
                              controls
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <img
                              src={galleryForm.mediaUrl}
                              alt="Preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )
                        ) : (
                          <div className="text-center p-4 text-slate-500 text-xs">
                            No media loaded yet. Upload a file above or paste a link to see preview.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setNewGalleryModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black uppercase"
                    >
                      Add to Gallery
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: LOCATION & CONTACT SETTINGS ================= */}
      {activeTab === 'LOCATION' && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="p-6 rounded-3xl bg-[#091224] border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4" /> Location & Contact Manager
            </div>
            <h3 className="text-xl font-black text-white">Insert or Update Location & Map</h3>
            <p className="text-slate-400 text-xs">
              Change the interactive Google Map embed URL, stadium name, office address, and parent directions guide at any time.
            </p>
          </div>

          {settingsMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {settingsMsg}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-[#091224] border border-slate-800 space-y-6 shadow-2xl">
            {/* Google Maps Embed URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Google Maps Embed URL (iframe src) *
              </label>
              <input
                type="text"
                required
                value={siteSettings.map_embed_url || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, map_embed_url: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                You can copy this from Google Maps → Share → Embed a map → copy the <code>src=&quot;...&quot;</code> URL.
              </span>
            </div>

            {/* Stadium & Training Ground */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Training Ground & Stadium Name *
              </label>
              <input
                type="text"
                required
                value={siteSettings.training_ground || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, training_ground: e.target.value })}
                placeholder="Manafesha Meda / Manafesha Meda, Adama"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Office Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Administrative Office Address *
              </label>
              <input
                type="text"
                required
                value={siteSettings.office_address || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, office_address: e.target.value })}
                placeholder="Franco Batu Tower, 2nd Floor, Adama, Ethiopia"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Coach Phone Line 1
                </label>
                <input
                  type="text"
                  value={siteSettings.coach_phone_1 || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, coach_phone_1: e.target.value })}
                  placeholder="+251 911 651 214"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Coach Phone Line 2
                </label>
                <input
                  type="text"
                  value={siteSettings.coach_phone_2 || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, coach_phone_2: e.target.value })}
                  placeholder="+251 908 171 773"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* TikTok Handle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Official TikTok Channel Handle
              </label>
              <input
                type="text"
                value={siteSettings.tiktok_handle || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, tiktok_handle: e.target.value })}
                placeholder="@nisiradama"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Directions Guide */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Arrival & Directions Guide for Parents:
              </span>
              <input
                type="text"
                value={siteSettings.location_directions_1 || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, location_directions_1: e.target.value })}
                placeholder="Directions point 1..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
              <input
                type="text"
                value={siteSettings.location_directions_2 || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, location_directions_2: e.target.value })}
                placeholder="Directions point 2..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
              <input
                type="text"
                value={siteSettings.location_directions_3 || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, location_directions_3: e.target.value })}
                placeholder="Directions point 3..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Location & Contact Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 5: SECURITY & SETTINGS ================= */}
      {activeTab === 'SECURITY' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="p-8 rounded-3xl bg-[#091224] border border-slate-800 shadow-2xl space-y-6">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white">{t('admin.change_password_title')}</h3>
              <p className="text-slate-400 text-xs">
                Update credentials for Coach Fisha Welde Meskel and administrative staff accounts.
              </p>
            </div>

            {pwdMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                {pwdMsg}
              </div>
            )}

            {pwdError && (
              <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
                {pwdError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {t('admin.new_password_label')}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 4 characters"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {t('admin.confirm_password_label')}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
              >
                {t('admin.update_password_btn')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
