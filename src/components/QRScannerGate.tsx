'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import jsQR from 'jsqr';
import { useVote } from '@/context/VoteContext';
import { Voter } from '@/data/dpt';
import { CrestSubang } from './CrestSubang';
import { extractNikFromQR } from '@/utils/qrHelper';
import {
  QrCode,
  Camera,
  CameraOff,
  SwitchCamera,
  Printer,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Volume2,
  VolumeX
} from 'lucide-react';

export type CameraFacingMode = 'environment' | 'user';

/**
 * Returns camera constraints. Defaults to rear camera ('environment')
 * optimized for tablet usage in polling booths.
 */
export function getCameraConstraints(facingMode: CameraFacingMode = 'environment'): MediaStreamConstraints {
  return {
    video: {
      facingMode: { ideal: facingMode },
      width: { ideal: 640 },
      height: { ideal: 480 }
    }
  };
}

interface QRScannerGateProps {
  onAuthorized: (voter: Voter) => void;
}

export const QRScannerGate: React.FC<QRScannerGateProps> = ({ onAuthorized }) => {
  const {
    voters,
    authorizeVoter,
    tpsConfig,
    isVoiceEnabled,
    toggleVoice,
    speak,
    playBeep
  } = useVote();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Default to rear camera ('environment') for tablet usage
  const [facingMode, setFacingMode] = useState<CameraFacingMode>('environment');
  const [retryCount, setRetryCount] = useState(0);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successVoter, setSuccessVoter] = useState<Voter | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Verification logic for scanned code
  const verifyAndAuthorize = useCallback(
    (rawCode: string) => {
      if (isProcessing) return;

      const nik = extractNikFromQR(rawCode);
      if (!nik) return;

      const voter = voters.find(v => v.nik === nik);

      if (!voter) {
        playBeep('warning');
        speak('Peringatan. QR Code atau NIK tidak terdaftar dalam DPT.');
        setErrorMessage(`QR Code / NIK (${nik}) tidak terdaftar dalam DPT TPS 01 Desa Pagaden.`);
        setTimeout(() => setErrorMessage(null), 3500);
        return;
      }

      if (voter.status === 'sudah_memilih') {
        playBeep('warning');
        speak(`Peringatan. Pemilih ${voter.name} sudah menggunakan hak suara.`);
        setErrorMessage(
          `Pemilih "${voter.name}" sudah menggunakan hak suara pada pukul ${voter.votedAt || 'tadi'}. Sistem mencegah pemilihan ganda.`
        );
        setTimeout(() => setErrorMessage(null), 4000);
        return;
      }

      // Valid voter!
      setIsProcessing(true);
      playBeep('success');
      speak(`QR Code terverifikasi. Selamat datang ${voter.name}. Membuka surat suara digital.`);
      const authorized = authorizeVoter(nik);

      if (authorized) {
        const found = voters.find(v => v.nik === nik) || voter;
        setSuccessVoter(found);

        // Transition to ballot screen
        setTimeout(() => {
          onAuthorized(found);
        }, 1200);
      }
    },
    [isProcessing, voters, authorizeVoter, onAuthorized, speak, playBeep]
  );

  // Initialize camera and QR scanning loop
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;
    let isCancelled = false;

    async function startCamera() {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        setCameraError('Peramban ini tidak mendukung akses kamera langsung.');
        return;
      }

      try {
        const constraints = getCameraConstraints(facingMode);

        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (constraintErr) {
          console.warn('Constraint facingMode gagal, beralih ke kamera default:', constraintErr);
          // Fallback tanpa constraint facingMode jika perangkat/browser tidak mendukungnya
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          });
        }

        if (isCancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
          setHasCamera(true);
          setCameraError(null);
          scanFrame();
        }
      } catch (err) {
        if (!isCancelled) {
          setHasCamera(false);
          const errorName = err instanceof Error ? err.name : '';
          setCameraError(
            errorName === 'NotAllowedError'
              ? 'Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser tablet atau gunakan input NIK / USB Scanner di bawah.'
              : 'Kamera tidak terdeteksi atau sedang digunakan aplikasi lain. Silakan gunakan pemindai USB barcode atau tombol simulasi.'
          );
        }
      }
    }

    function scanFrame() {
      if (isCancelled || isProcessing) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        const width = video.videoWidth || 320;
        const height = video.videoHeight || 240;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);

          // Decode QR with jsQR
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            verifyAndAuthorize(code.data);
            return;
          }
        }
      }

      animationFrameId = requestAnimationFrame(scanFrame);
    }

    startCamera();

    return () => {
      isCancelled = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [verifyAndAuthorize, isProcessing, facingMode, retryCount]);

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleRetryCamera = () => {
    setHasCamera(null);
    setCameraError(null);
    setRetryCount(c => c + 1);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      verifyAndAuthorize(manualCode);
      setManualCode('');
    }
  };

  return (
    <div
      className="relative flex-1 min-h-screen flex flex-col justify-between items-center py-3 sm:py-5 px-3 sm:px-6 select-none overflow-x-hidden overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #cbe8d6 0%, #e0f2e7 22%, #f5faf7 48%, #ffffff 75%)'
      }}
    >
      <style>{`
        @keyframes scanLaser {
          0% { top: 6%; opacity: 0.4; }
          50% { top: 94%; opacity: 1; }
          100% { top: 6%; opacity: 0.4; }
        }
        .scanner-laser {
          animation: scanLaser 2.4s ease-in-out infinite;
        }
      `}</style>

      {/* Hidden canvas for video frame analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Bar */}
      <div className="w-full max-w-6xl xl:max-w-7xl flex items-center justify-between px-2 sm:px-4 py-1 sm:py-1.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <CrestSubang size={36} className="drop-shadow-xs sm:scale-110 flex-shrink-0" />
          <div className="text-left">
            <h1 className="text-sm sm:text-lg md:text-xl font-black tracking-wider text-black font-sans uppercase">
              SURAT SUARA DIGITAL
            </h1>
            <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-700 font-sans uppercase">
              PEMILIHAN KEPALA DESA PAGADEN • {tpsConfig.tpsNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Google Voice Toggle Button */}
          <button
            type="button"
            onClick={toggleVoice}
            title={isVoiceEnabled ? 'Matikan Panduan Suara Google Voice' : 'Aktifkan Panduan Suara Google Voice'}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-xs cursor-pointer ${
              isVoiceEnabled
                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
            }`}
          >
            {isVoiceEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                <span>Google Voice: Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>Google Voice: Mati</span>
              </>
            )}
          </button>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-emerald-300 text-emerald-950 text-xs font-bold shadow-xs">
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>Langkah 1: Pindai Kartu Suara Pemilih</span>
          </div>
        </div>
      </div>

      {/* Main Wide Scanner Section */}
      <div className="w-full max-w-6xl xl:max-w-7xl flex-1 flex flex-col items-center justify-center my-1.5 sm:my-2.5">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="w-full mb-3 p-3 bg-rose-50 border-2 border-rose-400 rounded-2xl flex items-center gap-2.5 text-rose-900 text-xs sm:text-sm font-bold shadow-md animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="text-left">{errorMessage}</span>
          </div>
        )}

        {/* The Wide Camera Viewfinder Container */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[66vh] min-h-[300px] sm:min-h-[400px] bg-black border-2 sm:border-4 border-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Top Floating Info Card (Matches reference picture) */}
          <div className="absolute top-2 sm:top-3.5 left-1/2 -translate-x-1/2 z-20 w-[92%] sm:w-auto min-w-[280px] sm:min-w-[400px] max-w-md bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl py-1.5 sm:py-2.5 px-4 sm:px-6 text-center shadow-xl border border-white/60 pointer-events-none animate-in fade-in slide-in-from-top-2">
            <div className="sm:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mb-0.5">
              <QrCode className="w-3 h-3 text-emerald-700" />
              <span>Langkah 1: Pindai Kartu Suara Pemilih</span>
            </div>
            <h2 className="text-sm sm:text-lg md:text-xl font-black text-slate-950 tracking-tight">
              Arahkan kamera ke QR code
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium mt-0.5">
              Pastikan QR code terlihat jelas dan dalam frame
              <span className="sr-only">Arahkan QR Code ke Kamera</span>
            </p>
            <div className="mt-0.5 text-[10px] sm:text-[11px] font-bold text-sky-800">
              Total pemilih: <span className="font-black text-sky-950">{voters.length}</span>
            </div>
          </div>

          {/* Center Target Box with Green Corner Brackets & Center Dark Pill (Matches reference picture) */}
          {!successVoter && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pt-10 sm:pt-14 md:pt-16 pb-6">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72">
                {/* 4 Corner L-Shapes */}
                <div className="absolute top-0 left-0 w-8 h-8 sm:w-11 sm:h-11 border-t-4 border-l-4 border-[#22c55e] rounded-tl-xl drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <div className="absolute top-0 right-0 w-8 h-8 sm:w-11 sm:h-11 border-t-4 border-r-4 border-[#22c55e] rounded-tr-xl drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-11 sm:h-11 border-b-4 border-l-4 border-[#22c55e] rounded-bl-xl drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-11 sm:h-11 border-b-4 border-r-4 border-[#22c55e] rounded-br-xl drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />

                {/* Animated Scanner Laser */}
                <div className="scanner-laser w-full h-0.5 bg-[#22c55e] shadow-[0_0_12px_#22c55e] absolute left-0" />

                {/* Centered Dark Pill Badge: "Letakkan QR code di dalam frame" */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/80 backdrop-blur-xs border border-white/10 text-white text-[11px] sm:text-xs font-bold tracking-wide shadow-2xl whitespace-nowrap">
                    Letakkan QR code di dalam frame
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom subtle status pill */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/50 text-slate-800 text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
              <span>Siap melakukan pemindaian</span>
            </div>
          </div>

          {/* Success Splash Message Overlay */}
          {successVoter && (
            <div className="absolute inset-0 z-30 bg-emerald-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-14 h-14 sm:w-18 sm:h-18 text-emerald-400 animate-bounce mb-3" />
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">
                QR Code Terverifikasi!
              </span>
              <h3 className="text-xl sm:text-3xl font-black mt-1">
                {successVoter.name}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200 font-mono mt-1">
                NIK: {successVoter.nik} • {successVoter.dusun}
              </p>
              <div className="mt-4 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold animate-pulse">
                Membuka surat suara digital...
              </div>
            </div>
          )}

          {/* Fallback if camera not working */}
          {hasCamera === false && (
            <div className="absolute inset-0 z-30 bg-slate-900/95 text-white p-6 flex flex-col items-center justify-center text-center">
              <CameraOff className="w-12 h-12 text-rose-400 mb-2" />
              <span className="text-sm sm:text-base font-bold text-slate-200">
                Kamera Tidak Aktif
              </span>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {cameraError || 'Gunakan input NIK manual atau pemindai USB barcode di bawah.'}
              </p>
              <button
                type="button"
                onClick={handleRetryCamera}
                className="mt-4 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Hubungkan Kamera</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Controls Bar: Camera Mode, USB / Manual Input & Quick Simulator */}
        <div className="w-full mt-3 flex flex-col gap-2.5">
          {/* Row 1: Camera Switcher + USB / NIK Barcode Input */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-2.5 sm:p-3.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-2.5">
            {/* Camera Switcher Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] sm:text-xs font-bold">
                <Camera className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span>
                  {facingMode === 'environment' ? 'Kamera Belakang (Tablet)' : 'Kamera Depan (Kios)'}
                </span>
              </div>

              <button
                type="button"
                onClick={toggleFacingMode}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-[11px] sm:text-xs font-bold border border-slate-300 transition cursor-pointer disabled:opacity-50"
                title="Ganti ke kamera depan / belakang tablet"
              >
                <SwitchCamera className="w-3.5 h-3.5 text-slate-700" />
                <span>Ganti Kamera</span>
              </button>
            </div>

            {/* USB Barcode / Manual NIK Form */}
            <form onSubmit={handleManualSubmit} className="flex items-center gap-2 w-full md:w-auto md:min-w-[360px]">
              <input
                type="text"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="Scan dengan USB scanner / ketik NIK..."
                className="flex-1 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-1.5 sm:py-2 bg-black hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex-shrink-0 shadow-xs"
              >
                Verifikasi
              </button>
            </form>
          </div>

          {/* Row 2: Quick Simulator Buttons for Testing / Demo */}
          <div className="bg-white/85 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-2.5 px-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span>Simulasi Cepat (Pilih Warga DPT):</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {voters.slice(0, 8).map(v => (
                <button
                  key={v.nik}
                  type="button"
                  onClick={() => verifyAndAuthorize(v.nik)}
                  disabled={v.status === 'sudah_memilih' || isProcessing}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold border transition flex items-center gap-1 cursor-pointer ${
                    v.status === 'sudah_memilih'
                      ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  <span>{v.name}</span>
                  {v.status === 'sudah_memilih' && <span className="text-[9px]">(Sudah)</span>}
                </button>
              ))}

              <Link
                href="/cetak-qr"
                target="_blank"
                className="ml-1 sm:ml-2 text-[10px] sm:text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 flex-shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Kartu QR</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] sm:text-xs text-slate-600 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
        <span>Pilkades Digital Desa Pagaden • Verifikasi Surat Suara Berbasis QR Code</span>
      </div>
    </div>
  );
};
