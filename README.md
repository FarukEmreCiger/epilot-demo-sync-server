# 🔄 Bitcoin Sync Service

A Node.js microservice that synchronizes Bitcoin (BTC/USDT) price data with Firebase Realtime Database.

## 🎯 Overview

This service continuously monitors Bitcoin prices and updates the Firebase Realtime Database in real-time. It serves as the backend data provider for the Crypto Tracker application.

## ⚙️ Features

- **🔄 Real-time Updates**: Continuous Bitcoin price monitoring
- **📊 Price Data**: Tracks BTC/USDT pair
- **🔥 Firebase Integration**: Direct updates to Realtime Database

## 📊 Data Structure

The service updates the following structure in Firebase:

```json
{
  "exchange": {
    "btcusdt": {
      "current": {
        "price": 105108.27,
        "lastUpdated": 1749986345548,
      }
    }
  }
}
```

## ⚙️ Configuration

Key configuration options in `config.js`:

- Update interval
- Price source endpoints
- Firebase database paths
- Error retry settings

## 🔒 Security

- Uses Firebase Admin SDK for secure database access
- Implements rate limiting for API calls
- Includes error handling for network issues
