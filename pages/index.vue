<script lang="ts" setup>
import Slider from '@vueform/slider';
import type { TCoin, TCurrency, THistoryRangeReq, TPriceData } from '../types/api';
import { useToast } from 'vue-toastification';

const coin = ref<TCoin>('bitcoin');
const vs_currency = ref<TCurrency>('usd');

const dayjs = useDayjs();

const { startDate: startDateString } = useRuntimeConfig().public;
const startDate = +startDateString;

const endDate = dayjs().unix();

const granularityOptions = ['1D', '7D', '1M', '6M', '1Y', 'MAX', 'custom'] as const;
const granularity = ref<(typeof granularityOptions)[number]>('MAX');

const changeGranularity = (option: (typeof granularityOptions)[number]) => {
    granularity.value = option;
};

const sliderRange = ref([startDate, endDate]);
const sliderDateFormat = (val: number) => dayjs(val * 1000).format('YYYY-MM-DD');

const requestTimeRange = computed(() => {
    let range: [number, number];
    switch (granularity.value) {
        case '1D':
            range = [dayjs().subtract(1, 'day').unix(), endDate];
            break;
        case '7D':
            range = [dayjs().subtract(7, 'day').unix(), endDate];
            break;
        case '1M':
            range = [dayjs().subtract(1, 'month').unix(), endDate];
            break;
        case '6M':
            range = [dayjs().subtract(6, 'month').unix(), endDate];
            break;
        case '1Y':
            range = [dayjs().subtract(1, 'year').unix(), endDate];
            break;
        case 'MAX':
            range = [startDate, endDate];
            break;
        case 'custom':
            range = [sliderRange.value[0], sliderRange.value[1]];
            break;
    }
    return range;
});
watch(requestTimeRange, () => {
    sliderRange.value = requestTimeRange.value;
});

const {
    data: chartData,
    status,
    error,
} = await useAsyncData(
    `${coin}/${vs_currency}/${requestTimeRange.value[0].toString()}/${requestTimeRange.value[1].toString()}`,
    () =>
        $fetch<TPriceData>('/api/coin-gecko', {
            params: ((): THistoryRangeReq => ({
                coin: coin.value,
                vs_currency: vs_currency.value,
                from: requestTimeRange.value[0],
                to: requestTimeRange.value[1],
            }))(),
        }),
    { watch: [requestTimeRange, coin, vs_currency], server: false }
);

watch(error, () => {
    if (error.value) useToast().error(error.value.message);
});
</script>

<template>
    <div class="container mt-5">
        <form>
            <div class="row mb-3">
                <div class="col-lg-1 col-3">
                    <label for="coinInput">Crypto coin:</label>
                    <select
                        id="coinInput"
                        v-model="coin"
                        :disabled="status === 'pending'"
                        class="form-select"
                    >
                        <option value="bitcoin">BTC</option>
                        <option value="ethereum">ETH</option>
                    </select>
                </div>
                <div class="col-lg-1 col-3">
                    <label for="currencyInput">Currency:</label>
                    <select
                        id="currencyInput"
                        v-model="vs_currency"
                        :disabled="status === 'pending'"
                        class="form-select"
                    >
                        <option value="usd">USD</option>
                        <option value="eur">EUR</option>
                    </select>
                </div>
                <div
                    class="col-1 d-flex justify-content-center align-items-center pt-4 m-0"
                >
                    <div v-show="status === 'pending'" class="row">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-start mb-5">
                <div class="col-lg-4 col-6">
                    <template v-for="option of granularityOptions" :key="option">
                        <input
                            :id="option"
                            :checked="option === granularity"
                            type="radio"
                            class="btn-check"
                            name="options"
                            autocomplete="off"
                            @click="changeGranularity(option)"
                        />
                        <label class="btn outline-none" :for="option">{{ option }}</label>
                    </template>
                </div>
                <div v-show="granularity === 'custom'" class="col-lg-3 col-6">
                    <label for="dateRange" class="form-label">Specify date range</label>
                    <Slider
                        id="dateRange"
                        v-model="sliderRange"
                        :format="sliderDateFormat"
                        :disabled="status === 'pending'"
                        :min="startDate"
                        :max="endDate"
                        :step="86400"
                        :tooltip-position="'bottom'"
                    />
                </div>
            </div>
        </form>
        <div class="row">
            <PriceChart :chart-data="chartData" :coin="coin" :currency="vs_currency" />
        </div>
    </div>
</template>

<style lang="scss" src="@vueform/slider/themes/default.css"></style>
