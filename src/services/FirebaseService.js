const admin = require('firebase-admin');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

class FirebaseService {
  constructor() {
    this.db = null;
    this.secretClient = new SecretManagerServiceClient();
  }

  async initialize(config) {
    const secrets = await this.getSecrets(config);
    
    if (secrets.serviceAccountKey) {
      admin.initializeApp({
        credential: admin.credential.cert(secrets.serviceAccountKey),
        databaseURL: secrets.databaseUrl
      });
    } else {
      admin.initializeApp({
        databaseURL: secrets.databaseUrl
      });
    }
    
    this.db = admin.database();
  }

  async getSecrets(config) {
    try {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
      
      if (process.env.NODE_ENV === 'production' && projectId) {
        const [serviceAccountResponse] = await this.secretClient.accessSecretVersion({
          name: `projects/${projectId}/secrets/firebase-service-account-key/versions/latest`,
        });
        
        const [databaseUrlResponse] = await this.secretClient.accessSecretVersion({
          name: `projects/${projectId}/secrets/firebase-database-url/versions/latest`,
        });
        
        const serviceAccountKey = serviceAccountResponse.payload.data.toString();
        const databaseUrl = databaseUrlResponse.payload.data.toString();
        
        return {
          serviceAccountKey: JSON.parse(serviceAccountKey),
          databaseUrl: databaseUrl.trim()
        };
      }
      
      return {
        serviceAccountKey: config.firebase.serviceAccountKeyFile ? 
          require(config.firebase.serviceAccountKeyFile) : null,
        databaseUrl: config.firebase.databaseUrl
      };
    } catch (error) {
      throw new Error(`Failed to retrieve secrets: ${error.message}`);
    }
  }

  async saveBitcoinPrice(price, path) {
    const priceData = {
      price: parseFloat(price),
      lastUpdated: admin.database.ServerValue.TIMESTAMP,
    };

    await this.db.ref(path).set(priceData);
    return priceData;
  }
}

module.exports = new FirebaseService(); 