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
    console.log(JSON.stringify(order) + " created in database.");

    const data = kinesisStreamService.placeOrderInStream(order);
    console.log(JSON.stringify(order) + " added in kinesis data stream.");
    return data;
  });
};

/**
 * Make order fulfilled, update order in database and put to Kinesis stream
 * @param orderId
 * @param fulfillmentId
 * @returns updated order
 */
module.exports.updateOrder = (orderId, fulfillmentId) => {
  return dynamoDbService.getOrderById(orderId).then((order) => {
    console.log("Get order form database: " + JSON.stringify(order));
    const fulfilledOrder = orderUtil.makeOrderFulfilled(order, fulfillmentId);

    return dynamoDbService.saveOrder(fulfilledOrder).then(() => {
      console.log(
        JSON.stringify(fulfilledOrder) + " order updated in database."
      );

      const data = kinesisStreamService.placeOrderInStream(fulfilledOrder);
      console.log(
        JSON.stringify(fulfilledOrder) + " added in kinesis data stream."
      );
      return data;
    });
  });
};
