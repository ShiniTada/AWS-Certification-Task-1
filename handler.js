"use strict";

const orderManager = require("./orderManager");

/**
 * Place new order and return response
 * @param event
 * @returns response with statusCode and body
 */
module.exports.createOrder = async (event) => {
  const body = JSON.parse(event.body);
  const order = orderManager.createOrder(body);

  return orderManager
    .placeNewOrder(order)
    .then(() => {
      return createResponse(200, order);
    })
    .catch((error) => {
      console.log(
        "Error occured during order creation. " + JSON.stringify(error)
      );
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
