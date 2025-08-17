'use client';
import { AiAnalyzer } from './components/dashboard/AiAnalyzer';
import { PortfolioDisplay } from './components/dashboard/PortfolioDisplay';
import { useAccount } from 'wagmi';

export default function DashboardPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold">Welcome to Aegis Wallet</h1>
        <p className="text-gray-400 mt-2">Please connect your wallet to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <PortfolioDisplay />
      <AiAnalyzer />
    </div>
  );
}