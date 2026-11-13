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
  RefreshCw
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
  const { voters, authorizeVoter, tpsConfig } = useVote();

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
        setErrorMessage(`QR Code / NIK (${nik}) tidak terdaftar dalam DPT TPS 01 Desa Pagaden.`);
        setTimeout(() => setErrorMessage(null), 3500);
        return;
      }

      if (voter.status === 'sudah_memilih') {
        setErrorMessage(
          `Pemilih "${voter.name}" sudah menggunakan hak suara pada pukul ${voter.votedAt || 'tadi'}. Sistem mencegah pemilihan ganda.`
        );
        setTimeout(() => setErrorMessage(null), 4000);
        return;
      }

      // Valid voter!
      setIsProcessing(true);
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
    [isProcessing, voters, authorizeVoter, onAuthorized]
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
      className="relative flex-1 min-h-screen flex flex-col justify-between items-center py-6 px-4 select-none overflow-x-hidden"
      style={{
        background: 'linear-gradient(180deg, #cbe8d6 0%, #e0f2e7 22%, #f5faf7 48%, #ffffff 75%)'
      }}
    >
      {/* Hidden canvas for video frame analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mt-2">
        <CrestSubang size={56} className="drop-shadow-xs mb-2" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wider text-black font-sans uppercase">
          SURAT SUARA DIGITAL
        </h1>
        <p className="text-xs sm:text-sm md:text-base font-semibold tracking-widest text-black font-sans uppercase mt-1">
          PEMILIHAN KEPALA DESA PAGADEN • {tpsConfig.tpsNumber}
        </p>
      </div>

      {/* Main Scanner Box */}
      <div className="my-auto w-full max-w-lg bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative animate-in fade-in zoom-in-95 duration-200">
        {/* Instruction Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold mb-4">
          <QrCode className="w-4 h-4 text-emerald-700" />
          <span>Langkah 1: Pindai Kartu Suara Pemilih</span>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-black">
          Arahkan QR Code ke Kamera
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Dekatkan QR Code pada kartu pemilih hingga terlihat jelas di dalam kotak pemindai di bawah ini.
        </p>

        {/* Success Splash Message */}
        {successVoter ? (
          <div className="my-6 w-full p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl flex flex-col items-center justify-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
            <h3 className="text-lg font-black text-emerald-900">
              QR Code Terverifikasi!
            </h3>
            <p className="text-sm font-bold text-emerald-800">
              {successVoter.name}
            </p>
            <p className="text-xs text-emerald-600 font-mono">
              NIK: {successVoter.nik} • {successVoter.dusun}
            </p>
            <span className="text-xs font-semibold text-emerald-700 mt-2">
              Membuka surat suara digital...
            </span>
          </div>
        ) : (
          <>
            {/* Tablet Camera Mode & Switch Button */}
            <div className="mt-3 w-64 sm:w-72 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold">
                <Camera className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                <span>
                  {facingMode === 'environment' ? 'Kamera Belakang (Tablet)' : 'Kamera Depan (Kios)'}
                </span>
              </div>

              <button
                type="button"
                onClick={toggleFacingMode}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-[11px] font-bold border border-slate-300 transition cursor-pointer disabled:opacity-50"
                title="Ganti ke kamera depan / belakang tablet"
              >
                <SwitchCamera className="w-3.5 h-3.5 text-slate-700" />
                <span>Ganti Kamera</span>
              </button>
            </div>

            {/* Live Camera Viewfinder Box */}
            <div className="my-3 sm:my-4 relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-black rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
              <video
                ref={videoRef}
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Target Alignment Corners */}
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-md" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-md" />

                {/* Scanning Red/Emerald Laser Line */}
                <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] absolute top-1/2 -translate-y-1/2 animate-pulse" />
              </div>

              {/* Fallback if camera not working */}
              {hasCamera === false && (
                <div className="absolute inset-0 bg-slate-900/90 text-white p-4 flex flex-col items-center justify-center text-center">
                  <CameraOff className="w-10 h-10 text-rose-400 mb-2" />
                  <span className="text-xs font-bold text-slate-200">
                    Kamera Tidak Aktif
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                    {cameraError || 'Gunakan input manual atau simulasi cepat di bawah.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetryCamera}
                    className="mt-3 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Coba Hubungkan Kamera</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="w-full mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-2 text-rose-900 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="text-left">{errorMessage}</span>
          </div>
        )}

        {/* USB Barcode / Manual NIK Input Form */}
        <form onSubmit={handleManualSubmit} className="w-full mt-1 flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={e => setManualCode(e.target.value)}
            placeholder="Scan dengan USB scanner / ketik NIK..."
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-black hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
          >
            Verifikasi
          </button>
        </form>

        {/* Quick Simulator Buttons for Demo */}
        <div className="w-full mt-5 pt-4 border-t border-slate-100 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Simulasi Cepat (Pilih Warga DPT):
            </span>
            <Link
              href="/cetak-qr"
              target="_blank"
              className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kartu QR</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {voters.slice(0, 6).map(v => (
              <button
                key={v.nik}
                type="button"
                onClick={() => verifyAndAuthorize(v.nik)}
                disabled={v.status === 'sudah_memilih' || isProcessing}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition flex items-center gap-1 cursor-pointer ${
                  v.status === 'sudah_memilih'
                    ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}
              >
                <span>{v.name}</span>
                {v.status === 'sudah_memilih' && <span className="text-[9px]">(Sudah)</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-slate-500 flex items-center gap-2 mt-4">
        <ShieldCheck className="w-4 h-4 text-emerald-700" />
        <span>Pilkades Digital Desa Pagaden • Verifikasi Surat Suara Berbasis QR Code</span>
      </div>
    </div>
  );
};
