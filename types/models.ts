import type { TCoin, TCurrency } from './api';

export enum Models {
    StockTimestamp = 'StockTimestamp',
}

export type TCoinValues = Record<TCurrency, number>;
export type TCoinMeta = Record<TCoin, TCoinValues>;
export type TStockTimestampModel = {
    time: Date;
    meta: TCoinMeta;
};
