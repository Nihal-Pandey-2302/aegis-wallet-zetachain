'use client';
import { useAccount } from 'wagmi';
import { WithdrawForm } from '../components/forms/WithdrawForm';

export default function WithdrawPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold">Withdraw Assets</h1>
        <p className="text-gray-400 mt-2">Please connect your wallet to proceed.</p>
      </div>
    );
  }

  return <WithdrawForm />;
}