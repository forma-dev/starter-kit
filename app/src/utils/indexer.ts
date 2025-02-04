import { config } from '@/config';

export interface Attribute {
  trait_type: string;
  value: string;
}

export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  thumbnail?: string;
  tags?: string[];
  attributes?: Attribute[];
}

export interface Token {
  tokenAddress: string;
  tokenId: string;
  tokenType: string;
  totalSupply: string;
  tokenMetadata: TokenMetadata;
}

export async function getCollectionTokens(
  tokenAddress: string,
  attributes?: Record<string, string>
): Promise<Token[]> {
  if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
    throw new Error('Invalid token address format');
  }

  let url = `${config.apiBaseUrl}/collection/${tokenAddress}/tokens`;

  // Add attributes as query parameters if provided
  if (attributes) {
    const params = new URLSearchParams();
    Object.entries(attributes).forEach(([trait, value]) => {
      params.append(`attributes[${trait}]`, value);
    });
    url += `?${params.toString()}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tokens: ${response.statusText}`);
    }
    const tokens: Token[] = await response.json();
    return tokens;
  } catch (error: any) {
    throw new Error(`Error fetching collection tokens: ${error.message}`);
  }
}
