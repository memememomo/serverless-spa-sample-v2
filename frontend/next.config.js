/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    REGION: process.env.REGION,
    USER_POOL_ID: process.env.USER_POOL_ID,
    IDENTITY_POOL_ID: process.env.IDENTITY_POOL_ID,
    USER_POOL_CLIENT_ID:  process.env.USER_POOL_CLIENT_ID,
    API_ENDPOINT: process.env.API_ENDPOINT,
    DISABLE_AUTH: process.env.DISABLE_AUTH,
  },
  reactStrictMode: true,
}
