import React, { useState } from 'react';
import WalletConnect from './WalletConnect';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ethers } from 'ethers';
import { evolutionCollectionABI } from '../abi.ts';
import { getWeb3Provider, getSigner } from '@dynamic-labs/ethers-v6';
import { uploadMetadataToIPFS } from '../ipfs';
import { CloudUploadIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import { isHex } from '@dynamic-labs/utils';
import Testnet from './Testnet.tsx';
import Laos from './Laos.tsx';

const isValidEVMAddress = (address: string): boolean => {
  return isHex(address) && address.length === 42 && address.startsWith('0x');
};

const Form: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Added state for preview
  const [predefinedImage, setPredefinedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidWalletAddress, setIsValidWalletAddress] = useState(true);

  const predefinedImages = [
    '/images/image1.jpg',
    '/images/image2.jpg',
    '/images/image3.jpg',
  ];

  const {primaryWallet} = useDynamicContext();

  const getProviderAndSigner = async () => {
    const provider = await getWeb3Provider(primaryWallet);
    const signer = await getSigner(primaryWallet);
    return { provider, signer };
  };

  function getRandomBigInt(max) {
    return (BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) ** 2n) % BigInt(max);
  }

  const validateWalletAddress = (address: string) => {
    const isValid = isValidEVMAddress(address);
    setIsValidWalletAddress(isValid);
    return isValid;
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setWalletAddress(address);
    validateWalletAddress(address);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 5 * 1024 * 1024) {
        setImage(file);
        setPredefinedImage(''); // Reset predefined images
        setImagePreview(URL.createObjectURL(file)); // Create preview URL
      } else {
        alert('File size exceeds 5MB.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateWalletAddress(walletAddress)) {
      alert('Please enter a valid EVM wallet address.');
      return;
    }

    setIsLoading(true);

    if (!primaryWallet) {
      alert('Please connect your wallet.');
      setIsLoading(false);
      return;
    }

    try {
      const { provider, signer } = await getProviderAndSigner();
      if (!provider || !signer) {
        alert('Failed to get provider or signer.');
        setIsLoading(false);
        return;
      }

      if (primaryWallet?.connector.supportsNetworkSwitching()) {
        await primaryWallet.switchNetwork(62850);
      }

      const currentCollectionAddress = "0xfffffffffffffffffffffffe00000000000000d1";
      const collectionContract = new ethers.Contract(currentCollectionAddress, evolutionCollectionABI, signer);

      let imageFile = null;
      if (image) {
        imageFile = image;
      } else if (predefinedImage) {
        const response = await fetch(predefinedImage);
        const blob = await response.blob();
        imageFile = new File([blob], 'predefinedImage.jpg', { type: blob.type });
      } else {
        alert('Please select or upload an image.');
        setIsLoading(false);
        return;
      }

      const tokenURI = await uploadMetadataToIPFS({ name, message, image: imageFile });
      const _to = walletAddress;
      const _slot = getRandomBigInt(2n ** 96n - 1n);

      const txMint = await collectionContract.mintWithExternalURI(_to, _slot, tokenURI);
      const receipt = await txMint.wait();

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
        alert(`NFT minted successfully! Token ID: ${tokenId.toString()}`);
      } else {
        alert('NFT minted successfully, but token ID could not be retrieved.');
      }
    } catch (error: any) {
      console.error('An error occurred during minting:', error);
      alert(`An error occurred during minting: ${error.message || error}`);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-90 p-8 rounded shadow-md w-full max-w-md font-inter">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Laos-HBD</h1>
        <WalletConnect />
        <Testnet />
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              className="mt-1 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>

          {/* Message Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              className="mt-1 p-3 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Happy birthday, John! Here's to celebrating you!"
            ></textarea>
          </div>

          {/* Wallet Address Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium">Wallet Address</label>
            <input
              type="text"
              className={`mt-1 p-3 w-full border rounded focus:outline-none focus:ring-2 ${
                isValidWalletAddress ? 'focus:ring-blue-500' : 'focus:ring-red-500 border-red-500'
              }`}
              value={walletAddress}
              onChange={handleWalletAddressChange}
              required
            />
            {!isValidWalletAddress && (
              <p className="mt-1 text-red-500 text-sm">Please enter a valid EVM wallet address.</p>
            )}
          </div>

          {/* Image Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Choose an Image</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {predefinedImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Predefined ${index}`}
                  className={`cursor-pointer border rounded-lg w-full h-32 object-cover ${
                    predefinedImage === img ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  onClick={() => {
                    setPredefinedImage(img);
                    setImage(null);
                    setImagePreview(img); // Set preview for predefined images
                  }}
                />
              ))}
            </div>

            {/* Enhanced Upload Section */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Or Upload Your Own Image</label>
              <div
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <CloudUploadIcon className="h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
              <input
                id="fileInput"
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Display the image preview */}
            {imagePreview && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Image Preview</label>
                <img src={imagePreview} alt="Uploaded Preview" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors duration-300 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Minting...' : 'Submit'}
          </button>
          <Laos/>
        </form>
      </div>
    </div>
  );
};

export default Form;
