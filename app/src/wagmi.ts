import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sketchpad } from 'wagmi/chains';
import { config } from '@/config';

export const wagmiConfig = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: config.projectId,
  chains: [sketchpad],
  ssr: true,
});
