<script lang="ts" setup>
import Slider from '@vueform/slider';
import type { TCoin, TCurrency, THistoryRangeReq, TPriceData } from '../types/api';

const coin = ref<TCoin>('bitcoin');
const vs_currency = ref<TCurrency>('usd');

const dayjs = useDayjs();

const { startDate: startDateString } = useRuntimeConfig().public;
const startDate = +startDateString;

const endDate = dayjs().unix();

const sliderRange = ref([startDate, endDate]);
const dateFormat = (val: number) => dayjs(val * 1000).format('YYYY-MM-DD');

const {
    data: chartData,
    status,
    error,
} = await useAsyncData(
    `${coin}/${vs_currency}/${sliderRange.value[0].toString()}/${sliderRange.value[1].toString()}`,
    () =>
        $fetch<TPriceData>('/api/coin-gecko', {
            params: ((): THistoryRangeReq => ({
                coin: coin.value,
                vs_currency: vs_currency.value,
                from: sliderRange.value[0],
                to: sliderRange.value[1],
            }))(),
        }),
    { watch: [sliderRange, coin, vs_currency], server: false }
);
</script>

<template>
    <div class="container mt-5">
        <form>
            <div class="row mb-2">
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
            <div class="row mb-5">
                <div class="col-lg-3 col-6">
                    <label for="dateRange" class="form-label">Specify date range</label>
                    <Slider
                        id="dateRange"
                        v-model="sliderRange"
                        :format="dateFormat"
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
        <div v-show="error">Error loading chart data: {{ error?.message }}</div>
    </div>
</template>

<style lang="scss" src="@vueform/slider/themes/default.css"></style>
