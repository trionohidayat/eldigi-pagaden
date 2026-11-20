'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { useVote } from '@/context/VoteContext';
import { Voter } from '@/data/dpt';
import { extractNikFromQR } from '@/utils/qrHelper';
import {
  CameraOff,
  CheckCircle2,
  AlertCircle,
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
      width: { ideal: 1280 },
      height: { ideal: 720 }
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
    speak,
    playBeep
  } = useVote();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Default to rear camera ('environment') for tablet usage
  const [facingMode] = useState<CameraFacingMode>('environment');
  const [retryCount, setRetryCount] = useState(0);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successVoter, setSuccessVoter] = useState<Voter | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Background barcode scanner buffer (supports physical USB 2D barcode scanner without visible input)
  const barcodeBufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);

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
        setErrorMessage(`QR Code / NIK (${nik}) tidak terdaftar dalam DPT Desa Pagaden.`);
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
      setSuccessVoter(voter);

      const success = authorizeVoter(voter.nik);
      if (success) {
        setTimeout(() => {
          onAuthorized(voter);
        }, 1200);
      } else {
        setIsProcessing(false);
        setSuccessVoter(null);
      }
    },
    [isProcessing, voters, playBeep, speak, authorizeVoter, onAuthorized]
  );

  // Global keydown listener for physical USB barcode scanners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is active
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      const now = Date.now();
      if (now - lastKeyTimeRef.current > 150) {
        barcodeBufferRef.current = '';
      }
      lastKeyTimeRef.current = now;

      if (e.key === 'Enter') {
        if (barcodeBufferRef.current.length >= 10) {
          verifyAndAuthorize(barcodeBufferRef.current.trim());
          barcodeBufferRef.current = '';
        }
      } else if (e.key.length === 1) {
        barcodeBufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [verifyAndAuthorize]);

  // Camera initialization and live QR scanning loop
  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;
    let isMounted = true;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) {
            setHasCamera(false);
            setCameraError('Kamera tidak didukung pada perangkat ini.');
          }
          return;
        }

        const constraints = getCameraConstraints(facingMode);
        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
          if (isMounted) setHasCamera(true);
          requestAnimationFrame(scanQRCode);
        }
      } catch (err: unknown) {
        console.warn('Gagal membuka kamera dengan mode:', facingMode, err);
        try {
          // Fallback to any available video device
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (!isMounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute('playsinline', 'true');
            await videoRef.current.play();
            if (isMounted) setHasCamera(true);
            requestAnimationFrame(scanQRCode);
          }
        } catch (fallbackErr: unknown) {
          const error = fallbackErr as Error;
          if (isMounted) {
            setHasCamera(false);
            setCameraError(
              error.name === 'NotAllowedError'
                ? 'Izin kamera ditolak. Silakan izinkan akses kamera di peramban.'
                : 'Kamera tidak terdeteksi atau sedang digunakan aplikasi lain.'
            );
          }
        }
      }
    }

    function scanQRCode() {
      if (!isMounted || isProcessing) return;

      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert'
            });

            if (code && code.data) {
              verifyAndAuthorize(code.data);
              return;
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(scanQRCode);
    }

    const currentVideo = videoRef.current;
    startCamera();

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (currentVideo) {
        currentVideo.srcObject = null;
      }
    };
  }, [facingMode, retryCount, isProcessing, verifyAndAuthorize]);

  const handleRetryCamera = () => {
    setHasCamera(null);
    setCameraError(null);
    setRetryCount(c => c + 1);
  };

  return (
    <div
      className="relative flex-1 min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 select-none overflow-hidden"
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

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="absolute top-4 z-40 w-[92%] max-w-lg p-3.5 bg-rose-50 border-2 border-rose-400 rounded-2xl flex items-center gap-2.5 text-rose-900 text-xs sm:text-sm font-bold shadow-xl animate-in fade-in slide-in-from-top-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span className="text-left">{errorMessage}</span>
        </div>
      )}

      {/* Ultra-Clean Wide Camera Viewfinder Container */}
      <div className="relative w-full max-w-5xl xl:max-w-6xl aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[88vh] min-h-[360px] sm:min-h-[460px] bg-black border-2 sm:border-4 border-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Live Video Feed */}
        <video
          ref={videoRef}
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Center Target Box with Green Corner Brackets & Center Dark Pill (Exactly matching reference picture) */}
        {!successVoter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="relative w-52 h-52 sm:w-68 sm:h-68 md:w-80 md:h-80">
              {/* 4 Corner L-Shapes in Neon Green */}
              <div className="absolute top-0 left-0 w-9 h-9 sm:w-12 sm:h-12 border-t-4 border-l-4 border-[#22c55e] rounded-tl-xl drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]" />
              <div className="absolute top-0 right-0 w-9 h-9 sm:w-12 sm:h-12 border-t-4 border-r-4 border-[#22c55e] rounded-tr-xl drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]" />
              <div className="absolute bottom-0 left-0 w-9 h-9 sm:w-12 sm:h-12 border-b-4 border-l-4 border-[#22c55e] rounded-bl-xl drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]" />
              <div className="absolute bottom-0 right-0 w-9 h-9 sm:w-12 sm:h-12 border-b-4 border-r-4 border-[#22c55e] rounded-br-xl drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]" />

              {/* Animated Scanner Laser */}
              <div className="scanner-laser w-full h-0.5 bg-[#22c55e] shadow-[0_0_14px_#22c55e] absolute left-0" />

              {/* Centered Dark Pill Badge: "Letakkan QR code di dalam frame" */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-xs border border-white/10 text-white text-xs sm:text-sm font-bold tracking-wide shadow-2xl whitespace-nowrap">
                  Letakkan QR code di dalam frame
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Splash Message Overlay */}
        {successVoter && (
          <div className="absolute inset-0 z-30 bg-emerald-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400 animate-bounce mb-3" />
            <span className="text-xs sm:text-sm uppercase tracking-widest text-emerald-300 font-bold">
              QR Code Terverifikasi!
            </span>
            <h3 className="text-2xl sm:text-4xl font-black mt-1">
              {successVoter.name}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 font-mono mt-1">
              NIK: {successVoter.nik} • {successVoter.dusun}
            </p>
            <div className="mt-4 px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-semibold animate-pulse">
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
              {cameraError || 'Pastikan izin kamera peramban telah diberikan.'}
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
    </div>
  );
};
