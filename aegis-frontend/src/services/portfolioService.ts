const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";


export interface TokenBalance {
    tokenAddress: string;
    symbol: string;
    balance: string;
    rawBalance: string;
    decimals: number;
}

export const fetchPortfolio = async (address: string): Promise<TokenBalance[]> => {
    const response = await fetch(`${BACKEND_URL}/portfolio/${address}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const analyzePortfolio = async (portfolio: TokenBalance[]): Promise<string> => {
    const response = await fetch(`${BACKEND_URL}/analyze-portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio }),
    });
    if (!response.ok) {
        throw new Error('Failed to get analysis from AI.');
    }
    const data = await response.json();
    return data.analysis;
};