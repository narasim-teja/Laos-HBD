/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import WalletConnect from './WalletConnect';

const Form: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [predefinedImage, setPredefinedImage] = useState<string>('');

  const predefinedImages = [
    '/images/image1.jpg',
    '/images/image2.jpg',
    '/images/image3.jpg',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (to be implemented)
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
            accept="image/png, image/jpeg image/jpg"
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
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
