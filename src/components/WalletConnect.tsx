import React, { useState } from 'react';

const WalletConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectWallet = () => {
    // Placeholder for wallet connection logic
    setIsConnected(true);
  };

  return (
    <div className="mb-6 text-center">
      {isConnected ? (
        <div className="text-green-600 font-semibold">Wallet Connected</div>
      ) : (
        <button
          onClick={handleConnectWallet}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
