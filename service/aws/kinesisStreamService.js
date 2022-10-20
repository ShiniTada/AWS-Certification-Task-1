"use strinct";

const AWS = require("aws-sdk");
const kinesis = new AWS.Kinesis();

// env variables
const KINESIS_STREAM_NAME = process.env.orderStreamName;

module.exports.placeOrderInStream = (order) => {
  const params = {
    Data: JSON.stringify(order),
    PartitionKey: order.orderId,
    StreamName: KINESIS_STREAM_NAME,
  };
  return kinesis
    .putRecord(params)
    .promise()
    .then((data) => {
      console.log(JSON.stringify(data) + " added in kinesis data stream.");
      return data;
    });
};
