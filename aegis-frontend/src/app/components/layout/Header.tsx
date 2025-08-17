'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/swap', label: 'Swap' },
  { href: '/withdraw', label: 'Withdraw' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full p-4 border-b border-gray-700">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-cyan-400">
            🛡️ Aegis
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        <ConnectButton />
      </nav>
    </header>
  );
}