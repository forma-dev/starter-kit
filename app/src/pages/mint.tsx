import type { NextPage } from 'next';
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { MyERC721ABI } from '@/abi/MyERC721.abi';

// Types for NFT metadata
type Attribute = {
  trait_type: string;
  value: string;
};

type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  thumbnail: string;
  tags: string[];
  attributes: Attribute[];
};

type FieldErrors = {
  name?: string;
  description?: string;
  image?: string;
};

const Mint: NextPage = () => {
  const { address } = useAccount();
  const [metadata, setMetadata] = useState<NFTMetadata>({
    name: '',
    description: '',
    image: '',
    thumbnail: '',
    tags: [],
    attributes: [],
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const [newTag, setNewTag] = useState('');
  const [newAttribute, setNewAttribute] = useState<Attribute>({
    trait_type: '',
    value: '',
  });

  const addTag = () => {
    if (newTag.trim()) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addAttribute = () => {
    if (newAttribute.trait_type && newAttribute.value) {
      setMetadata(prev => ({
        ...prev,
        attributes: [...prev.attributes, { ...newAttribute }],
      }));
      setNewAttribute({ trait_type: '', value: '' });
    }
  };

  const removeAttribute = (index: number) => {
    setMetadata(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const { writeContract: mintNFT, data: mintTxHash } = useWriteContract();
  const { isLoading: isMinting, isSuccess: isMinted } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  const handleMint = () => {
    const newErrors: FieldErrors = {};

    if (!metadata.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!metadata.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!metadata.image.trim()) {
      newErrors.image = 'Image URL is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const metadataString = JSON.stringify(metadata);
      mintNFT({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: MyERC721ABI,
        functionName: 'mint',
        args: [address as `0x${string}`, metadataString],
      });
    }
  };

  if (!address) {
    return (
      <div className="w-full max-w-md p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-blue-700">Connect your wallet to mint an NFT</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-6 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Mint an NFT</h2>
      <div className="flex flex-col gap-4">
        <div>
          <input 
            type="text"
            placeholder="Name"
            value={metadata.name}
            onChange={(e) => {
              setMetadata(prev => ({ ...prev, name: e.target.value }));
              setErrors(prev => ({ ...prev, name: undefined }));
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <textarea 
            placeholder="Description"
            value={metadata.description}
            onChange={(e) => {
              setMetadata(prev => ({ ...prev, description: e.target.value }));
              setErrors(prev => ({ ...prev, description: undefined }));
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] ${
              errors.description ? 'border-red-500' : ''
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <input 
            type="url"
            placeholder="Image URL (e.g, ipfs://...)"
            value={metadata.image}
            onChange={(e) => {
              setMetadata(prev => ({ ...prev, image: e.target.value }));
              setErrors(prev => ({ ...prev, image: undefined }));
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.image ? 'border-red-500' : ''
            }`}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
        </div>

        <input 
          type="url"
          placeholder="Thumbnail URL (optional)"
          value={metadata.thumbnail}
          onChange={(e) => setMetadata(prev => ({ ...prev, thumbnail: e.target.value }))}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="border-t pt-4 mt-2">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex gap-2 mb-2">
            <input 
              type="text"
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {metadata.tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                <span>{tag}</span>
                <button
                  onClick={() => removeTag(index)}
                  className="text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 mt-2">
          <h3 className="text-lg font-semibold mb-3">Attributes</h3>
          <div className="flex gap-2 mb-2">
            <input 
              type="text"
              placeholder="Trait Type"
              value={newAttribute.trait_type}
              onChange={(e) => setNewAttribute(prev => ({ ...prev, trait_type: e.target.value }))}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input 
              type="text"
              placeholder="Value"
              value={newAttribute.value}
              onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addAttribute}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {metadata.attributes.map((attr, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">{attr.trait_type}</span>
                  <span className="font-medium">{attr.value}</span>
                </div>
                <button
                  onClick={() => removeAttribute(index)}
                  className="text-gray-400 hover:text-red-600 transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-4 disabled:bg-blue-300"
          onClick={handleMint}
          disabled={isMinting}
        >
          {isMinting ? 'Minting...' : isMinted ? 'Minted!' : 'Mint NFT'}
        </button>
      </div>
    </div>
  );
};

export default Mint;
