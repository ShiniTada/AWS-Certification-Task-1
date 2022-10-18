"use strict";

const orderService = require("./service/orderService");
const orderUtil = require("./util/orderUtil");

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
    .updateOrder(body.orderId, body.fulfillmentId)
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

function createResponse(statusCode, message) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message),
  };
  return response;
}
