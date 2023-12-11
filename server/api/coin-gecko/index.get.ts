import { THistoryRangeReq, TPriceData } from '../../../types';
import { StockTimestampModel } from '../database/models/stockTimestamp';
import { getTimestampNumber } from '../../utils';
import dayjs from 'dayjs';

export default defineEventHandler(async (event): Promise<TPriceData> => {
    const { from, to, coin, vs_currency }: THistoryRangeReq = getQuery(event);

    const { stockExchangeHistoryApiUrl, stockExchangeHistoryApiEndpoint } =
        useRuntimeConfig();
    const url = stockExchangeHistoryApiUrl + coin + stockExchangeHistoryApiEndpoint;

    const searchParams = new URLSearchParams({
        from: from.toString(),
        to: to.toString(),
        vs_currency,
        precision: '2',
    });

    try {
        const existingData = await StockTimestampModel.find({
            time: { $gte: dayjs.unix(from), $lte: dayjs.unix(to) },
        });

        if (
            existingData.length &&
            getTimestampNumber(from, to) <= existingData.length * 1.05 &&
            existingData.every(
                (timestampData) => timestampData.meta[coin][vs_currency] !== -1
            )
        ) {
            return existingData.map((timestampData) => [
                dayjs(timestampData.time).unix(),
                timestampData.meta[coin][vs_currency],
            ]);
        }
        const { prices } = await $fetch<{ prices: TPriceData }>(
            url + '?' + searchParams.toString()
        );

        const existingDataMap = new Map<number, (typeof existingData)[0]>();
        existingData.forEach((timestampData) =>
            existingDataMap.set(dayjs(timestampData.time).unix() * 1000, timestampData)
        );
        await Promise.allSettled(
            prices.map((entry) => {
                if (!existingDataMap.has(entry[0])) {
                    return StockTimestampModel.create({
                        time: entry[0],
                        meta: { [coin]: { [vs_currency]: entry[1] } },
                    });
                } else {
                    const existingEntry = existingDataMap.get(entry[0]);
                    if (existingEntry?.meta[coin][vs_currency] !== entry[1]) {
                        existingEntry!.meta[coin][vs_currency] = entry[1];
                        return existingEntry!.save();
                    }
                }
            })
        );

        return prices;
    } catch (error) {
        throw createError({
            statusCode: (error as { status?: number; message?: string })?.status || 500,
            statusMessage:
                (error as { status?: number; message?: string })?.message ||
                'Server internal error',
        });
    }
});
