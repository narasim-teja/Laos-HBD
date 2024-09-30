import React from 'react';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

const WalletConnect: React.FC = () => {
  return (
    <div className="mb-6 flex justify-center items-center">
      <DynamicWidget />
    </div>
  );
};

export default WalletConnect;
