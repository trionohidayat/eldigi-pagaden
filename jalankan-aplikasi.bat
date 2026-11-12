@echo off
title ElDigi Pagaden - Simulasi Pilkades Digital
echo ==========================================================
echo       ELDIGI PAGADEN - SIMULASI PILKADES DIGITAL
echo   Pemerintah Desa Pagaden, Kec. Pagaden, Kab. Subang
echo ==========================================================
echo.
echo Sedang memulai server simulasi Next.js...
echo Aplikasi akan terbuka di: http://localhost:3000
echo.
echo Untuk menutup aplikasi, tutup jendela ini atau tekan Ctrl+C.
echo.

start http://localhost:3000
npm run dev
pause
