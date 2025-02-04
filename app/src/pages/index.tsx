import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { MyERC721ABI } from '@/abi/MyERC721.abi';
import { convertIpfsUrl } from '@/utils/ipfs';
import { config } from '@/config';

type ContractMetadata = {
  name: string;
  description: string;
  image?: string;
}

const Home: NextPage = () => {
  const router = useRouter();
  const [metadata, setMetadata] = useState<ContractMetadata | null>(null);
  const contractAddress = config.contractAddress;

  const { data: contractURI } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: MyERC721ABI,
    functionName: 'contractURI',
  });

  useEffect(() => {
    if (contractURI) {
      try {
        const base64Data = contractURI.split(',')[1];
        const jsonString = atob(base64Data);
        const data = JSON.parse(jsonString);
        setMetadata(data);
      } catch (error) {
        console.error('Error parsing contract metadata:', error);
      }
    }
  }, [contractURI]);

  return (
    <>
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Forma Starter Kit
        </h1>
        <p className="text-xl text-gray-600">
          Get started with NFTs on Forma
        </p>
      </div>

      {contractAddress ? (
        <div className="bg-gray-200 py-12 px-4 sm:px-6 lg:px-8 rounded-lg">
          <div className="max-w-3xl mx-auto">
            {metadata ? (
              <div className="space-y-6 text-center">
                {metadata.image && (
                  <img
                    src={convertIpfsUrl(metadata.image)}
                    alt={metadata.name}
                    className="mx-auto max-h-64 rounded-lg"
                  />
                )}
                <h2 className="text-3xl font-bold text-gray-900">{metadata.name}</h2>
                <p className="text-xl text-gray-600">{metadata.description}</p>
                <div className="space-x-4">
                  <button
                    onClick={() => router.push('/mint')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Mint NFT
                  </button>
                  <button
                    onClick={() => router.push('/collection')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    View Collection
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">Loading contract metadata...</div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 text-gray-100 p-8 rounded-lg font-mono text-left">
            <h2 className="text-2xl font-bold mb-4">⚠️ Contract Not Deployed</h2>
            <div className="space-y-4">
              <p>To deploy the contract:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Run &quot;pnpm myerc721:deploy&quot; to deploy the contract</li>
                <li>Copy the deployed contract address to NEXT_PUBLIC_CONTRACT_ADDRESS</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
          <p className="text-sm mt-4">See README.md for detailed setup instructions.</p>
        </div>
      )}
    </>
  );
};

export default Home;
