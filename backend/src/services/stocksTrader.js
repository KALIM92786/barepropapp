const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://api.stockstrader.com/api/v1';
const IS_TEST = process.env.TEST_MODE === 'true';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.STOCKSTRADER_TOKEN}`,
        'Accept': 'application/json'
    }
});

// Mock Data Generators
const mockAccount = () => ({
    code: 'ok',
    data: {
        cash: {
            available_to_invest: 10000 + Math.random() * 100,
            my_portfolio: 5000,
            investments: 0
        },
        margin: {
            equity: 15000 + Math.random() * 200 - 100,
            balance: 15000,
            margin: 2000,
            free_margin: 13000
        }
    }
});

const mockDeals = () => ({
    code: 'ok',
    data: [
        {
            id: 'deal_' + Math.floor(Math.random() * 1000),
            ticker: 'EURUSD',
            volume: 1000,
            side: 'buy',
            open_price: 1.0500,
            open_time: Date.now() - 100000,
            close_price: 1.0550,
            close_time: Date.now(),
            profit: 50.00,
            status: 'closed'
        },
        {
            id: 'deal_open_1',
            ticker: 'GBPUSD',
            volume: 2000,
            side: 'sell',
            open_price: 1.2000,
            open_time: Date.now() - 50000,
            close_price: 0,
            close_time: 0,
            profit: -10.00,
            status: 'open' // Simulating open deal
        }
    ]
});

const mockOrders = () => ({
    code: 'ok',
    data: [
        {
            id: 'ord_' + Math.floor(Math.random() * 1000),
            ticker: 'XAUUSD',
            volume: 1,
            side: 'buy',
            type: 'limit',
            status: 'active',
            price: 2000.50
        }
    ]
});

const mockQuote = (ticker) => ({
    code: 'ok',
    data: {
        ask_price: 2001.00 + Math.random(),
        bid_price: 2000.00 + Math.random(),
        last_price: 2000.50,
        last_price_time: Date.now() / 1000
    }
});

const handleApiError = (err, context) => {
    if (err.response) {
        const { status, data } = err.response;
        if (status === 401) {
            console.error(`[${context}] 401 Unauthorized - Check STOCKSTRADER_TOKEN`);
        } else if (status === 400) {
            console.error(`[${context}] 400 Bad Request - ${JSON.stringify(data)}`);
        } else {
            console.error(`[${context}] API Error ${status}:`, data);
        }
    } else {
        console.error(`[${context}] Network/Server Error:`, err.message);
    }
    throw err;
};

module.exports = {
    getAccount: async (accountId) => {
        if (IS_TEST) return mockAccount();
        try {
            const res = await client.get(`/accounts/${accountId}`);
            return res.data;
        } catch (err) { handleApiError(err, 'getAccount'); }
    },

    getDeals: async (accountId) => {
        if (IS_TEST) return mockDeals();
        try {
            const res = await client.get(`/accounts/${accountId}/deals?limit=100`);
            return res.data;
        } catch (err) { handleApiError(err, 'getDeals'); }
    },

    getOrders: async (accountId) => {
        if (IS_TEST) return mockOrders();
        try {
            const res = await client.get(`/accounts/${accountId}/orders?limit=100`);
            return res.data;
        } catch (err) { handleApiError(err, 'getOrders'); }
    },

    getQuote: async (accountId, ticker) => {
        if (IS_TEST) return mockQuote(ticker);
        try {
            const res = await client.get(`/accounts/${accountId}/instruments/${ticker}/quote`);
            return res.data;
        } catch (err) { handleApiError(err, 'getQuote'); }
    }
};