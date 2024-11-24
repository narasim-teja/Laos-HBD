# Laos HBD - NFT Birthday Card Minter

A decentralized application (dApp) that allows users to create and mint personalized birthday NFTs on the Polygon network, powered by [Laos Network](https://laosnetwork.io/). Send unique birthday wishes that live forever on the blockchain!

## Features

- 🎨 Create personalized birthday NFT cards
- 🖼️ Choose from predefined images or upload your own
- 👛 Support for both wallet addresses and ENS names
- ⛽ Gas-free minting on Polygon network
- 🔗 Powered by Laos Network infrastructure
- 🌐 View your minted NFTs on [OpenSea Collection](https://opensea.io/collection/hbd-collection-1)


## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/laos-hbd.git
   cd laos-hbd
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables in the `.env` file:
   - VITE_PINATA_JWT (for IPFS storage)
   - VITE_API_KEY (for Laos Network)
   - VITE_DYNAMIC_ENVIRONMENT_ID (for wallet connection)
   - VITE_ALCHEMY_API_KEY (for ENS resolution)

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

## Usage

1. Connect your Web3 wallet using the "Connect Wallet" button
2. Fill in the recipient's details (name and wallet address/ENS)
3. Write your birthday message
4. Choose a predefined image or upload your own
5. Click "Submit" to mint your NFT
6. View your minted NFT on OpenSea

## Technology Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Ethers.js/Viem
- IPFS (via Pinata)
- Laos Network Infrastructure

## Important Links

- [Laos Network](https://laosnetwork.io/)
- [OpenSea Collection](https://opensea.io/collection/hbd-collection-1)
- [Project Documentation](https://docs.laosnetwork.io/)