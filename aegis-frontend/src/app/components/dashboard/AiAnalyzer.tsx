'use client';

import { analyzePortfolio, TokenBalance } from '@/services/portfolioService';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // <-- Import useQueryClient
import { useAccount } from 'wagmi';
import ReactMarkdown from 'react-markdown';

export function AiAnalyzer() {
    const { address } = useAccount();
    const queryClient = useQueryClient(); // <-- Get the query client instance

    // 👇 THE CHANGE IS HERE: Use getQueryData to read from the cache synchronously 👇
    const portfolio = queryClient.getQueryData<TokenBalance[]>(['portfolio', address]);

    const { mutate, data: analysis, isPending, error } = useMutation({
        mutationFn: () => analyzePortfolio(portfolio!),
    });

    const hasPortfolio = portfolio && portfolio.length > 0;

    return (
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-bold">AI Guardian Analysis</h2>
            <button
                onClick={() => mutate()}
                disabled={isPending || !hasPortfolio}
                className="w-full px-4 py-2 bg-purple-600 rounded hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Analyzing...' : 'Analyze My Portfolio'}
            </button>
            {error && <p className="text-red-400">Analysis failed. Please try again.</p>}
            {analysis && (
                <div className="prose prose-sm prose-invert bg-gray-900 p-4 rounded-md max-w-none">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}