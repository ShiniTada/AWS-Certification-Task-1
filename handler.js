"use strict";

const orderService = require("./service/orderService");
const orderUtil = require("./util/orderUtil");
const kinesisUtil = require("./util/kinensisUtil");
const cakeMakerService = require("./service/cakeMakerService");
const deliveryService = require("./service/deliveryService");

/**
 * Save new order and return response
 * @param event
 * @returns response with statusCode and body
 */
module.exports.createOrder = async (event) => {
  const body = JSON.parse(event.body);
  const order = orderUtil.createOrder(body);

  return orderService
    .placeNewOrder(order)
    .then(() => {
      return createResponse(200, order);
    })
    .catch((error) => {
      console.log(
        "Error occurred during order creation. " + JSON.stringify(error)
      );
      return createResponse(400, error);
    });
};

/**
 * Update order as fulfilled and return response
 * @param event
 * @returns response with statusCode and body
 */
module.exports.fulfillOrder = async (event) => {
  const body = JSON.parse(event.body);

  return orderService
    .updateOrderAndSendToKinesis(body.orderId, body.fulfillmentId)
    .then(() => {
      return createResponse(
        200,
        `Order with orderId:${body.orderId} was sent to delivery.`
      );
    })
    .catch((error) => {
      console.log("Error occurred while updating the order. " + error);
      return createResponse(400, error);
    });
};

module.exports.notifyExternalParties = async (event) => {
  const orders = kinesisUtil.getRecords(event);
  notifyCakeMaker(orders);
  notifyDelivery(orders);
};

module.exports.notifyDeliveryCompany = async (event) => {
  // Some HTTP call!
  console.log("Nofitying some external resource about order readiness.");
};

function notifyCakeMaker(orders) {
  const placedOrders = orders.filter((r) => r.eventType === "order_placed");
  console.log("received new orders: " + JSON.stringify(placedOrders));
  if (placedOrders.length > 0) {
    cakeMakerService.handlePlacedOrders(placedOrders);
    return "Cake maker is notified.";
  }
}

function notifyDelivery(orders) {
  const fulfilledOrders = orders.filter(
    (r) => r.eventType === "order_fulfilled"
  );
  console.log("received fulfilled orders: " + JSON.stringify(fulfilledOrders));
  if (fulfilledOrders.length > 0) {
    deliveryService.handleFulfilledOrders(fulfilledOrders);
    return "Delivery is notified.";
  }
}

function createResponse(statusCode, message) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
  return response;
}
