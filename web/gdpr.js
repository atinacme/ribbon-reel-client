import { DeliveryMethod } from "@shopify/shopify-api";
import axios from "axios";
import moment from 'moment';
import cron from 'node-cron';
import pkg from 'pg';
import shopify from "./shopify.js";
const { Client } = pkg;
/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
const isProduction = process.env.NODE_ENV === "production";
const baseUrl = isProduction ? 'https://ribbon-reel-backend.herokuapp.com/api' : 'http://localhost:8080/api';
const client = new Client({
  host: isProduction ? process.env.PG_HOST : "localhost",
  user: isProduction ? process.env.PG_USER : "postgres",
  password: isProduction ? process.env.PG_PASSWORD : "12345",
  database: isProduction ? process.env.PG_DATABASE : "postgres",
  port: 5432,
})
await client.connect()
export default {
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "orders_requested": [
      //     299938,
      //     280263,
      //     220458
      //   ],
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "data_request": {
      //     "id": 9999
      //   }
      // }
    },
  },

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "orders_to_redact": [
      //     299938,
      //     280263,
      //     220458
      //   ]
      // }
    },
  },

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com"
      // }
    },
  },

  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      if (payload) {
      }
    },
  },

  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log('ORDERS_CREATE', payload);
      if (payload) {
        try {
          const query = {
            text: 'SELECT * FROM shopify_sessions where shop = $1',
            values: [shop],
          }
          const data = await client.query(query)
          const lineItems = payload?.line_items?.map((itms) => (itms?.vendor?.indexOf("RIBBON_REELS_CARD") > -1));
          const array = lineItems?.includes(true);
          if (array) {
            const shopData = await shopify.api.rest.Shop.all({ session: data.rows[0] });
            const orderArray = [payload];
            const lineItemsOrders = orderArray.map(itm => itm.line_items.map((itms) => (itms.vendor.indexOf("RIBBON_REELS_CARD") > -1 ? itms.vendor : 0)).indexOf("RIBBON_REELS_CARD") > -1 ? itm : []);
            const rows = lineItemsOrders.map(element => {
              if (!Array.isArray(element)) {
                return element;
              }
            });
            const rowsArray = rows.filter(item => item !== undefined);
            const newArr = rowsArray.map(v => ({
              ...v, store_owner: shopData.data[0].shop_owner,
              reel_revenue: v.line_items[0].price,
              shop: shop
            }));
            axios.post(`${baseUrl}/orders/create`, newArr)
              .then(function (response) {
                axios.post(`${baseUrl}/orders/mailAndMessage`, {
                  mail_to: payload.customer.email,
                  order_id: payload.id,
                  sender_name: payload.customer.first_name + ' ' + payload.customer.last_name,
                  sender_phone: payload.customer.phone
                })
                  .then(function (response) {
                    console.log('mail---->', orderData, response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              })
              .catch(function (error) {
                // console.log(error);
              });
          }
        } catch (e) {
          console.log(`Failed to process webhook: ${e.message}`);
        }
      }
    },
  },

  FULFILLMENTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log('FULFILLMENTS_CREATE', payload);
      if (payload) {
        const query = {
          text: 'SELECT * FROM shopify_sessions where shop = $1',
          values: [shop],
        }
        const data = await client.query(query)
        axios.get(`${baseUrl}/file/findFile/${payload.id}/gifter`)
          .then(async function (response) {
            if (response) {
              try {
                const orderData = await shopify.api.rest.Order.find({
                  session: data.rows[0],
                  id: payload.id,
                });
                const orderArray = [orderData];
                const lineItems = orderArray.map(itm => itm.line_items.map((itms) => (itms.vendor.indexOf("RIBBON_REELS_CARD") > -1 ? itms.vendor : 0)).indexOf("RIBBON_REELS_CARD") > -1 ? itm : []);
                const rows = lineItems.map(element => {
                  if (!Array.isArray(element)) {
                    return element;
                  }
                });
                const rowsArray = rows.filter(item => item !== undefined);
                const fulfillmentItems = rowsArray.map(itm =>
                  itm.fulfillments.map((itms) =>
                    itms.line_items.map((items) =>
                      items.vendor.indexOf("RIBBON_REELS_CARD") > -1 ? items.vendor : 0).indexOf("RIBBON_REELS_CARD") > -1 ? itms : 0
                  ));
                const fulfillmentArray = fulfillmentItems.filter(item => item.length !== 0);
                fulfillmentArray.map(elements => {
                  elements.map(async element => {
                    const fulfillmentData = await shopify.api.rest.Fulfillment.find({
                      session: data.rows[0],
                      order_id: element.order_id,
                      id: element.id,
                    });
                    if (fulfillmentData) {
                      const fulfillmentEventData = await shopify.api.rest.FulfillmentEvent.all({
                        session: data.rows[0],
                        order_id: fulfillmentData.order_id,
                        fulfillment_id: fulfillmentData.id,
                      });
                      // console.log("fulfillmentArray--->", fulfillmentEventData);
                      if (fulfillmentEventData) {
                        const fulfillmentParticularEventData = fulfillmentEventData.map(async (item) => {
                          return await shopify.api.rest.FulfillmentEvent.find({
                            session: data.rows[0],
                            order_id: item.order_id,
                            fulfillment_id: item.fulfillment_id,
                            id: item.id,
                          });
                        });
                        if (fulfillmentParticularEventData) {
                          if (fulfillmentParticularEventData.fulfillment_event.status === "out_for_delivery") {
                            const shopData = await shopify.api.rest.Shop.all({ session: data.rows[0] });
                            axios.post(`${baseUrl}/orders/mailAndMessage`, {
                              mail_to: orderData.customer.email,
                              order_id: orderData.id,
                              sender_name: orderData.customer.first_name + ' ' + orderData.customer.last_name,
                              sender_phone: orderData.customer.phone
                            })
                              .then(async function (response) {
                                // console.log('fulfillment in---->', response.data);
                              })
                              .catch(function (error) {
                                // console.log(error);
                              });
                          }
                          var estimatedDate = new Date(moment(fulfillmentParticularEventData.fulfillment_event.estimated_delivery_at).format('MM/DD/YYYY'));
                          var estimatedDays = Math.round(((estimatedDate.getTime()) / (1000 * 3600 * 60 * 60 * 24))).toFixed(0);
                          cron.schedule(`0 0 ${estimatedDays} * *`, async () => {
                            const shopData = await shopify.api.rest.Shop.all({ session: data.rows[0] });
                            axios.post(`${baseUrl}/orders/mailAndMessage`, {
                              mail_to: orderData.customer.email,
                              order_id: orderData.id,
                              sender_name: orderData.customer.first_name + ' ' + orderData.customer.last_name,
                              sender_phone: orderData.customer.phone
                            })
                              .then(async function (response) {
                                // console.log('fulfillment in---->', response.data);
                              })
                              .catch(function (error) {
                                // console.log(error);
                              });
                          });
                        }
                      }
                    }
                  });
                });
              } catch (e) {
                console.log(`Failed to process webhook: ${e.message}`);
              }
            }
          })
          .catch(function (error) {
            // console.log(error);
          });
      }
    },
  },
};

// await client.end()