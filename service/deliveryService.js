"use strict";

const sqsService = require("./aws/sqsService");
const orderService = require("./orderService");

const DELIVERY_COMPANY_NAME = process.env.deliveryCompanyQueue;

module.exports.handleFulfilledOrders = (orders) => {
  let responses = [];
  for (let order of orders) {
    orderService.updateOrderAndSendToQueue(order.orderId).then((data) => {
      responses.push(data);
      console.log("SQS responses: " + JSON.stringify(responses));
    });
  }
  return responses;
};
