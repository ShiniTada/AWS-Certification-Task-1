"use strinct";

//run command: npm i uuid --save
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

// env variables
const TABLE_NAME = process.env.orderTableName;
const KINESIS_STREAM_NAME = process.env.orderStreamName;

const dynamo = new AWS.DynamoDB.DocumentClient();
const kinesis = new AWS.Kinesis();

module.exports.createOrder = (body) => {
  const order = {
    orderId: uuidv4(),
    name: body.name,
    address: body.address,
    productId: body.productId,
    quantity: body.quantity,
    orderDate: Date.now(),
    eventType: "order_placed",
  };
  console.log("input converted to Order object: " + JSON.stringify(order));
  return order;
};

/**
 * Save order it table and put order to Kinesis stream
 * @param order
 * @returns saved order
 */
module.exports.placeNewOrder = (order) => {
  return saveNewOrder(order).then(() => {
    console.log(JSON.stringify(order) + " created in database.");
    let savedOrder = placeOrderInStream(order);
    console.log(JSON.stringify(order) + " added in kinesis data stream.");
    return savedOrder;
  });
};

function saveNewOrder(order) {
  const params = {
    TableName: TABLE_NAME,
    Item: order,
  };
  return dynamo.put(params).promise();
}

function placeOrderInStream(order) {
  const params = {
    Data: JSON.stringify(order),
    PartitionKey: order.orderId,
    StreamName: KINESIS_STREAM_NAME,
  };
  return kinesis.putRecord(params).promise();
}
