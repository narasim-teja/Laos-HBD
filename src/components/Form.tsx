import React, { useState } from 'react';
import WalletConnect from './WalletConnect';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ethers } from 'ethers';
import { evolutionCollectionFactoryABI, evolutionCollectionABI } from '../abi.ts';
import { getWeb3Provider,getSigner, } from '@dynamic-labs/ethers-v6'
import { uploadMetadataToIPFS } from '../ipfs';


const Form: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [predefinedImage, setPredefinedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const predefinedImages = [
    '/images/image1.jpg',
    '/images/image2.jpg',
    '/images/image3.jpg',
  ];

  const {primaryWallet} = useDynamicContext();

  const getProviderAndSigner = async () => {
    const provider = await getWeb3Provider(primaryWallet)
    const signer = await getSigner(primaryWallet)
    return { provider, signer };
  };

  // Generates a random integer between 0 and max
function getRandomBigInt(max) {
    return (BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) ** 2n) % BigInt(max);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!primaryWallet) {
      alert('Please connect your wallet.');
      setIsLoading(false);
      return;
    }

    try {
      // Get provider and signer
      const { provider, signer } = await getProviderAndSigner();
      console.log(provider)
      if (!provider || !signer) {
        alert('Failed to get provider or signer.');
        setIsLoading(false);
        return;
      }

      // Switch to Laos Network if necessary
      if (primaryWallet?.connector.supportsNetworkSwitching()) {
        await primaryWallet.switchNetwork(62850);
        console.log("Success! Network switched");
      }

    //   // EvolutionCollectionFactory contract instance
    //   const factoryAddress = '0x0000000000000000000000000000000000000403';
    //   const factoryContract = new ethers.Contract(factoryAddress, evolutionCollectionFactoryABI, signer);
    //   console.log(factoryContract)

      // Create collection if not already created
      const currentCollectionAddress = "0xfffffffffffffffffffffffe00000000000000d1"; 

      const collectionContract = new ethers.Contract(currentCollectionAddress, evolutionCollectionABI, signer);
      console.log(collectionContract, "collection contract")

    //   // Prepare tokenURI
    //   let imageFile = null;

    //   if (image) {
    //     imageFile = image;
    //   } else if (predefinedImage) {
    //     const response = await fetch(predefinedImage);
    //     const blob = await response.blob();
    //     imageFile = new File([blob], 'predefinedImage.jpg', { type: blob.type });
    //   } else {
    //     alert('Please select or upload an image.');
    //     setIsLoading(false);
    //     return;
    //   }

      // using the already created tokenURI for testing purposes
      const tokenURI = "ipfs://QmdBGXMC7YzqhBysdiB8m2JHrb4BKHSduFCHXbnekAkAoy" //await uploadMetadataToIPFS({ name, message, image: imageFile });
      console.log(tokenURI)

      // Mint the NFT
      const _to = walletAddress;
      const _slot = getRandomBigInt(2n ** 96n - 1n); 

      const txMint = await collectionContract.mintWithExternalURI(_to, _slot, tokenURI);
    console.log('Mint transaction:', txMint);

    // Wait for the transaction to be mined
    const receipt = await txMint.wait();
    console.log('Transaction receipt:', receipt);

    // Parse the logs to find the MintedWithExternalURI event
    let tokenId;
    for (const log of receipt.logs) {
      try {
        const parsedLog = collectionContract.interface.parseLog(log);
        if (parsedLog.name === 'MintedWithExternalURI') {
          tokenId = parsedLog.args._tokenId;
          break;
        }
      } catch (e) {
        // Ignore logs that are not from this contract
      }
    }
    if (tokenId) {
        console.log('Minted token ID:', tokenId.toString());
        alert(`NFT minted successfully! Token ID: ${tokenId.toString()}`);
      } else {
        console.error('MintedWithExternalURI event not found in transaction logs.');
        alert('NFT minted successfully, but token ID could not be retrieved.');
      }
    } catch (error: any) {
      console.error('An error occurred during minting:', error);
      alert(`An error occurred during minting: ${error.message || error}`);
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Laos-HBD</h1>
      <WalletConnect />
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Message Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Message</label>
          <textarea
            className="mt-1 p-2 w-full border rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Wallet Address Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Wallet Address</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
          />
        </div>

        {/* Image Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Choose an Image</label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {predefinedImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Predefined ${index}`}
                className={`cursor-pointer border ${
                  predefinedImage === img ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => {
                  setPredefinedImage(img);
                  setImage(null);
                }}
              />
            ))}
          </div>
          <div className="mb-2 text-center">Or Upload Your Own Image</div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                if (file.size <= 5 * 1024 * 1024) {
                  setImage(file);
                  setPredefinedImage('');
                } else {
                  alert('File size exceeds 5MB.');
                }
              }
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Minting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Form;
