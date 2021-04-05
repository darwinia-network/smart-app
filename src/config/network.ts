import { NetworkConfig } from '../model';

export const STYLE_CONFIG: NetworkConfig<{ icon: string; bg: string }> = {
  crab: { icon: '/image/crab.svg', bg: 'bg-crab' },
  darwinia: { icon: '/image/darwinia.svg', bg: 'bg-main' },
  pangolin: { icon: '/image/pangolin.svg', bg: 'bg-pangolin' },
};
