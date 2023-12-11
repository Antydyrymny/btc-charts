<script lang="ts" setup>
import { Line } from 'vue-chartjs';
import type { TCoin, TCurrency, TPriceData } from '../types';
import { getCoinLabels } from '../utils/getCoinLabel';

const props = defineProps<{
    chartData: TPriceData | null;
    coin: TCoin;
    currency: TCurrency;
}>();
const { chartData, coin, currency } = toRefs(props);
const dayjs = useDayjs();

const formattedData = computed(() => ({
    labels: chartData?.value?.map((entry) => entry[0]) ?? [],
    datasets: [
        {
            label: `${getCoinLabels(coin.value)} to ${currency.value.toUpperCase()}`,
            data: chartData?.value?.map((entry) => entry[1]) ?? [],
            fill: true,
            borderColor: '#10b981',
            tension: 0.25,
            pointRadius: 0,
            pointHitRadius: 5,
        },
    ],
}));

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            callbacks: {
                title: (context: { dataIndex: number }[]) =>
                    dayjs
                        .unix(formattedData.value.labels[context[0].dataIndex])
                        .format('YYYY-MM-DD'),
            },
        },
    },
    scales: {
        x: {
            min: chartData?.value?.[0]?.[0],
            max: chartData?.value?.at(-1)?.[0],
            type: 'linear',
            content:
                chartData?.value?.map((entry) =>
                    dayjs.unix(entry[0]).format('YYYY-MM-DD')
                ) ?? [],
            ticks: {
                maxTicksLimit: 7,
                callback: (label: string) => dayjs(+label * 1000).format('YYYY-MM-DD'),
            },
        },
    },
}));
</script>

<template>
    <div class="canvas">
        <Line :data="formattedData" :options="(chartOptions as unknown as undefined)" />
    </div>
</template>

<style lang="scss" scoped>
.canvas {
    min-height: 30rem;
}
</style>
