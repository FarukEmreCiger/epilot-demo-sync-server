const express = require('express');
const router = express.Router();

class ApiRouter {
  constructor(config) {
    this.config = config;
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get('/', this.getServiceInfo.bind(this));
    this.router.get('/status', this.getStatus.bind(this));
    this.router.get('/health', this.getHealth.bind(this));
  }

  getServiceInfo(req, res) {
    res.json({
      message: 'Bitcoin Price Sync Service',
      status: 'running',
      method: 'HTTP Polling',
      source: this.config.api.source,
      interval: `${this.config.api.pollingInterval / 1000} seconds`,
      endpoints: {
        status: '/status',
        health: '/health',
        data: '/data'
      },
      timestamp: new Date().toISOString()
    });
  }

  getStatus(req, res) {
    res.json({
      status: 'running',
      service: 'Bitcoin Price Sync',
      method: 'HTTP Polling',
      source: this.config.api.source,
      interval: `${this.config.api.pollingInterval / 1000} seconds`,
      timestamp: new Date().toISOString(),
      message: 'Bitcoin price monitoring service is operational'
    });
  }

  getHealth(req, res) {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ApiRouter; 