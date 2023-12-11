import eslintPlugin from 'vite-plugin-eslint';

export default defineNuxtConfig({
    vite: {
        plugins: [eslintPlugin()],
    },
    modules: ['dayjs-nuxt'],
    css: ['~/assets/styles/main.scss'],
    nitro: {
        plugins: ['~/server/index.ts'],
    },
    runtimeConfig: {
        stockExchangeHistoryApiUrl: process.env.STOCK_EXCHANGE_HISTORY_API_URL,
        stockExchangeHistoryApiEndpoint: process.env.STOCK_EXCHANGE_HISTORY_ENDPOINT,
        mongodbUri: process.env.MONGODB_URI,
        public: {
            startDate: process.env.STOCK_EXCHANGE_HISTORY_API_START_DATE,
        },
    },
    devtools: { enabled: true },
});
