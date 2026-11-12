import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { VoteProvider } from '@/context/VoteContext';
import { Navbar } from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SURAT SUARA - PEMILIHAN KEPALA DESA',
  description:
    'Sistem Surat Suara Digital (e-Voting) Pemilihan Kepala Desa Pagaden, Kecamatan Pagaden, Kabupaten Subang.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} ${inter.variable} min-h-screen bg-[#f3f7f5] text-slate-900 flex flex-col antialiased`}>
        <VoteProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </VoteProvider>
      </body>
    </html>
  );
}
