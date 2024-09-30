import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import App from './App.tsx'
import './index.css'

// Setting up list of evmNetworks
const evmNetworks = [
 
  {
    blockExplorerUrls: ['https://sigma.explorer.laosnetwork.io/'],
    chainId: 62850,
    chainName: 'Matic Mainnet',
    iconUrls: ["../Laos_Logo.png"],
    name: 'Laos Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'LAOS SIGMA',
      symbol: 'SIGMA',
    },
    networkId: 62850,
    rpcUrls: ['https://rpc.laossigma.laosfoundation.io'],
    vanityName: 'Laos Sigma',
  }
];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: "d26a13e5-58d2-44a0-9820-f774949d6059",
        walletConnectors: [ EthereumWalletConnectors ],
        overrides: { evmNetworks },
      }}
    >
      <App />
    </DynamicContextProvider>
  </StrictMode>,
)
