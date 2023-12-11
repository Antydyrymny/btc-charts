import type { TCoin } from '../types';

export const getCoinLabels = (coin: TCoin) => (coin === 'bitcoin' ? 'BTC' : 'ETH');
