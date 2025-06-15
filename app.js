const express = require('express');
const config = require('./src/config/config');
const firebaseService = require('./src/services/FirebaseService');
const bitcoinPriceService = require('./src/services/BitcoinPriceService');
const ApiRouter = require('./src/routes/apiRouter');

class Application {
  constructor() {
    this.app = express();
    this.setupExpress();
  }

  setupExpress() {
    const apiRouter = new ApiRouter(config);
    this.app.use('/', apiRouter.getRouter());
  }

  async start() {
    try {
      await firebaseService.initialize(config);
      
      this.app.listen(config.server.port, () => {
        console.log(`${config.messages.serverStarted} ${config.server.port}`);
      });
      
      bitcoinPriceService.startPolling(config, async (price) => {
        await firebaseService.saveBitcoinPrice(price, config.firebase.dataPath);
      });
      
      this.setupShutdownHandlers();
    } catch (error) {
      console.error('Application startup failed:', error);
      process.exit(1);
    }
  }

  setupShutdownHandlers() {
    const shutdown = () => {
      console.log(config.messages.shutdownSignal);
      bitcoinPriceService.stopPolling();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }
}

const app = new Application();
app.start(); 