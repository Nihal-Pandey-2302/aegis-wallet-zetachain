require('dotenv').config();
const express = require('express');
const { ethers , getAddress } = require('ethers');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const PORT = process.env.PORT || 3001;
const contractAddress = "0xe39d3f45873CCa6EC1364f726b5a71c061FD59D8";
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"Unauthorized","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"tokenIn","type":"address"},{"indexed":true,"internalType":"address","name":"tokenOut","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"UNISWAP_ROUTER","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"zrc20","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"gateway","outputs":[{"internalType":"contract IGatewayZEVM","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"sender","type":"bytes"},{"internalType":"address","name":"senderEVM","type":"address"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"internalType":"struct MessageContext","name":"context","type":"tuple"},{"internalType":"address","name":"zrc20","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"message","type":"bytes"}],"name":"onCall","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"sender","type":"bytes"},{"internalType":"address","name":"senderEVM","type":"address"},{"internalType":"uint256","name":"chainID","type":"uint256"}],"internalType":"struct MessageContext","name":"","type":"tuple"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onCall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"registry","outputs":[{"internalType":"contract ICoreRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"swap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"userBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"zrc20Address","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const provider = new ethers.JsonRpcProvider(process.env.ZETACHAIN_RPC_URL);
const aegisContract = new ethers.Contract(contractAddress, contractABI, provider);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// For the hackathon, we'll query a predefined list of popular ZRC-20 tokens.
// For the hackathon, we'll query a predefined list of popular ZRC-20 tokens.
// THIS LIST HAS BEEN CORRECTED FOR CHECKSUM ERRORS.
const ZRC20_TOKENS_RAW = [
    { address: '0x5f0b1a82749cb4e2278ec87f8bf6b618dc71a8bf', symbol: 'WZETA', decimals: 18 },
    { address: '0x13a0c5930c028511dc02665e7285134b6d11a5f4', symbol: 'ETH.ETH', decimals: 18 },
    { address: '0x65a45c57636f9bcced4fe193a6020085782a6a84', symbol: 'BTC.BTC', decimals: 8 },
    { address: '0x7c8dda808269143a4835a51732955f106363b834', symbol: 'USDT.ETH', decimals: 6 }
];

const ZRC20_TOKENS = ZRC20_TOKENS_RAW.map(token => ({
    ...token,
    address: getAddress(token.address) 
}));
// --- API ENDPOINTS ---

/**
 * @route   GET /portfolio/:userAddress
 * @desc    Fetches all known token balances for a user from the AegisVault contract.
 */
app.get('/portfolio/:userAddress', async (req, res) => {
    const { userAddress } = req.params;
    if (!ethers.isAddress(userAddress)) {
        return res.status(400).json({ error: 'Invalid user address' });
    }

    try {
        console.log(`Fetching portfolio for ${userAddress}...`);
        const portfolio = [];

        for (const token of ZRC20_TOKENS) {
            const balance = await aegisContract.userBalances(userAddress, token.address);
            if (balance > 0) {
                portfolio.push({
                    tokenAddress: token.address,
                    symbol: token.symbol,
                    balance: ethers.formatUnits(balance, token.decimals),
                    rawBalance: balance.toString(),
                    decimals: token.decimals,
                });
            }
        }
        console.log("Portfolio fetched successfully:", portfolio);
        res.json(portfolio);
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio data.' });
    }
});

/**
 * @route   POST /analyze-portfolio
 * @desc    Analyzes portfolio data using the Gemini AI.
 */
app.post('/analyze-portfolio', async (req, res) => {
    const { portfolio } = req.body;

    if (!portfolio || portfolio.length === 0) {
        return res.status(400).json({ error: 'Portfolio data is required.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const portfolioString = portfolio.map(t => `${t.balance} ${t.symbol}`).join(', ');

        const prompt = `
            You are "Aegis Guardian," a highly specialized AI crypto portfolio analyst.
            Your analysis must be strategic, insightful, and clear, tailored for a user of a cross-chain smart wallet.
            Do not give financial advice, but provide a strategic analysis.
            
            Analyze the following portfolio from the Aegis Vault on ZetaChain: ${portfolioString}.

            Based on this data, provide:
            1.  **Portfolio Snapshot:** A brief, one-sentence summary of the portfolio's composition.
            2.  **Strategic Observations:** Two to three bullet points highlighting key aspects, such as concentration in certain assets (like stablecoins vs. volatile assets), potential for diversification, or exposure to specific ecosystems (e.g., BTC, ETH).
            3.  **Potential Actions & Rationale:** Suggest two potential actions the user might consider within the Aegis Vault (e.g., "Consider swapping a portion of X for Y to..."). Explain the strategic rationale behind each suggestion (e.g., "to gain exposure to..." or "to hedge against...").
            4.  **Aegis Guardian Tip:** Provide one general, forward-looking tip related to cross-chain strategy or DeFi security.

            Format your response cleanly using markdown.
        `;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ analysis: text });
    } catch (error) {
        console.error("Error analyzing portfolio:", error);
        res.status(500).json({ error: 'Failed to get analysis from AI.' });
    }
});


app.listen(PORT, () => {
    console.log(`Aegis backend server running on port ${PORT}`);
});