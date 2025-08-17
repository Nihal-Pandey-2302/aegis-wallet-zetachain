'use client';

import { useAccount, useWriteContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { parseUnits } from 'viem';
import { fetchPortfolio, TokenBalance } from '@/services/portfolioService';
import { AEGIS_VAULT_ADDRESS, AEGIS_VAULT_ABI } from '@/lib/constants';
import toast from 'react-hot-toast'; // <-- Import toast

export function WithdrawForm() {
  const { address } = useAccount();
  const [selectedToken, setSelectedToken] = useState<TokenBalance | null>(null);
  const [amount, setAmount] = useState('');

  // The hook now gives us an async function perfect for toasts
  const { isPending, writeContractAsync } = useWriteContract();

  // Fetch user's portfolio to populate the dropdown
  const { data: portfolio, isLoading: isLoadingPortfolio, refetch } = useQuery<TokenBalance[]>({
    queryKey: ['portfolio', address],
    queryFn: () => fetchPortfolio(address!),
    enabled: !!address,
  });

  // Set the default selected token once the portfolio loads
  useEffect(() => {
    if (portfolio && portfolio.length > 0 && !selectedToken) {
      setSelectedToken(portfolio[0]);
    }
  }, [portfolio, selectedToken]);

  // Make the handler async
  const handleWithdraw = async () => {
    if (!selectedToken || !amount) return;
    const amountAsBigInt = parseUnits(amount, selectedToken.decimals);

    // Wrap the async contract call with toast.promise
    await toast.promise(
      writeContractAsync({
        address: AEGIS_VAULT_ADDRESS,
        abi: AEGIS_VAULT_ABI,
        functionName: 'withdraw',
        args: [selectedToken.tokenAddress as `0x${string}`, amountAsBigInt],
      }),
      {
        loading: 'Confirming transaction...',
        success: () => {
          // Refetch portfolio data on success
          refetch();
          return 'Withdrawal successful!';
        },
        error: (err) => err.shortMessage || 'Transaction failed.',
      }
    );
  };
  
  const handleTokenChange = (tokenAddress: string) => {
    const token = portfolio?.find(t => t.tokenAddress === tokenAddress);
    setSelectedToken(token || null);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-center">Withdraw Assets</h2>
        {/* Token Selection Dropdown and Amount Input remain the same */}
        <div className="space-y-2">
          <label htmlFor="token" className="text-sm font-medium text-gray-400">Token</label>
          <select
            id="token"
            value={selectedToken?.tokenAddress || ''}
            onChange={(e) => handleTokenChange(e.target.value)}
            disabled={isLoadingPortfolio || !portfolio || portfolio.length === 0}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            {isLoadingPortfolio ? (
              <option>Loading tokens...</option>
            ) : (
              portfolio?.map(token => (
                <option key={token.tokenAddress} value={token.tokenAddress}>
                  {token.symbol}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium text-gray-400">Amount</label>
          <input
            id="amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
        <button
          onClick={handleWithdraw}
          disabled={isPending || !selectedToken || !amount}
          className="w-full py-3 px-4 bg-cyan-600 font-semibold rounded-md hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Confirming...' : 'Withdraw'}
        </button>
      </div>
      {/* The old TransactionStatus component is no longer needed */}
    </div>
  );
}