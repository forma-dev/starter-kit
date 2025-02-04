import { config } from '@/config';

export const convertIpfsUrl = (url: string) => {
  return url.replace('ipfs://', config.ipfsGateway);
};
