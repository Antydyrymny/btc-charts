export type TCoin = 'bitcoin' | 'ethereum';
export type TCurrency = 'usd' | 'eur';

export type THistoryRangeReq = {
    coin: TCoin;
    vs_currency: TCurrency;
    from: number;
    to: number;
};

export type TPriceData = [number, number][];
