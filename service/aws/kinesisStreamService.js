"use strinct";

const AWS = require("aws-sdk");

// env variables
const KINESIS_STREAM_NAME = process.env.orderStreamName;

const kinesis = new AWS.Kinesis();

module.exports.placeOrderInStream = (order) => {
  const params = {
    Data: JSON.stringify(order),
    PartitionKey: order.orderId,
    StreamName: KINESIS_STREAM_NAME,
  };
  return kinesis.putRecord(params).promise();
};
