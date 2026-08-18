'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import {
  Trophy,
  UserPlus,
  Trash2,
  Upload,
  CheckCircle,
  Copy,
  Check,
  CreditCard,
  Phone,
  Shield,
  Printer,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Calendar,
  Building,
} from 'lucide-react';

interface PlayerData {
  id: string;
  fullName: string;
  birthDate: string;
  playerPhone: string;
  playerPhotoUrl: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  position: string;
  ageCategory: 'U10' | 'U13' | 'U15' | '17';
  parentConsent: boolean;
}

export default function RegisterPage() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Common Parent Info
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  // Multi-Child List
  const [players, setPlayers] = useState<PlayerData[]>([
    {
      id: 'p1',
      fullName: '',
      birthDate: '',
      playerPhone: '',
      playerPhotoUrl: '',
      fatherName: '',
      motherName: '',
      guardianPhone: '',
      position: 'Midfielder',
      ageCategory: 'U10',
      parentConsent: true,
    },
  ]);

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState<'CBE' | 'TELEBIRR'>('CBE');
  const [transactionNumber, setTransactionNumber] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedTele, setCopiedTele] = useState(false);

  // Submission State & Result
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registrationResult, setRegistrationResult] = useState<any>(null);

  // Add Another Child
  const handleAddChild = () => {
    const newId = `p${players.length + 1}`;
    setPlayers([
      ...players,
      {
        id: newId,
        fullName: '',
        birthDate: '',
        playerPhone: '',
        playerPhotoUrl: '',
        fatherName: parentName || '',
        motherName: '',
        guardianPhone: parentPhone || '',
        position: 'Midfielder',
        ageCategory: 'U13',
        parentConsent: true,
      },
    ]);
  };

  // Remove Child
  const handleRemoveChild = (index: number) => {
    if (players.length <= 1) return;
    setPlayers(players.filter((_, idx) => idx !== index));
  };

  // Update specific child field
  const handlePlayerChange = (index: number, field: keyof PlayerData, value: any) => {
    const updated = [...players];
    updated[index] = { ...updated[index], [field]: value };
    setPlayers(updated);
  };

  // Handle Photo Upload with Instant Local Preview & Server Upload
  const handlePhotoUpload = async (index: number, file: File) => {
    // 1. Instant local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handlePlayerChange(index, 'playerPhotoUrl', e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // 2. Upload to server (Vercel Blob or local)
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data?.url) {
        handlePlayerChange(index, 'playerPhotoUrl', data.url);
      }
    } catch (err) {
      console.warn('Photo upload server fallback active:', err);
    }
  };

  // Handle Receipt Upload with Instant Local Preview & Server Upload
  const handleReceiptUpload = async (file: File) => {
    // 1. Instant local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setReceiptUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // 2. Upload to server (Vercel Blob or local)
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data?.url) {
        setReceiptUrl(data.url);
      }
    } catch (err) {
      console.warn('Receipt upload server fallback active:', err);
    }
  };

  // Dynamic Fee Calculation per Specification:
  // U10: 4,000 Birr reg + 500 / mo
  // U13: 4,000 Birr reg + 500 / mo
  // U15: 5,000 Birr reg + 500 / mo
  // 17: 5,000 Birr reg + 500 / mo
  const getPlayerFee = (category: string) => {
    const regFee = category === 'U15' || category === '17' ? 5000 : 4000;
    const monthlyFee = 500;
    return { regFee, monthlyFee };
  };

  const totalRegFee = players.reduce((sum, p) => sum + getPlayerFee(p.ageCategory).regFee, 0);
  const totalMonthlyFee = players.reduce((sum, p) => sum + getPlayerFee(p.ageCategory).monthlyFee, 0);

  // Validate Step 1
  const validateStep1 = () => {
    setErrorMsg('');
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      if (!p.fullName.trim()) {
        setErrorMsg(`Please enter full name for Trainee #${i + 1}`);
        return false;
      }
      if (!p.fatherName.trim()) {
        setErrorMsg(`Please enter Father's name for Trainee #${i + 1}`);
        return false;
      }
      if (!p.motherName.trim()) {
        setErrorMsg(`Please enter Mother's name for Trainee #${i + 1}`);
        return false;
      }
      if (!p.guardianPhone.trim() && !parentPhone.trim()) {
        setErrorMsg(`Please enter Guardian Phone for Trainee #${i + 1}`);
        return false;
      }
      if (!p.parentConsent) {
        setErrorMsg(`Parental media consent is required for Trainee #${i + 1}`);
        return false;
      }
    }
    return true;
  };

  // Submit Final Registration
  const handleSubmitFinal = async () => {
    setErrorMsg('');
    if (!transactionNumber.trim()) {
      setErrorMsg('Please enter your Bank or Telebirr transaction reference number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName || players[0].fatherName,
          parentPhone: parentPhone || players[0].guardianPhone,
          parentEmail: parentEmail || null,
          paymentMethod,
          transactionNumber,
          receiptUrl,
          players,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setRegistrationResult(data);
      setCurrentStep(5);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: 'CBE' | 'TELE') => {
    navigator.clipboard.writeText(text);
    if (type === 'CBE') {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    } else {
      setCopiedTele(true);
      setTimeout(() => setCopiedTele(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4" /> Official Trainee Enrollment
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
          {t('register.title')}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          {t('register.subtitle')}
        </p>
      </div>

      {/* STEPPER PROGRESS INDICATOR */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-3xl mx-auto text-center">
        {[
          { step: 1, label: '1. Information' },
          { step: 2, label: '2. Fee Detection' },
          { step: 3, label: '3. Payment' },
          { step: 4, label: '4. Receipt' },
          { step: 5, label: '5. Confirmation' },
        ].map((s) => (
          <div
            key={s.step}
            className={`p-2 sm:p-3 rounded-2xl border transition-all text-xs font-bold ${
              currentStep === s.step
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : currentStep > s.step
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900/60 text-slate-500 border-slate-800'
            }`}
          >
            <div className="hidden sm:block">{s.label}</div>
            <div className="sm:hidden font-mono">{s.step}</div>
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ================= STEP 1: INFORMATION COLLECTION ================= */}
      {currentStep === 1 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Parent / Guardian Top Contact */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#091224] border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-white font-bold text-lg uppercase tracking-wide flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Parent / Guardian Overview</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Parent / Primary Guardian Name *
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Ato Yohannes Haile"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Guardian Phone Number *
                </label>
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="e.g. +251 912 345 678"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Children Forms */}
          <div className="space-y-6">
            {players.map((player, idx) => (
              <div
                key={player.id}
                className="p-6 sm:p-8 rounded-3xl bg-[#091224] border border-slate-800 shadow-2xl space-y-6 relative"
              >
                {/* Trainee Card Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <h3 className="text-white font-extrabold text-lg uppercase tracking-tight">
                      {t('register.child_num')} {idx + 1}
                    </h3>
                  </div>

                  {players.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(idx)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-800/60"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{t('register.remove_child')}</span>
                    </button>
                  )}
                </div>

                {/* Trainee Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Full Name */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('register.full_name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={player.fullName}
                      onChange={(e) => handlePlayerChange(idx, 'fullName', e.target.value)}
                      placeholder="e.g. Nahom Yohannes"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Birthday */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('register.dob')} *
                    </label>
                    <input
                      type="date"
                      required
                      value={player.birthDate}
                      onChange={(e) => handlePlayerChange(idx, 'birthDate', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Age Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('register.age_category')} *
                    </label>
                    <select
                      value={player.ageCategory}
                      onChange={(e) => handlePlayerChange(idx, 'ageCategory', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none font-bold"
                    >
                      <option value="U10">{t('register.u10')} (4,000 Birr)</option>
                      <option value="U13">{t('register.u13')} (4,000 Birr)</option>
                      <option value="U15">{t('register.u15')} (5,000 Birr)</option>
                      <option value="17">{t('register.u17')} (5,000 Birr)</option>
                    </select>
                  </div>

                  {/* Playing Position */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('register.position')} *
                    </label>
                    <select
                      value={player.position}
                      onChange={(e) => handlePlayerChange(idx, 'position', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Goalkeeper">{t('register.pos_gk')}</option>
                      <option value="Defender">{t('register.pos_def')}</option>
                      <option value="Midfielder">{t('register.pos_mid')}</option>
                      <option value="Forward">{t('register.pos_fwd')}</option>
                    </select>
                  </div>

                  {/* Optional Child Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('register.player_phone')}
                    </label>
                    <input
                      type="tel"
                      value={player.playerPhone}
                      onChange={(e) => handlePlayerChange(idx, 'playerPhone', e.target.value)}
                      placeholder="Optional"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Father's Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('register.father_name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={player.fatherName}
                      onChange={(e) => handlePlayerChange(idx, 'fatherName', e.target.value)}
                      placeholder="Father's full name"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Mother's Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('register.mother_name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={player.motherName}
                      onChange={(e) => handlePlayerChange(idx, 'motherName', e.target.value)}
                      placeholder="Mother's full name"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Guardian Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('register.guardian_phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={player.guardianPhone || parentPhone}
                      onChange={(e) => handlePlayerChange(idx, 'guardianPhone', e.target.value)}
                      placeholder="e.g. 0911 234 567"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Photo Upload & Preview */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {t('register.photo_label')}
                  </label>
                  <div className="flex items-center gap-4">
                    {player.playerPhotoUrl ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-950 flex-shrink-0">
                        <img
                          src={player.playerPhotoUrl}
                          alt="Player preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl border border-dashed border-slate-700 bg-slate-900 flex items-center justify-center text-slate-500 text-xs flex-shrink-0">
                        No Photo
                      </div>
                    )}
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>{player.playerPhotoUrl ? 'Change Photo' : 'Upload Player Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handlePhotoUpload(idx, e.target.files[0]);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Parental Consent Checkbox (Standard practice for minor data per spec) */}
                <div className="pt-3 border-t border-slate-850">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={player.parentConsent}
                      onChange={(e) => handlePlayerChange(idx, 'parentConsent', e.target.checked)}
                      className="w-5 h-5 mt-0.5 accent-amber-400 rounded cursor-pointer"
                    />
                    <span className="text-xs text-slate-300 leading-relaxed">
                      {t('register.consent_label')}
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Child Button */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleAddChild}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-400/40 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('register.add_child')}</span>
            </button>
          </div>

          {/* Continue Button to Step 2 */}
          <div className="pt-6 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 hover:scale-105"
            >
              <span>{t('register.continue_to_fee')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: DYNAMIC FEE DETECTION ================= */}
      {currentStep === 2 && (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#091224] border border-slate-800 shadow-2xl space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Automatic Calculation
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {t('register.fee_summary_title')}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Official fees detected based on verified age categories.
            </p>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-bold">
                  <th className="py-3 px-4">Trainee</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Registration Fee</th>
                  <th className="py-3 px-4">Monthly Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {players.map((p, idx) => {
                  const fee = getPlayerFee(p.ageCategory);
                  return (
                    <tr key={p.id} className="text-slate-200">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {p.fullName || `Trainee #${idx + 1}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 font-mono text-xs font-bold">
                          {p.ageCategory}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {fee.regFee.toLocaleString()} ETB
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {fee.monthlyFee.toLocaleString()} ETB / mo
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Subtotal & Totals Box */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{t('register.reg_fee_label')}</span>
              <span className="font-bold font-mono text-white text-base">
                {totalRegFee.toLocaleString()} ETB
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{t('register.monthly_fee_label')}</span>
              <span className="font-bold font-mono text-slate-300">
                {totalMonthlyFee.toLocaleString()} ETB / month
              </span>
            </div>
            <div className="h-px bg-slate-800 my-2" />
            <div className="flex items-center justify-between text-base sm:text-lg font-black text-amber-400">
              <span>{t('register.total_due_now')}</span>
              <span className="text-xl sm:text-2xl font-mono">
                {totalRegFee.toLocaleString()} ETB
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 text-slate-300 border border-slate-700 text-xs font-bold uppercase"
            >
              ← Back to Details
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: PAYMENT METHOD PRESENTATION ================= */}
      {currentStep === 3 && (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#091224] border border-slate-800 shadow-2xl space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Step 3
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {t('register.step3_title')}
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              {t('register.payment_intro')}
            </p>
          </div>

          {/* Two Official Payment Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option 1: Commercial Bank of Ethiopia (CBE) */}
            <div
              onClick={() => setPaymentMethod('CBE')}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 space-y-4 ${
                paymentMethod === 'CBE'
                  ? 'bg-gradient-to-br from-[#121B35] to-[#0A1225] border-amber-400 shadow-2xl scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-base sm:text-lg">
                      Commercial Bank of Ethiopia
                    </h4>
                    <span className="text-xs text-purple-400 font-semibold">CBE Account</span>
                  </div>
                </div>
                {paymentMethod === 'CBE' && (
                  <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                )}
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Account Number:</div>
                <div className="text-xl font-mono font-black text-white tracking-wider flex items-center justify-between">
                  <span>1000666650275</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard('1000666650275', 'CBE');
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 hover:bg-amber-300"
                  >
                    {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBank ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xs text-slate-300 pt-1 border-t border-slate-850">
                  Account Name: <strong>Fisha Welde Meskel</strong>
                </div>
              </div>
            </div>

            {/* Option 2: Telebirr */}
            <div
              onClick={() => setPaymentMethod('TELEBIRR')}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 space-y-4 ${
                paymentMethod === 'TELEBIRR'
                  ? 'bg-gradient-to-br from-[#0F2822] to-[#0A1A17] border-emerald-400 shadow-2xl scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-extrabold text-base sm:text-lg">
                      Telebirr
                    </h4>
                    <span className="text-xs text-emerald-400 font-semibold">Instant Mobile Money</span>
                  </div>
                </div>
                {paymentMethod === 'TELEBIRR' && (
                  <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                )}
              </div>

              <div className="p-4 rounded-2xl bg-black/50 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Telebirr Number:</div>
                <div className="text-xl font-mono font-black text-white tracking-wider flex items-center justify-between">
                  <span>0911651214</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard('0911651214', 'TELE');
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 hover:bg-emerald-300"
                  >
                    {copiedTele ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTele ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xs text-slate-300 pt-1 border-t border-slate-850">
                  Account Name: <strong>Fisha Welde Meskel</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-center text-xs text-slate-300">
            Selected Payment: <strong className="text-amber-400">{paymentMethod}</strong> • Transfer Amount:{' '}
            <strong className="text-white font-mono">{totalRegFee.toLocaleString()} ETB</strong>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 text-slate-300 border border-slate-700 text-xs font-bold uppercase"
            >
              ← Back to Fee
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2"
            >
              <span>I Have Transferred • Upload Receipt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: PROOF OF PAYMENT ================= */}
      {currentStep === 4 && (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#091224] border border-slate-800 shadow-2xl space-y-8 animate-in fade-in duration-300">
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Step 4: Verification Submission
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {t('register.step4_title')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
              Please enter your transaction reference number and upload a photo of your receipt for Coach Fisha&apos;s administrative verification.
            </p>
          </div>

          <div className="max-w-xl mx-auto space-y-6">
            {/* Transaction Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {t('register.tx_number_label')} *
              </label>
              <input
                type="text"
                required
                value={transactionNumber}
                onChange={(e) => setTransactionNumber(e.target.value)}
                placeholder={t('register.tx_number_placeholder')}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Receipt Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {t('register.upload_receipt_label')}
              </label>

              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/60 text-center space-y-4">
                {receiptUrl ? (
                  <div className="space-y-3">
                    <div className="aspect-[16/9] max-h-48 mx-auto rounded-xl overflow-hidden bg-black border border-amber-400/50">
                      <img
                        src={receiptUrl}
                        alt="Uploaded Receipt"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Receipt Uploaded Successfully
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-amber-400 mx-auto" />
                    <div className="text-xs text-slate-300 font-medium">
                      Upload bank slip screenshot or Telebirr SMS receipt photo
                    </div>
                  </div>
                )}

                <label className="inline-block cursor-pointer px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold">
                  <span>{receiptUrl ? 'Change Receipt Photo' : 'Select Receipt Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleReceiptUpload(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 text-slate-300 border border-slate-700 text-xs font-bold uppercase"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitFinal}
                className="flex-1 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Submitting Registration...' : t('register.submit_reg_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 5: CONFIRMATION & SLIP ================= */}
      {currentStep === 5 && registrationResult && (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#091224] border border-emerald-500/40 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {t('register.success_title')}
            </h2>
            <p className="text-slate-300 text-sm">
              {t('register.success_desc')}
            </p>
          </div>

          {/* CRITICAL NOTICE PER SPECIFICATION */}
          <div className="p-6 rounded-2xl bg-amber-500/15 border-2 border-amber-400/80 text-amber-300 text-sm font-extrabold space-y-2 text-center shadow-lg">
            <span className="text-xs uppercase tracking-widest block font-black text-amber-400">
              NEXT STEP MANDATE
            </span>
            <p className="text-base sm:text-lg leading-snug">
              🚨 {t('register.important_notice')}
            </p>
          </div>

          {/* Printable Registration Card Slip */}
          <div
            id="registration-slip"
            className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-700 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Official Registration Reference
                </span>
                <span className="text-2xl font-mono font-black text-amber-400">
                  {registrationResult.registrationCode}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase">
                Pending Verification
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Parent / Guardian:</span>
                <span className="text-white font-bold text-sm">
                  {parentName || players[0].fatherName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Phone Number:</span>
                <span className="text-white font-bold text-sm font-mono">
                  {parentPhone || players[0].guardianPhone}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Payment Method:</span>
                <span className="text-white font-bold">{paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Transaction Ref:</span>
                <span className="text-white font-bold font-mono">{transactionNumber}</span>
              </div>
            </div>

            {/* Players on Slip */}
            <div className="space-y-2 pt-2 border-t border-slate-850">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Registered Trainees ({players.length}):
              </span>
              <div className="space-y-2">
                {players.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-white font-bold">
                        {idx + 1}. {p.fullName}
                      </span>
                      <span className="text-slate-400 block text-[11px]">
                        Position: {p.position} • DOB: {p.birthDate || 'N/A'}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 font-mono font-bold">
                      {p.ageCategory}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
              <span>Training Ground: Chapi Meda, Adama</span>
              <span>Coach: 0911 651 214</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => window.print()}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold uppercase flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{t('register.print_slip')}</span>
            </button>

            <Link
              href="/"
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
