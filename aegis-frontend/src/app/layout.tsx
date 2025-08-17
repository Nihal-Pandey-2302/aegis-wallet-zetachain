import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast'; 
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './components/ui/Providers';
import { Header } from './components/layout/Header';
import { Space_Grotesk } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Aegis Wallet',
  description: 'AI-Powered Cross-Chain Guardian',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.className} bg-gray-900 text-white`}>
        <Providers>
          <Toaster position="bottom-right" /> {/* <-- Add Toaster here */}
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}