import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Chain } from 'wagmi/chains';

// Define ZetaChain Athens 3 Testnet
export const zetaChainAthens3 = {
  id: 7001,
  name: 'ZetaChain Athens 3',
  nativeCurrency: { name: 'Zeta', symbol: 'aZETA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://zetachain-athens-evm.blockpi.network/v1/rpc/public'] },
  },
  blockExplorers: {
    default: { name: 'ZetaScan', url: 'https://athens3.zetascan.io' },
  },
} as const satisfies Chain;

/**
 * A truly simple, manual wagmi configuration.
 *
 * 1. `createConfig`: The core function from wagmi to build our config.
 * 2. `chains`: We tell it what network we support.
 * 3. `connectors`: This is the key. We are ONLY providing `injected()`.
 * This tells our app to only look for browser extension wallets (like MetaMask).
 * No other connection options (like WalletConnect QR codes) will be available.
 * 4. `transports`: Specifies how to communicate with the blockchain.
 *
 * Because we are not using any WalletConnect functionality, NO projectId is required.
 */
export const config = createConfig({
  chains: [zetaChainAthens3],
  connectors: [
    injected(),
  ],
  transports: {
    [zetaChainAthens3.id]: http(),
  },
  ssr: true, // For Next.js App Router
});