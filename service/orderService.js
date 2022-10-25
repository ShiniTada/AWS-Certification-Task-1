"use strinct";

const orderUtil = require("../util/orderUtil");
const dynamoDbService = require("./aws/dynamoDbService");
const kinesisStreamService = require("./aws/kinesisStreamService");

/**
 * Save order it table and put order to Kinesis stream
 * @param order
 * @returns saved order
 */
module.exports.placeNewOrder = (order) => {
  return dynamoDbService.saveOrder(order).then(() => {
    return kinesisStreamService.placeOrderInStream(order);
  });
};

/**
 * Make order fulfilled, update order in database and put to Kinesis stream
 * @param orderId
 * @param fulfillmentId
 * @returns updated order
 */
module.exports.updateOrderAndSendToKinesis = (orderId, fulfillmentId) => {
  return dynamoDbService.getOrderById(orderId).then((order) => {
    const fulfilledOrder = orderUtil.makeOrderFulfilled(order, fulfillmentId);
    return dynamoDbService.saveOrder(fulfilledOrder).then(() => {
      return kinesisStreamService.placeOrderInStream(fulfilledOrder);
    });
  });
};

/**
 * Set delivery date to order, update order in database and put to SQS Queue
 * @param orderId
 * @returns updated order
 */
module.exports.updateOrderAndSendToQueue = (orderId) => {
  return dynamoDbService.getOrderById(orderId).then((order) => {
    order.sentToDeliveryDate = Date.now();
    return dynamoDbService.saveOrder(order).then(() => {
      return sqsService.sendMessage(
        DELIVERY_COMPANY_NAME,
        JSON.stringify(order)
      );
    });
  });
};
