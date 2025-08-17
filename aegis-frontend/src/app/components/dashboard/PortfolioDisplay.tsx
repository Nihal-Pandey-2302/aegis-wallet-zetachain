'use client';

import { fetchPortfolio, TokenBalance } from '@/services/portfolioService';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export function PortfolioDisplay() {
    const { address } = useAccount();

    const { data: portfolio, isLoading, error, refetch } = useQuery<TokenBalance[]>({
        queryKey: ['portfolio', address],
        queryFn: () => fetchPortfolio(address!),
        enabled: !!address, // Only run the query if the address is available
    });

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Vault Portfolio</h2>
                <button onClick={() => refetch()} className="text-sm text-cyan-400 hover:underline">Refresh</button>
            </div>
            {isLoading && <p>Loading assets...</p>}
            {error && <p className="text-red-400">Failed to load portfolio.</p>}
            {portfolio && (
                <div className="space-y-2">
                    {portfolio.length > 0 ? (
                        portfolio.map(token => (
                            <div key={token.tokenAddress} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                                <span className="font-bold">{token.symbol}</span>
                                <span>{parseFloat(token.balance).toFixed(4)}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No assets found in your vault.</p>
                    )}
                </div>
            )}
        </div>
    );
}