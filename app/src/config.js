// Configuration settings for the airline database portfolio app

// Database connection configuration (for local development)
const dbConfig = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'your_password',
    database: 'airline_db',
    ssl: false
};

// API endpoints (if using backend services)
const apiEndpoints = {
    schema: '/api/schema',
    airports: '/api/airports',
    flights: '/api/flights'
};

// Dataset paths
const datasets = {
    airports: 'data/samples.json',
    aircraft: 'data/samples.json'
};

// Export configurations
export default { dbConfig, apiEndpoints, datasets };

// For production: These values would come from environment variables
// You can add a .env file later to manage these securely