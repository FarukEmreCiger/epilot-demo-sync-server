require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 3000
  },
  
  firebase: {
    databaseUrl: process.env.FIREBASE_DATABASE_URL,
    dataPath: process.env.FIREBASE_DATA_PATH
  },
  
  api: {
    url: process.env.COINCAP_API_URL,
    source: 'CoinCap',
    pollingInterval: parseInt(process.env.POLLING_INTERVAL)
  },
  
  messages: {
    serverStarted: 'Server is running on port',
    monitoringStarted: 'Bitcoin price monitoring started',
    shutdownSignal: 'Received shutdown signal'
  }
};

module.exports = config; 