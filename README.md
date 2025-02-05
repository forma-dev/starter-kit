# Forma Starter Kit

This project is a starter kit for Forma NFT projects featuring an ERC721 smart contract and a Next.js frontend.

## Features

- ERC721 smart contract
  - Onchain metadata
  - Built-in royalty support (EIP-2981)
  - Owner-only minting
- Hardhat for contract development and deployment
- Next.js frontend with Web3 integration (wagmi + viem)

## Prerequisites

- Node.js (v18 or later)
- pnpm
- A wallet with testnet TIA (for contract deployment)

## Project Structure

```
├── app/                    # Next.js frontend application
├── contracts/             # Smart contract source code
└── scripts/              # Deployment and verification scripts
```

## Getting Started

### 1. Install Dependencies

```bash
# Install root project dependencies
pnpm i

# Install frontend dependencies
cd app && pnpm i
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Set `PRIVATE_KEY_SKETCHPAD` to the private key of the deployer wallet.

Create a `.env.local` file in the `app` directory:
```bash
cd app
cp .env.example .env.local
```

### 3. Configure Contract Parameters

The contract configuration is located in `scripts/myerc721.ts`. You can customize contract metadata and constructor arguments, including:
- Contract name
- Symbol
- Description
- Default royalty fee (in basis points)
- Contract metadata image

```typescript
export const myErc721Config = {
  contractMetadata: {
    name: "ExampleERC721",
    description: "Your contract description",
    image: "ipfs://your_image_uri",
  },
  symbol: "EXAMPLE",
  defaultRoyaltyFeeNumerator: 500, // 5%
};
```

### 4. Compile the Contract

```bash
pnpm contracts:compile
```

### 5. Deploy the Contract

```bash
pnpm myerc721:deploy
```

After deployment, update the contract address in:
- `scripts/myerc721.ts`
- `app/.env.local` (NEXT_PUBLIC_CONTRACT_ADDRESS)

### 5. Verify the Contract

```bash
pnpm myerc721:verify
```

### 6. Run the Frontend

```bash
pnpm app:dev
```

The application will be available at `http://localhost:3000`

## Development

### Smart Contract

The main contract is `MyERC721.sol` in the `contracts` directory. It includes:
- ERC721 standard implementation
- On-chain metadata support
- Updatable metadata
- Cementable metadata
- Royalty support (EIP-2981)
- Owner-only minting

### Frontend

The frontend is built with:
- Next.js 15
- TailwindCSS for styling
- wagmi + viem for Web3 interactions
- RainbowKit for wallet integration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
