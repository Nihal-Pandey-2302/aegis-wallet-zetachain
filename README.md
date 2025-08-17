
# 🛡️ Aegis Wallet: The AI-Powered Cross-Chain Guardian

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ZetaChain](https://img.shields.io/badge/Chain-ZetaChain-10B5F3)](https://www.zetachain.com/)
[![Google Cloud](https://img.shields.io/badge/AI-Google_Cloud-4285F4)](https://cloud.google.com/)

**Aegis Wallet is a full-stack dApp built for the ZetaChain x Google Cloud Buildathon. It acts as an intelligent smart contract vault that leverages the Google Gemini API to provide users with strategic analysis of their on-chain assets.**

---

## 📽️ Demo Video & Screenshots

A brief walkthrough of the Aegis Wallet's core functionality.

*[Insert a link to your 2-3 minute demo video here. A YouTube link or a GIF is perfect.]*


*(Add a screenshot of your polished UI showing the portfolio and the AI analysis)*

---

## ✨ Core Features

* **Smart Contract Vault**: A secure, on-chain vault on ZetaChain to hold and manage ZRC-20 tokens.
* **Cross-Chain Ready**: Built on ZetaChain's universal contract model, designed to handle deposits from any connected chain.
* **On-Chain Swaps**: Integrates with a ZetaChain DEX to allow users to swap assets directly from their vault balance.
* **Seamless Withdrawals**: Users can withdraw their assets from the vault back to their personal wallet at any time.
* **🤖 AI-Powered Analysis**: A one-click button connects to a custom backend that sends the user's portfolio to the **Google Gemini API**. It returns a clean, strategic, and easy-to-understand analysis of their holdings, providing observations and potential actions.

---

## 🛠️ Tech Stack & Architecture

Aegis Wallet is a full-stack application that combines on-chain logic, a backend server, and a modern frontend.

* **Blockchain & Smart Contract**:
    * **Chain**: ZetaChain Athens 3 Testnet
    * **Language**: Solidity
    * **Development**: Remix IDE
    * **Final Contract Address**: `0xe39d3f45873CCa6EC1364f726b5a71c061FD59D8`

* **Backend (The Brain)**:
    * **Runtime**: Node.js
    * **Framework**: Express.js
    * **Web3 Library**: Ethers.js
    * **AI Integration**: Google Gemini API (`@google/generative-ai`)

* **Frontend (The Face)**:
    * **Framework**: Next.js (React)
    * **Language**: TypeScript
    * **Styling**: Tailwind CSS
    * **Web3 Connection**: `wagmi` & `RainbowKit`
    * **UX**: `react-hot-toast` for notifications, `react-markdown` for AI output.

### Application Flow



1.  **User Interface**: The user connects their wallet and interacts with the Next.js frontend.
2.  **On-Chain Actions**: For `swap` or `withdraw`, the frontend directly prompts the user to sign a transaction that calls the AegisVault smart contract.
3.  **Off-Chain Data**: To display the portfolio or get AI analysis, the frontend calls our Node.js backend.
4.  **AI Analysis**: The backend sends the portfolio data to the Google Gemini API and returns the formatted analysis to the frontend.

---

## 🚀 Getting Started: Local Setup

Follow these steps to run the project on your local machine.

### Prerequisites

* Node.js (v18 or later)
* NPM or Yarn
* A Web3 wallet like MetaMask, configured for the ZetaChain Athens 3 Testnet.

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd aegis-backend

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env
````

Now, open the `.env` file and add your secrets:

```
ZETACHAIN_RPC_URL="[https://zetachain-athens-evm.blockpi.network/v1/rpc/public](https://zetachain-athens-evm.blockpi.network/v1/rpc/public)"
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
```

Finally, start the backend server:

```bash
npm start
# Server will be running on http://localhost:3001
```

### 2\. Frontend Setup

```bash
# Navigate to the frontend directory
cd aegis-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
# App will be running on http://localhost:3000
```

### 3\. Funding Your Vault (Demo Method)

Since public testnet tools were unreliable, the contract includes an `airdropTokens` function for demo purposes.

1. Ensure your contract (`0xe39d...`) is verified on ZetaScan.
2. Go to the **"Write Contract"** tab on the ZetaScan page for the contract.
3. Connect your wallet (the same one that deployed the contract).
4. Use the `airdropTokens` function to give yourself a balance of a ZRC-20 token (e.g., `ETH.ETH`).
5. Refresh the Aegis Wallet application, and your balance will appear.

-----

## 📜 The Hackathon Journey

This project was a true test of perseverance. The initial build was straightforward, but the deployment and testing phase was a battle against unreliable RPC nodes, confusing testnet UIs, and obscure transaction errors. This led to a strategic pivot: modifying the smart contract to add a direct deposit and an admin airdrop function. This real-world debugging journey hardened the application and is a testament to the challenges of building on the cutting edge of Web3 infrastructure.

-----

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

```
```
