# Changelog

Semua perubahan penting pada proyek **ElDigi Pagaden** (Simulasi E-Voting Pilkades Desa Pagaden) dicatat dalam dokumen ini.
Format ini mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan mematuhi [Semantic Versioning](https://semver.org/lang/id/).

## [Unreleased]

## [0.4.1] - 2026-11-14

### Changed
- **Warna Tombol Konfirmasi "YA, YAKIN" (`ConfirmationModal`)**:
  - Mengubah styling tombol konfirmasi "YA, YAKIN" dari warna merah menjadi warna hijau (`bg-emerald-600 hover:bg-emerald-700 border-emerald-600 shadow-emerald-600/30`) agar selaras dengan palet hijau aplikasi dan memberikan indikasi visual positif/persetujuan yang tepat bagi pemilih.
  - Menambahkan styling kursor interaktif (`cursor-pointer`) pada tombol Batal dan tombol Ya.
  - Memperbarui pengujian unit otomatis pada `ConfirmationModal.test.ts` untuk memastikan warna hijau tombol terverifikasi secara konsisten.

## [0.4.0] - 2026-11-13

### Added
- **Layar Konfirmasi Terima Kasih & Penyimpanan Suara (`ThermalReceipt` & `BilikSuaraPage`)**: 
  - Menampilkan layar ucapan terima kasih resmi berukuran besar ("TERIMA KASIH") dengan pesan konfirmasi "Pilihan Anda Tersimpan" langsung setelah pemilih mengonfirmasi pilihannya di bilik suara.
  - Ikon lencana verifikasi sukses hijau (`CheckCircle2`), lencana identitas pemilih aktif, serta efek perayaan confetti.
  - Dukungan dwibahasa penuh: Bahasa Indonesia ("TERIMA KASIH • Pilihan Anda Tersimpan") dan Bahasa Sunda ("HATUR NUHUN • Pilihan Anjeun Parantos Kasimpen").
- **Hitung Mundur Otomatis 5 Detik & Transisi Kembali ke Pemindai QR**:
  - Penambahan animasi progress bar dan timer hitung mundur dari 5 detik hingga 0 detik ("Otomatis kembali ke halaman scan QR dalam 5 detik").
  - Otomatis mereset sesi bilik suara dan kembali ke gerbang pemindaian QR code (`QRScannerGate`) setelah 5 detik, serta tombol manual "Scan QR Baru" untuk melanjutkan tanpa menunggu.
- **Unit Test Komprehensif**: Penambahan pengujian unit otomatis baru (total 52 tests pada 13 file pengujian, 100% lulus) mencakup pengujian pesan terima kasih, waktu mundur 5 detik, lokalisasi Sunda, pencegahan pemungutan suara ganda (`VoteContext`), dan dialog konfirmasi.

### Fixed
- **Perbaikan Siklus Hidup Sesi Pemilih (`VoteContext` & `bilik/page.tsx`)**:
  - Mengoreksi penanganan `activeVoter` pada fungsi `castVote()` agar identitas pemilih tetap terjaga dengan status `sudah_memilih` selama layar terima kasih ditampilkan, sebelum dibersihkan secara bersih oleh `completeActiveVoter()`.
  - Memprioritaskan render layar struk/terima kasih sebelum evaluasi gerbang QR, mencegah pemotongan atau loncatan tampilan yang terlalu dini ke halaman scan QR.

## [0.3.1] - 2026-11-13

### Added
- **Integrasi Lambang Resmi Kabupaten Subang (`CrestSubang`)**: Mengintegrasikan gambar lambang daerah resmi beresolusi tinggi dengan semboyan resmi *Benteng Pancasila* dan *Karya Utama Satya Negara* (perisai hijau berbingkai emas dengan bintang kuning, pohon beringin, dan benteng biru) yang bersumber dari gambar resmi yang diberikan pengguna.
- **Penerapan Lambang di Berbagai Titik Kunci Aplikasi**:
  - **Layar Bilik Suara (`/bilik`)**: Lambang resmi ditampilkan di bagian atas surat suara digital.
  - **Layar Gerbang Pemindai QR (`QRScannerGate`)**: Lambang resmi ditampilkan di atas header pemindai.
  - **Struk Fisik VVPAT (`ThermalReceipt`)**: Lambang resmi disematkan pada kop cetak struk termal hasil pemilihan suara.
  - **Kartu DPT & QR Pemilih (`/cetak-qr`)**: Lambang resmi tertera pada setiap kartu pemilih C6 digital siap cetak.
  - **Meja Pendaftaran KPPS (`/kpps`)**: Lambang resmi disematkan pada header informasi wilayah TPS.
  - **Model C1 Elektronik (`/rekapitulasi`)**: Lambang resmi menghiasi kop Berita Acara pemungutan suara resmi.
  - **Bilah Navigasi (`Navbar`)**: Lambang resmi ditampilkan di samping tombol kembali surat suara.
- **Pembaruan Unit Test (`CrestSubang.test.ts`)**: Pengujian otomatis diperbarui untuk memverifikasi semboyan asli *BENTENG PANCASILA* dan *KARYA UTAMA SATYA NEGARA* serta tautan aset gambar resmi.

## [0.3.0] - 2026-11-13

### Added
- **Desain Responsif Multi-Device Penuh**: Optimasi menyeluruh agar antarmuka tampil sempurna di Komputer/PC, Laptop, Tablet, dan Ponsel (Smartphone), baik dalam orientasi **Portrait** maupun **Landscape**.
- **Navigasi Mobile Responsif (`Navbar`)**: Penambahan bilah geser cepat horizontal (*quick tab scroll*) serta menu drawer mobile (*hamburger menu*) dengan indikator suara masuk dan penyesuaian label otomatis pada layar kecil.
- **Konfigurasi Viewport Standar Next.js (`layout.tsx`)**: Integrasi ekspor `viewport: Viewport` dengan `viewportFit: cover`, `width: device-width`, dan safe area padding (`pb-safe`, `pt-safe`) untuk perangkat ber-notch/home indicator.
- **Unit Test Komponen Navbar (`Navbar.test.ts`)**: 3 pengujian unit baru yang memverifikasi isolasi bilik suara (mode hening tanpa navbar) dan fungsionalitas navigasi responsif pada Meja KPPS dan Rekapitulasi.

### Changed
- **Adaptasi Orientasi Layar Bilik Suara (`BilikSuaraPage`)**: 
  - Mode Landscape (Tablet / HP / Laptop): 3 kartu calon otomatis berjejer rapi dalam 1 baris (*side-by-side*) dengan ukuran foto proporsional sehingga seluruh surat suara dan tombol konfirmasi muat dalam satu layar tanpa perlu scroll berlebihan.
  - Mode Portrait HP: Kartu calon tersusun vertikal yang ramah sentuhan (*touch-friendly*) dengan tombol merah `PILIH KANDIDAT INI` yang selalu menempel di dasar layar (*sticky bottom bar*).
- **Responsivitas Pemindai QR (`QRScannerGate`)**: Viewfinder kamera dinamis yang menyesuaikan layar kecil (`320px` hingga layar landscape pendek), form input barcode USB yang otomatis menyesuaikan ruang, dan tata letak simulasi pemilih yang fleksibel.
- **Dialog Modal & Cetak Struk Responsif (`ConfirmationModal` & `ThermalReceipt`)**: Batasan tinggi maksimum adaptif (`max-h-[92vh] overflow-y-auto`) dengan padding ringkas pada mode landscape agar tombol aksi tidak pernah terpotong.
- **Penyelarasan Meja KPPS, Rekapitulasi & Cetak QR (`/kpps`, `/rekapitulasi`, `/cetak-qr`)**: Grid statistik adaptif (2 kolom di HP, 4 kolom di layar lebar), tabel DPT anti-patah kata (`whitespace-nowrap`), dan kartu rekapitulasi yang tetap nyaman dibaca di tablet portrait.

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
