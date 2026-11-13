# Changelog

Semua perubahan penting pada proyek **ElDigi Pagaden** (Simulasi E-Voting Pilkades Desa Pagaden) dicatat dalam dokumen ini.
Format ini mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan mematuhi [Semantic Versioning](https://semver.org/lang/id/).

## [Unreleased]

## [0.2.2] - 2026-11-13

### Fixed
- **Dukungan Kamera Belakang untuk Tablet (`QRScannerGate`)**: Mengubah konfigurasi kamera default pemindai QR dari kamera depan (`user`) menjadi kamera belakang (`environment` dengan fallback aman) agar sesuai dengan penggunaan perangkat tablet di bilik suara.

### Added
- **Kontrol Alih Kamera & Status (`QRScannerGate`)**: Menambahkan indikator status kamera aktif (`Kamera Belakang (Tablet)` / `Kamera Depan (Kios)`), tombol `Ganti Kamera` untuk kemudahan alih kamera secara dinamis, tombol `Coba Hubungkan Kamera` jika akses sempat tertunda, dan unit test pengujian constraint kamera tablet.


## [0.2.1] - 2026-11-13

### Fixed
- **Konflik Peer Dependency Vercel Build (ERESOLVE)**: Memperbarui `@types/node` dari `^20` ke `^22` di `package.json` untuk menyelesaikan konflik *peer dependency* dengan `vitest@^5.1.0` yang mewajibkan `@types/node` `>=22`.
- **Konfigurasi `.npmrc`**: Menambahkan instruksi `legacy-peer-deps=true` pada `.npmrc` untuk memastikan proses `npm install` pada pipeline CI/CD Vercel selalu berjalan lancar dan toleran terhadap konflik transitif dependensi.
- **Sanitasi ESLint & Type Safety**: Menghapus tipe `any` pada penanganan exception kamera `QRScannerGate`, membersihkan variabel yang tidak terpakai di seluruh komponen, dan menyelaraskan penanganan hidrasi localStorage di `VoteContext` agar lolos 100% verifikasi ESLint.

## [0.2.0] - 2026-11-13

### Added
- **Layar Scan QR Gerbang Pemilih (`QRScannerGate`)**: Pemindaian QR kartu suara via kamera langsung (webcam/HP) menggunakan `jsQR` dan dukungan pemindai barcode USB/manual NIK sebelum membuka surat suara.
- **Fitur Cetak Kartu QR Pemilih (`/cetak-qr`)**: Halaman cetak kartu pemilih format resmi C6 digital dilengkapi kode QR vektor tajam berbasis DPT untuk pencetakan kertas A4.
- **Nama dan Gelar Kandidat**: Menampilkan nama lengkap dan gelar resmi di bawah foto pada kartu surat suara fisik digital.
- **Layar Cetak Struk Minimalis (`ThermalReceipt`)**: Desain ulang simulasi struk termal VVPAT layar penuh yang bersih, transparan, dan otomatis beralih kembali ke pemindai QR untuk pemilih berikutnya.
- **Lambang Resmi Kabupaten Subang (`CrestSubang`)**: Komponen vektor SVG presisi lambang daerah dengan moto *Karya Bhumi Bhakti*.
- **Drawer Menu Kiosk Panitia (`KioskDrawer`)**: Akses tersembunyi bagi petugas KPPS untuk membuka Meja KPPS, Rekapitulasi Suara, Cetak QR, dan Reset Data.
- **Unit Testing Lengkap**: 30 pengujian unit otomatis mencakup validasi DPT, data kandidat, lambang daerah, komponen kartu suara, utilitas QR, struk VVPAT, dan kartu cetak.

### Changed
- **Redesign Presisi 100% Surat Suara**: Tampilan bilik suara dibuat minimalis sesuai gambar referensi kertas suara resmi berlatar gradasi *mint* lembut dan tombol bilah bawah `PILIH KANDIDAT INI`.
- **Alur Pemilihan Dua Tahap**: Menyentuh kartu calon hanya memilih kandidat tanpa langsung memunculkan popup konfirmasi; popup baru muncul ketika tombol merah bawah ditekan.
- **Branch Default Git**: Migrasi cabang utama git lokal dari `master` ke `main`.
- **Integrasi Pas Foto Calon No. 02**: Menampilkan pas foto resmi berlatar belakang merah untuk Calon No. 02 (Uly Emarita AD, S.E., M.M.).

### Removed
- **Fitur Suara & Audio**: Menghapus seluruh efek suara beep, synthesizer text-to-speech, dan toggle audio untuk mode bilik hening minimalis.

## [0.1.0] - 2026-11-04
### Added
- Inisialisasi awal proyek Next.js dengan Create Next App dan konfigurasi Tailwind CSS.
