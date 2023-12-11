const oneDay = 24 * 60 * 60;
const ninetyDays = 90 * oneDay;

export const getTimestampNumber = (from: number, to: number) => {
    const timeDifference = to - from;
    let granularity: number;
    if (timeDifference <= oneDay) {
        granularity = 5 * 60;
    } else if (timeDifference <= ninetyDays) {
        granularity = 60 * 60;
    } else granularity = oneDay;

    return Math.ceil(timeDifference / granularity);
};
