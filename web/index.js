// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { DeliveryMethod } from '@shopify/shopify-api';
import axios from "axios";
import moment from 'moment';
import cron from 'node-cron';

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://ribbon-reel-backend.herokuapp.com/api' : 'http://localhost:8080/';

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

// const handleWebhookRequest = async (
//   topic,
//   shop,
//   webhookRequestBody,
//   webhookId,
//   apiVersion,
// ) => {
//   const sessionId = shopify.api.session.getOfflineId({ shop });

//   // Fetch the session from storage and process the webhook event
// };

// await shopify.api.webhooks.addHandlers({
//   PRODUCTS_CREATE: [
//     {
//       deliveryMethod: DeliveryMethod.Http,
//       callbackUrl: '/api/webhooks',
//       callback: handleWebhookRequest,
//     },
//   ],
//   ORDERS_CREATE: [
//     {
//       deliveryMethod: DeliveryMethod.Http,
//       callbackUrl: '/api/webhooks/orders_create',
//       callback: handleWebhookRequest,
//     },
//   ],
//   FULFILLMENTS_CREATE: [
//     {
//       deliveryMethod: DeliveryMethod.Http,
//       callbackUrl: '/api/webhooks/fulfillment_events_create',
//       callback: handleWebhookRequest,
//     },
//   ]
// });

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

// app.get('/auth/callback', async (req, res) => {
//   try {
//     const callbackResponse = await shopify.api.auth.callback({
//       rawRequest: req,
//       rawResponse: res,
//     });

//     const response = await shopify.api.webhooks.register({
//       session: callbackResponse.session,
//     });

//     if (!response['PRODUCTS_CREATE'][0].success) {
//       console.log(
//         `Failed to register PRODUCTS_CREATE webhook: ${response['PRODUCTS_CREATE'][0].result}`,
//       );
//     }

//     if (!response['ORDERS_CREATE'][0].success) {
//       console.log(
//         `Failed to register ORDERS_CREATE webhook: ${response['ORDERS_CREATE'][0].result}`,
//       );
//     }

//     if (!response['FULFILLMENTS_CREATE'][0].success) {
//       console.log(
//         `Failed to register FULFILLMENTS_CREATE webhook: ${response['FULFILLMENTS_CREATE'][0].result}`,
//       );
//     }
//   } catch (error) {
//     console.error(error); // in practice these should be handled more gracefully
//   }
// });

// app.post('/api/webhooks', express.text({ type: '*/*' }), async (req, res) => {
//   try {
//     // Note: the express.text() given above is an Express middleware that will read
//     // in the body as a string, and make it available at req.body, for this path only.
//     await shopify.api.webhooks.process({
//       rawBody: req.body, // is a string
//       rawRequest: req,
//       rawResponse: res,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// app.post("/api/webhooks/orders_create", async (req, res) => {
//   try {
//     await shopify.api.webhooks.process({
//       rawBody: req.body, // is a string
//       rawRequest: req,
//       rawResponse: res,
//     });
//     const orderData = await shopify.api.rest.Order.find({
//       session: res.locals.shopify.session,
//       id: req.header('x-shopify-order-id'),
//     });
//     if (orderData) {
//       const lineItems = orderData?.line_items?.map((itms) => (
//         itms?.vendor?.indexOf("RIBBON_REELS_CARD") > -1));
//       const array = lineItems?.includes(true);
//       if (array) {
//         const shopData = await shopify.api.rest.Shop.all({ session: res.locals.shopify.session });
//         axios.post(`${baseUrl}/api/orders/mail`, {
//           mail_to: orderData?.customer?.email,
//           store_owner: shopData[0].store_owner,
//           order_number: orderData.order_number
//         })
//           .then(function (response) {
//             console.log('order in---->', response.data);
//           })
//           .catch(function (error) {
//             console.log(error);
//           });
//       }
//     }
//   } catch (e) {
//     console.log(`Failed to process webhook: ${e.message}`);
//     if (!res.headersSent) {
//       res.status(500).send(e.message);
//     }
//   }
// });

// app.post("/api/webhooks/fulfillment_events_create", async (req, res) => {
//   axios.post(`${baseUrl}/api/file/findFile`, {
//     order_id: req.header('x-shopify-order-id')
//   })
//     .then(async function (response) {
//       console.log('fulfillment in---->', response.data);
//       if (response.data.length > 0) {
//         try {
//           await shopify.api.webhooks.process({
//             rawBody: req.body, // is a string
//             rawRequest: req,
//             rawResponse: res,
//           });
//           const orderData = await shopify.api.rest.Order.find({
//             session: res.locals.shopify.session,
//             id: req.header('x-shopify-order-id'),
//           });
//           const orderArray = [orderData];
//           const lineItems = orderArray.length > 0 && orderArray.map(itm => itm?.line_items && itm.line_items.map((itms) => (itms.vendor && itms.vendor.indexOf("RIBBON_REELS_CARD") > -1 ? itms.vendor : 0)).indexOf("RIBBON_REELS_CARD") > -1 ? itm : []);
//           const rows = lineItems && lineItems.map(element => {
//             if (!Array.isArray(element)) {
//               return element;
//             }
//           });
//           const rowsArray = rows && rows.filter(item => item !== undefined);
//           const fulfillmentItems = rowsArray && rowsArray.map(itm =>
//             itm?.fulfillments?.map((itms) =>
//               itms.line_items.map((items) =>
//                 items.vendor.indexOf("RIBBON_REELS_CARD") > -1 ? items.vendor : 0).indexOf("RIBBON_REELS_CARD") > -1 ? itms : 0
//             ));
//           const fulfillmentArray = fulfillmentItems && fulfillmentItems.filter(item => item.length !== 0);
//           fulfillmentArray && fulfillmentArray.map(elements => {
//             elements.map(async element => {
//               const fulfillmentData = await shopify.api.rest.Fulfillment.find({
//                 session: res.locals.shopify.session,
//                 order_id: element.order_id,
//                 id: element.id,
//               });
//               if (fulfillmentData) {
//                 const fulfillmentEventData = await shopify.api.rest.FulfillmentEvent.all({
//                   session: res.locals.shopify.session,
//                   order_id: fulfillmentData.order_id,
//                   fulfillment_id: fulfillmentData.id,
//                 });
//                 console.log("fulfillmentArray--->", fulfillmentEventData);
//                 if (fulfillmentEventData) {
//                   const fulfillmentParticularEventData = fulfillmentEventData && fulfillmentEventData.map(async (item) => {
//                     return await shopify.api.rest.FulfillmentEvent.find({
//                       session: res.locals.shopify.session,
//                       order_id: item.order_id,
//                       fulfillment_id: item.fulfillment_id,
//                       id: item.id,
//                     });
//                   });
//                   if (fulfillmentParticularEventData) {
//                     if (fulfillmentParticularEventData.fulfillment_event.status === "out_for_delivery") {
//                       const shopData = await shopify.api.rest.Shop.all({ session: res.locals.shopify.session });
//                       axios.post(`${baseUrl}/api/orders/mail`, {
//                         mail_to: orderData?.customer?.email,
//                         store_owner: shopData[0].store_owner,
//                         order_number: orderData?.order_number
//                       })
//                         .then(async function (response) {
//                           console.log('fulfillment in---->', response.data);
//                         })
//                         .catch(function (error) {
//                           console.log(error);
//                         });
//                     }
//                     var estimatedDate = new Date(moment(fulfillmentParticularEventData.fulfillment_event.estimated_delivery_at).format('MM/DD/YYYY'));
//                     var estimatedDays = Math.round(((estimatedDate.getTime()) / (1000 * 3600 * 60 * 60 * 24))).toFixed(0);
//                     cron.schedule(`0 0 ${estimatedDays} * *`, async () => {
//                       const shopData = await shopify.api.rest.Shop.all({ session: res.locals.shopify.session });
//                       axios.post(`${baseUrl}/api/orders/mail`, {
//                         mail_to: orderData?.customer?.email,
//                         store_owner: shopData[0].store_owner,
//                         order_number: orderData?.order_number
//                       })
//                         .then(async function (response) {
//                           console.log('fulfillment in---->', response.data);
//                         })
//                         .catch(function (error) {
//                           console.log(error);
//                         });
//                     });
//                   }
//                 }
//               }
//             });
//           });
//         } catch (e) {
//           console.log(`Failed to process webhook: ${e.message}`);
//           if (!res.headersSent) {
//             res.status(500).send(e.message);
//           }
//         }
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });

app.use(express.json());

app.get("/api/shop", async (_req, res) => {
  console.log("xchcsdgc----->", res.locals.shopify.session)
  const shopData = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(shopData);
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.get("/api/orders/all", async (_req, res) => {
  const allOrdersData = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(allOrdersData);
});

app.get("/api/order/:id", async (req, res) => {
  const particularOrderIdData = await shopify.api.rest.Order.find({
    session: res.locals.shopify.session,
    id: req.params.id
  });
  res.status(200).send(particularOrderIdData);
});


app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
