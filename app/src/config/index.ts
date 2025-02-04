export const config = {
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://modularium-api.sketchpad-1.forma.art",
  ipfsGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/ipfs/",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "WALLET_CONNECT_PROJECT_ID",
} as const;

export type Config = typeof config;
