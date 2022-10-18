"use strinct";

const AWS = require("aws-sdk");

// env variables
const TABLE_NAME = process.env.orderTableName;

const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.saveOrder = (order) => {
  const params = {
    TableName: TABLE_NAME,
    Item: order,
  };
  return dynamo.put(params).promise();
};

module.exports.getOrderById = (orderId) => {
  const params = {
    Key: {
      orderId: orderId,
    },
    TableName: TABLE_NAME,
  };
  return dynamo
    .get(params)
    .promise()
    .then((result) => {
      return result.Item;
    });
};
