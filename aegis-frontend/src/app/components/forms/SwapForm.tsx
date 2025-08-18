'use client';

import { useAccount, useWriteContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { parseUnits } from 'viem';
import { fetchPortfolio, TokenBalance } from '@/services/portfolioService';
import { AEGIS_VAULT_ADDRESS, AEGIS_VAULT_ABI, ZRC20_TOKEN_LIST } from '@/lib/constants';
import toast from 'react-hot-toast'; // <-- Import toast

// TransactionStatus is no longer needed and can be deleted

export function SwapForm() {
  const { address } = useAccount();
  const [tokenIn, setTokenIn] = useState<TokenBalance | null>(null);
  const [tokenOutAddress, setTokenOutAddress] = useState('');
  const [amount, setAmount] = useState('');

  // Get the async function for toast notifications
  const { isPending, writeContractAsync } = useWriteContract();
  
  // Get the refetch function to update the portfolio after a successful swap
  const { data: portfolio, isLoading: isLoadingPortfolio, refetch } = useQuery<TokenBalance[]>({
    queryKey: ['portfolio', address],
    queryFn: () => fetchPortfolio(address!),
    enabled: !!address,
  });

  // useEffect logic remains the same
  useEffect(() => {
    if (portfolio && portfolio.length > 0 && !tokenIn) {
      setTokenIn(portfolio[0]);
    }
    if (ZRC20_TOKEN_LIST.length > 0 && !tokenOutAddress) {
        const defaultOut = ZRC20_TOKEN_LIST.length > 1 ? ZRC20_TOKEN_LIST[1].address : ZRC20_TOKEN_LIST[0].address;
        setTokenOutAddress(defaultOut);
    }
  }, [portfolio, tokenIn, tokenOutAddress]);

  // Make the handler async to work with toast.promise
  const handleSwap = async () => {
    if (!tokenIn || !tokenOutAddress || !amount) return;
    if (tokenIn.tokenAddress === tokenOutAddress) {
        toast.error("Cannot swap a token for itself.");
        return;
    }

    const amountAsBigInt = parseUnits(amount, tokenIn.decimals);

    // Wrap the async contract call with toast.promise
    await toast.promise(
        writeContractAsync({
            address: AEGIS_VAULT_ADDRESS,
            abi: AEGIS_VAULT_ABI,
            functionName: 'swap',
            args: [tokenIn.tokenAddress as `0x${string}`, tokenOutAddress as `0x${string}`, amountAsBigInt],
        }),
        {
            loading: 'Confirming transaction in wallet...',
            success: () => {
                // Refetch portfolio data to show the new balances
                refetch();
                return 'Swap successful!';
            },
            error: (err: { shortMessage: string }) => err.shortMessage || 'Transaction failed.',
        }
    );
  };

  const handleTokenInChange = (address: string) => {
    const token = portfolio?.find(t => t.tokenAddress === address);
    setTokenIn(token || null);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-center">Swap Assets</h2>

        {/* FROM Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">From</label>
          <select
            value={tokenIn?.tokenAddress || ''}
            onChange={(e) => handleTokenInChange(e.target.value)}
            disabled={isLoadingPortfolio || !portfolio || portfolio.length === 0}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md"
          >
            {portfolio?.map(token => <option key={token.tokenAddress} value={token.tokenAddress}>{token.symbol}</option>)}
          </select>
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md"
          />
        </div>

        {/* TO Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">To</label>
          <select
            value={tokenOutAddress}
            onChange={(e) => setTokenOutAddress(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md"
          >
            {ZRC20_TOKEN_LIST.map(token => <option key={token.address} value={token.address}>{token.symbol}</option>)}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={isPending || !tokenIn || !tokenOutAddress || !amount}
          className="w-full py-3 px-4 bg-indigo-600 font-semibold rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Confirming...' : 'Swap'}
        </button>
      </div>

      {/* The old TransactionStatus component is no longer needed */}
    </div>
  );
}