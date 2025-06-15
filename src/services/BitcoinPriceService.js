const fetch = require('node-fetch');

class BitcoinPriceService {
    constructor() {
        this.pollingInterval = null;
    }

    async fetchPrice(apiUrl) {
        const url = new URL(apiUrl);
        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.price) {
            return parseFloat(data.price);
        }

        throw new Error('Invalid API response format');
    } catch(error) {
        if (error instanceof TypeError) {
            throw new Error(`Invalid URL format: ${apiUrl}`);
        }
        throw error;
    }

    startPolling(config, callback) {
        this.stopPolling();

        const pollPrice = async () => {
            try {
                const data = await this.fetchPrice(config.api.url);
                await callback(data);
            } catch (error) {
                console.error(`API Error: ${error.message}`);
            }
        };

        pollPrice();
        this.pollingInterval = setInterval(pollPrice, config.api.pollingInterval);
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
}

module.exports = new BitcoinPriceService(); 