'use client';

// Define the props the component will accept
type TransactionStatusProps = {
  hash?: `0x${string}`;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  error?: Error | null;
};

export function TransactionStatus({ hash, isPending, isConfirming, isConfirmed, error }: TransactionStatusProps) {
  // Don't render anything if there's no activity
  if (!hash && !isPending && !error) return null;

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 text-sm">
      {isPending && <p className="text-yellow-400">Please confirm in your wallet...</p>}
      {hash && (
        <div className="flex justify-between items-center">
          <p>Transaction Hash:</p>
          <a
            href={`https://athens3.zetascan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline truncate ml-4"
          >
            {`${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`}
          </a>
        </div>
      )}
      {isConfirming && <p className="mt-2 text-yellow-400">Waiting for confirmation...</p>}
      {isConfirmed && <p className="mt-2 text-green-400">Transaction Confirmed! ✅</p>}
      {error && <p className="mt-2 text-red-400">Error: {(error as any).shortMessage || error.message}</p>}
    </div>
  );
}