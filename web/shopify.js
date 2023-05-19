import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { PostgreSQLSessionStorage } from "@shopify/shopify-app-session-storage-postgresql";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";
import { Client } from "pg";

// const DB_PATH = process.env.NODE_ENV === 'production' ? `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DATABASE}` : `postgresql://postgres:12345@localhost:5432/postgres`;

const pgClient = new Client({
  user: process.env.NODE_ENV === 'production' ? process.env.PG_USER : 'postgres',
  host: process.env.NODE_ENV === 'production' ? process.env.PG_HOST : 'localhost',
  database: process.env.NODE_ENV === 'production' ? process.env.PG_DATABASE : 'postgres',
  password: process.env.NODE_ENV === 'production' ? process.env.PG_PASSWORD : '12345',
  port: process.env.NODE_ENV === 'production' ? process.env.PG_PORT : '5432',
});
console.log("wds---->", pgClient)
// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
  "My Shopify One-Time Charge": {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: 5.0,
    currencyCode: "USD",
    interval: BillingInterval.OneTime,
  },
};

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined, // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage: new PostgreSQLSessionStorage(pgClient),
});

export default shopify;
