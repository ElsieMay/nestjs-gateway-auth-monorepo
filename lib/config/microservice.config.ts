export const microserviceConfig = {
  auth: {
    host: process.env.AUTH_SERVICE_HOST || '127.0.0.1',
    port: parseInt(process.env.AUTH_SERVICE_PORT || '3002', 10),
  },
  gateway: {
    port: parseInt(process.env.GATEWAY_PORT || '3000', 10),
  },
};
