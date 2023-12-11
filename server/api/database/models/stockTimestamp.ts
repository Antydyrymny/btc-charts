import mongoose from 'mongoose';
import { Models, TCoinValues, TStockTimestampModel } from '../../../../types';

const CoinValuesSchema = new mongoose.Schema<TCoinValues>({
    usd: {
        type: Number,
        default: -1,
    },
    eur: {
        type: Number,
        default: -1,
    },
});

const StockTimestampSchema = new mongoose.Schema<TStockTimestampModel>({
    time: {
        type: Date,
        required: true,
        unique: true,
        immutable: true,
    },
    meta: {
        bitcoin: { type: CoinValuesSchema, default: () => ({}) },
        ethereum: { type: CoinValuesSchema, default: () => ({}) },
    },
});

export const StockTimestampModel = mongoose.model<TStockTimestampModel>(
    Models.StockTimestamp,
    StockTimestampSchema
);
